import { SharedModule } from "./../../../../shared/shared.module";
import { DiagnosisService } from "./diagnosis/diagnosis.service";
//import { DiagnosisModalComponent } from "./../clients/diagnosis/diagnosis-modal/diagnosis-modal.component";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SoapComponent } from "./soap/soap.component";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import {
  MatInputModule,
  MatButtonModule,
  MatOptionModule,
  MatSelectModule,
  MAT_DIALOG_DEFAULT_OPTIONS,
  MatDialogModule,
  MatMenuModule,
  MatIconModule,
  MatDatepickerModule,
  MatCardModule
} from "@angular/material";
import { EncounterRoutingModule } from "./encounter-routing.module";
import { EncounterService } from "./encounter.service";
import { SignaturePadModule } from "angular2-signaturepad";
import { SignDialogComponent } from "./sign-dialog/sign-dialog.component";

import { VideoChatComponent } from "./video-chat/video-chat.component";
import { PublisherComponent } from "./video-chat/publisher/publisher.component";
import { SubscriberComponent } from "./video-chat/subscriber/subscriber.component";
import { VideoCallComponent } from "./video-call/video-call.component";
import { FormioModule } from "angular-formio";
import { TemplateFormComponent } from "./template-form/template-form.component";
import { ResizableModule } from "angular-resizable-element";
import { DragAndDropModule } from "angular-draggable-droppable";
//import { SocketIoModule, SocketIoConfig } from "ngx-socket-io";
//import { MeanVideoComponent } from "src/app/platform/modules/agency-portal/encounter/mean-video/mean-video.component";
//import { ChatService } from "src/app/platform/modules/agency-portal/encounter/mean-video/chat.service";
import { ScrollbarModule } from "ngx-scrollbar";
import { DiagnosisModalComponent } from "./diagnosis/diagnosis-modal/diagnosis-modal.component";
import { AddServiceCodeModalComponent } from "src/app/platform/modules/agency-portal/encounter/service-code-modal/add-service-code-modal.component";
import { ThankYouComponent } from "./thank-you/thank-you.component";
import { VideoButtonComponent } from './video-chat/video-button/video-button.component';
import { PatientEncounterNotesModalComponent } from "./patientencounternotes-modal/patientencounternotes.component";
import { NoteTabComponent } from './NoteTab/note-tab.component';
import { AssesmentnoteComponent } from "./NoteTab/assesmentnote/assesmentnote.component";
import { NonBillableSoapComponent } from "./NoteTab/non-billable-soap/non-billable-soap.component";

//import { NonBillableSoapComponent } from "./NoteTab/non-billable-soap/non-billable-soap.component";
//import { DiagnosisModelComponent } from "./diagnosis/diagnosis-model/diagnosis-model.component";
// const config: SocketIoConfig = {
//   url: "https://turn.stagingsdei.com:5187",
//   options: {}
// };
//import { DndModule } from 'ngx-drag-drop';
@NgModule({
  imports: [
    CommonModule,
    FormioModule,
    EncounterRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    MatInputModule,
    MatSelectModule,
    MatOptionModule,
    MatButtonModule,
    MatDialogModule,
    MatMenuModule,
    MatIconModule,
    SignaturePadModule,
    MatDatepickerModule,
    ResizableModule,
    DragAndDropModule,
    //SocketIoModule.forRoot(config),
    ScrollbarModule,
    // DndModule,
    SharedModule,
    MatCardModule,

  ],
  declarations: [
    SoapComponent,
    SignDialogComponent,
    NonBillableSoapComponent,
    AssesmentnoteComponent,
    VideoChatComponent,
    PublisherComponent,
    SubscriberComponent,
    VideoCallComponent,
    TemplateFormComponent,
    DiagnosisModalComponent,
    AddServiceCodeModalComponent,
    ThankYouComponent,
    VideoButtonComponent,
    //MeanVideoComponent,
    PatientEncounterNotesModalComponent,
    NoteTabComponent
  ],
  providers: [
    EncounterService,
    DiagnosisService,
    //ChatService,

    {
      provide: MAT_DIALOG_DEFAULT_OPTIONS,
      useValue: {
        hasBackdrop: true,
        disableClose: true,
        minWidth: "55%",
        maxWidth: "90%"
      }
    }
  ],
  entryComponents: [
    SignDialogComponent,
    TemplateFormComponent,
    DiagnosisModalComponent,
    AddServiceCodeModalComponent,
    PatientEncounterNotesModalComponent,
    NonBillableSoapComponent,
    AssesmentnoteComponent
  ],
  exports: [PublisherComponent, SubscriberComponent, SoapComponent,
    SignDialogComponent,VideoCallComponent,
    TemplateFormComponent,
    DiagnosisModalComponent,
    AddServiceCodeModalComponent,
    ThankYouComponent,
    VideoButtonComponent,
    NonBillableSoapComponent,
    AssesmentnoteComponent,
    PatientEncounterNotesModalComponent,
    VideoChatComponent,
    PublisherComponent,
    SubscriberComponent,
    VideoCallComponent,
    VideoButtonComponent,
  ]
})
export class EncounterModule {}
