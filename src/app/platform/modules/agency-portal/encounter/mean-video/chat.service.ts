import { Injectable } from "@angular/core";
import { Socket } from "ngx-socket-io";
import { map } from "rxjs/operators";
import { HttpClient } from "@angular/common/http";
import { BehaviorSubject } from "rxjs";
@Injectable({
  providedIn: "root"
})
export class ChatService {
  nameSubject = new BehaviorSubject<any>("user");

  nameobserver = this.nameSubject.asObservable();

  constructor(private socket: Socket, private http: HttpClient) {}

  sendMessage(messageData) {
    this.socket.emit("createMessage", messageData);
  }
  getMessage() {
    return this.socket.fromEvent("newMessage").pipe(map((data: any) => data));
  }

  sendChatMessage(messageData) {
    this.socket.emit("createchatMessage", messageData);
  }
  getChatMessage() {
    return this.socket
      .fromEvent("newchatMessage")
      .pipe(map((data: any) => data));
  }

  disconnect(username) {
    this.socket.emit("logoutuser", username);
  }
  joinroom(roomdata) {
    //  return this.http.post('http://localhost:3000/adduser', roomdata);
    this.socket.emit("join", {
      uuid: roomdata.uuid,
      displayName: roomdata.displayName,
      roomname: roomdata.roomname
    });
  }

  newjoineduser() {
    return this.socket
      .fromEvent("newuserjoined")
      .pipe(map((data: any) => data));
  }

  getUserList() {
    return this.socket.fromEvent("updatedUsers").pipe(map((data: any) => data));
  }

  changename(name) {
    this.nameSubject.next(name);
  }

  // sendVideoMessage(ice,sdp ,uuid,dest){
  //   console.log('sendVideoMessage messgae',ice,uuid,dest)
  //     this.socket.emit("createVideostream", {
  //       ice: ice,
  //       sdp: sdp,
  //       uuid: uuid,
  //       dest: dest,
  //     });
  // }
}
