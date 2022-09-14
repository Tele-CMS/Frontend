import { CommonService } from "src/app/platform/modules/core/services";
import {
  Component,
  OnInit,
  Renderer2,
  ViewChild,
  ElementRef,
  ViewEncapsulation,
  Input
} from "@angular/core";
import { ChatService } from "./chat.service";

var localstream;
var localDisplayName = "localuser";

var videoroomname = "all";
var serverConnection;
var peerConnectionConfig = {
  iceServers: [
    {
      urls: "stun:stun.l.google.com:19302"
    },
    {
      urls: "turn:turn.stagingsdei.com:3478?transport=tcp",
      username: "turnserverU",
      credential: "turnserverP"
    },
    {
      urls: "turn:turn.stagingsdei.com:3478?transport=udp",
      username: "turnserverU",
      credential: "turnserverP"
    }
  ]
};

var peerConnections = {};

var localUuid;
@Component({
  selector: "app-mean-video",
  templateUrl: "./mean-video.component.html",
  styleUrls: ["./mean-video.component.css"],
  encapsulation: ViewEncapsulation.None
})
 class MeanVideoComponent implements OnInit {
  @Input("app-id") appId: string;
  @Input("display-name") userDisplayName: string;
  mutebutton = false;
  videomute = false;
  allUsers = [];
  @ViewChild("video") videoElement: ElementRef;
  @ViewChild("remoteVideo") remoteVideo: ElementRef;
  constraints = {
    video: {
      facingMode: "environment",
      width: { ideal: 4096 },
      height: { ideal: 2160 }
    },
    audio: true
  };

  constructor(
    private renderer: Renderer2,
    private chatService: ChatService,
    private commonService: CommonService
  ) {}

  ngOnInit(): void {
    this.chatService.nameobserver.subscribe((res: any) => {
      localDisplayName = res.username;
      videoroomname = res.roomname;
    });
    console.log("Display Name : " + localDisplayName);
    console.log("Room Name : " + videoroomname);
    localUuid = this.createUUID();
    // localDisplayName = 'user-'+localUuid;
    console.log("localUuid 11", localUuid);
    this.chatService.getUserList().subscribe((getUserListdata: any) => {
      console.log(" getUserList 222", getUserListdata);
    });
    this.chatService.getMessage().subscribe(signal => {
      console.log("getMessage 333", signal);
      const peerUuid = signal.uuid;
      if (
        peerUuid == localUuid ||
        (signal.roomname != localUuid && signal.roomname != videoroomname)
      )
        return;
      if (signal.displayName && signal.roomname == videoroomname) {
        // set up peer connection object for a newcomer peer
        this.setUpPeer(peerUuid, signal.displayName, signal.id);
        const messageData = {
          id: signal.id,
          displayName: signal.displayName,
          uuid: localUuid,
          roomname: peerUuid
        };
        this.chatService.sendMessage(messageData);
      } else if (signal.displayName && signal.roomname == localUuid) {
        // initiate call if we are the newcomer peer
        this.setUpPeer(peerUuid, signal.displayName, signal.id, true);
      } else if (signal.sdp) {
        peerConnections[peerUuid].pc
          .setRemoteDescription(new RTCSessionDescription(signal.sdp))
          .then(() => {
            // Only create answers in response to offers
            if (signal.sdp.type == "offer") {
              peerConnections[peerUuid].pc
                .createAnswer()
                .then(description =>
                  this.createdDescription(signal.id, description, peerUuid)
                )
                .catch(errorHandler => {
                  console.log(
                    "createdDescription signal.sdp error---",
                    errorHandler
                  );
                });
            }
          })
          .catch(errorHandler => {
            console.log("createdDescription signal.sdp error---", errorHandler);
          });
      } else if (signal.ice) {
        peerConnections[peerUuid].pc
          .addIceCandidate(new RTCIceCandidate(signal.ice))
          .catch(errorHandler => {
            console.log("addIceCandidate signal.ice error---", errorHandler);
          });
      }
    });

    this.startCamera();
  }

  startCamera() {
    if (!!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia)) {
      navigator.mediaDevices
        .getUserMedia(this.constraints)
        .then(this.attachVideo.bind(this))
        .catch(this.handleError);
    } else {
      alert("Sorry, camera not available.");
    }
  }

  attachVideo(stream) {
    this.renderer.setProperty(
      this.videoElement.nativeElement,
      "srcObject",
      stream
    );
    localstream = stream;
    this.videoElement.nativeElement.volume = 0;
    let roomdata = {
      uuid: localUuid,
      displayName: localDisplayName,
      roomname: videoroomname
    };
    this.chatService.joinroom(roomdata);
  }

  handleError(error) {
    alert("Sorry, camera not found.");
    console.log("Error: ", error);
  }

  setUpPeer(peerUuid, displayName, id, initCall = false) {
    peerConnections[peerUuid] = {
      displayName: displayName,
      pc: new RTCPeerConnection(peerConnectionConfig)
    };
    peerConnections[peerUuid].pc.onicecandidate = event =>
      this.gotIceCandidate(id, event, peerUuid);
    peerConnections[peerUuid].pc.ontrack = event =>
      this.gotRemoteStream(id, event, peerUuid);
    peerConnections[peerUuid].pc.oniceconnectionstatechange = event =>
      this.checkPeerDisconnect(id, event, peerUuid);
    peerConnections[peerUuid].pc.addStream(localstream);

    if (initCall) {
      peerConnections[peerUuid].pc
        .createOffer()
        .then(description => this.createdDescription(id, description, peerUuid))
        .catch(errorHandler => {
          console.log("createdDescription error---", errorHandler);
        });
    }
  }

  gotIceCandidate(id, event, peerUuid) {
    console.log("gotIceCandidate event 444 ", event, peerUuid);
    if (event.candidate != null) {
      this.chatService.sendMessage({
        id: id,
        ice: event.candidate,
        uuid: localUuid,
        roomname: peerUuid
      });
      // serverConnection.send(JSON.stringify());
    }
  }

  gotRemoteStream(id, event, peerUuid) {
    const mediaStream = this.allUsers.filter(stream => {
      if (stream.streams[0].id == event.streams[0].id) {
        return stream;
      } else {
        return null;
      }
    });

    if (mediaStream.length == 0) {
      this.allUsers.push(event);
      console.log(`---------------------------------------`);
      console.log(
        `------------------allUsers---------------------`,
        this.allUsers
      );
      console.log(`---------------------------------------`);
      console.log(`got remote stream, peer ${peerUuid} and event`, event);

      console.log(`---------------------------------------`);
      console.log(`---------------------------------------`);
      console.log(`---------------------------------------`);
      const vidElemm = this.renderer.createElement("video");
      // vidElemm.srcObject = event.streams[0];
      this.renderer.setProperty(vidElemm, "autoplay", true);
      this.renderer.setProperty(vidElemm, "muted", false);

      this.renderer.setProperty(vidElemm, "srcObject", event.streams[0]);
      const vidContainer = this.renderer.createElement("div");

      // vidContainer.setProperty('id', 'remoteVideo_' + peerUuid);
      // vidContainer.setProperty('class', 'videoContainer');
      this.renderer.setProperty(vidContainer, "id", "remoteVideo_" + peerUuid);
      this.renderer.setProperty(vidContainer, "class", "videoContainer");
      this.renderer.appendChild(vidContainer, vidElemm);
      const username = this.renderer.createElement("span");

      const buttonText = this.renderer.createText(
        peerConnections[peerUuid].displayName
      );
      this.renderer.setStyle(username, "left", "12px");
      this.renderer.setStyle(username, "position", "absolute");
      this.renderer.setStyle(username, "font-size", "15px");
      this.renderer.setStyle(username, "color", "crimson");

      this.renderer.appendChild(username, buttonText);
      this.renderer.appendChild(vidContainer, username);
      this.renderer.appendChild(this.remoteVideo.nativeElement, vidContainer);
    } else {
      mediaStream[0].streams[0].addTrack(event.track);
    }
  }

  checkPeerDisconnect(id, event, peerUuid) {
    var state = peerConnections[peerUuid].pc.iceConnectionState;
    console.log(`connection with peer ${peerUuid} ${state} and event`, event);
    if (state === "failed" || state === "closed" || state === "disconnected") {
      delete peerConnections[peerUuid];
      const videle = document.getElementById("remoteVideo_" + peerUuid);
      this.renderer.removeChild(this.remoteVideo.nativeElement, videle);
    }
    //   delete peerConnections[peerUuid];
    //   document.getElementById('videos').removeChild(document.getElementById('remoteVideo_' + peerUuid));
    //   // updateLayout();
  }

  createdDescription(id, description, peerUuid) {
    console.log(`got description, peer ${peerUuid}`);
    peerConnections[peerUuid].pc
      .setLocalDescription(description)
      .then(() => {
        this.chatService.sendMessage({
          id: id,
          sdp: peerConnections[peerUuid].pc.localDescription,
          uuid: localUuid,
          roomname: peerUuid
        });
      })
      .catch(errorHandler => {
        console.log("createdDescription error---", errorHandler);
      });
  }
  createUUID() {
    function s4() {
      return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
    }

    return (
      s4() +
      s4() +
      "-" +
      s4() +
      "-" +
      s4() +
      "-" +
      s4() +
      "-" +
      s4() +
      s4() +
      s4()
    );
  }

  mute() {
    // const tracks = localstream.getTracks();
    // tracks.forEach( (track) => {
    //   track.enabled = !track.enabled
    //   this.mutebutton = !track.enabled;
    // });
    this.mutebutton = !this.mutebutton;
    localstream.getAudioTracks()[0].enabled = !this.mutebutton;
  }
  close() {
    this.videomute = !this.videomute;
    localstream.getVideoTracks()[0].enabled = !this.videomute;
  }

  logout() {
    //this.chatService.disconnect(this.name);
    //window.location.href = "/";
  }
}
