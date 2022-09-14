
import { ChangeDetectorRef, Component, ElementRef, Inject, OnInit, Optional, PLATFORM_ID, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
import { NotifierService } from 'angular-notifier';
import { AudioRecordingService } from './audio-recording.service';


declare var MediaRecorder: any;

@Component({
  selector: 'app-video-consultation-test-modal',
  templateUrl: './video-consultation-test-modal.component.html',
  styleUrls: ['./video-consultation-test-modal.component.scss']
})
export class VideoConsultationTestModalComponent implements OnInit {
  @ViewChild('videoElement') videoElement: ElementRef<HTMLVideoElement>;
  @ViewChild('audioElement') audioElement: ElementRef<HTMLAudioElement>;
  @ViewChild('all_pids') pids: ElementRef;
  constraints: any;
  audioInputSelect: any;
  audioOutputSelect: any;
  videoSelect: any;
  selectors: any;
  window: any;
  isCameraInit: boolean = false;
  videoTrack: any;
  decibals: number = 0;
  isAudioInit: boolean = false;
  audioTrack: any;
  meter: any;
  mediaRecorder: any;
  chunks = [];
  audioFiles = [];
  isAudioRecording: boolean = false;
  audioRecordedTime: any;
  audioBlob: any;
  audioName: any;
  audioBlobUrl: any;
  isVideoError:boolean=false;
  audioConf = { audio: true}
  constructor(@Optional() @Inject(MAT_DIALOG_DATA) public data: any, @Inject(PLATFORM_ID) private _platform: Object,
    public notifier: NotifierService, public dialogPopup: MatDialogRef<VideoConsultationTestModalComponent>, private ref: ChangeDetectorRef, private sanitizer: DomSanitizer,
    private audioRecordingService: AudioRecordingService,
  ) { }

  //videoElement:any;
  ngOnInit() {
    
    this.audioRecordingService.recordingFailed().subscribe(() => {
      this.isAudioRecording = false;
      this.notifier.notify("error", "Audio does not work")
      this.ref.detectChanges();
    });

    this.audioRecordingService.getRecordedTime().subscribe((time) => {
      this.audioRecordedTime = time;
      this.ref.detectChanges();
    });

    this.audioRecordingService.getRecordedBlob().subscribe((data) => {
      this.audioBlob = data.blob;
      this.audioName = data.title;
      this.audioBlobUrl = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(data.blob));
      this.ref.detectChanges();
    });
  }



  handleError(error: any) {

    this.notifier.notify("error", error)
  }

  playWithSound() {
    this.initCamera({ video: true, audio: true })
  }

  initCamera(config: any) {
    var browser = <any>navigator;
    browser.getUserMedia = (browser.getUserMedia ||
      browser.webkitGetUserMedia || browser.mozGetUserMedia
      || browser.msGetUserMedia);
    //this.isCameraInit = true;
    browser.mediaDevices.getUserMedia(config).then(stream => {
      this.isCameraInit = true;
      if (config.audio) {
        this.videoTrack.forEach(function (tracks) {
          tracks.stop();
        });
      }
      this.videoElement.nativeElement.srcObject = stream;
      this.videoElement.nativeElement.play();
      this.videoTrack = stream.getTracks();

    }).catch(error => {
      this.isVideoError = true
      this.handleError("Video does not work")
    });

  }

  stopVideo() {
    this.videoTrack.forEach(function (tracks) {
      tracks.stop();
    });
    this.videoElement.nativeElement.srcObject = null;
    this.isCameraInit = false;
  }

  initaudio(config: any) {
    if (this.isCameraInit) {
      this.stopVideo();
    }
    var browser = <any>navigator;
    browser.getUserMedia = (browser.getUserMedia ||
      browser.webkitGetUserMedia || browser.mozGetUserMedia
      || browser.msGetUserMedia);

    browser.mediaDevices.getUserMedia(config).then(stream => {
      this.isAudioInit = true;
      this.audioElement.nativeElement.srcObject = stream;
      this.audioElement.nativeElement.play();
      this.audioTrack = stream.getTracks();
    }).catch(error => {
      this.handleError("Audio does not work")
    });
  }


  stopAudio() {
    this.audioTrack.forEach(function (tracks) {
      tracks.stop();
    });
    this.audioElement.nativeElement.srcObject = null;
    this.isAudioInit = false;
  }

  handleClick(value: any) {

    switch (value.toLowerCase()) {
      case 'videotest':
        //this.dialogPopup.close(value);
        this.isAudioInit = false;
        this.initCamera({ video: true })
        break;

      case 'audiotest':
       // this.initaudio({ audio: true })
       this.isAudioInit = true;
       this.isVideoError = false;
        break;

      case 'microphonetest':
        this.dialogPopup.close(value);
        break;

      default:
        this.dialogPopup.close(value);
        break;
    }
  }

  pauseVideo() {
    this.videoElement.nativeElement.pause();
  }

  resumeVideo() {
    this.videoElement.nativeElement.play()
  }

  continue() {
    if (this.isCameraInit) {
      this.stopVideo()
    }
    else if (this.isAudioRecording) {
      //this.stopAudio();
      this.abortAudioRecording()
    }
    else if (this.isCameraInit && this.isAudioRecording) {
      //this.stopAudio();
      this.abortAudioRecording()
      this.stopVideo();
    }
    this.dialogPopup.close();
  }


  startAudioRecording() {
   
    if (!this.isAudioRecording) {
      this.isAudioRecording = true;
      this.audioRecordingService.startRecording();
    }
  }

  abortAudioRecording() {
    if (this.isAudioRecording) {
      this.isAudioRecording = false;
      this.audioRecordingService.abortRecording();
    }
  }

  stopAudioRecording() {
    if (this.isAudioRecording) {
      this.audioRecordingService.stopRecording();
      this.isAudioRecording = false;
    }
  }

  clearAudioRecordedData() {
    this.isAudioInit = false;
    this.audioBlobUrl = null;
  }

  ngOnDestroy(): void {
    this.abortAudioRecording();
  }

}
