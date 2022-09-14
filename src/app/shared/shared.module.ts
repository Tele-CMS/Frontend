import { CommonService } from "./../platform/modules/core/services/common.service";
//import { TextChatService } from "./text-chat/text-chat.service";
import { AppService } from "./../app-service.service";
//import { SubscriberComponent } from "./../platform/modules/agency-portal/encounter/video-chat/subscriber/subscriber.component";
//import { PublisherComponent } from "src/app/platform/modules/agency-portal/encounter/video-chat/publisher/publisher.component";
import { DataTableComponent } from "./data-table/data-table.component";

import { RegisterModelComponent } from "./register-model/register.component";
import { AgencyLoginModelComponent } from "src/app/shared/login-model/agency-login/agency-login.component";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { HeaderComponent, FooterComponent, SidebarComponent } from "./layout";
import { SharedService } from "./shared.service";
import {StaffAppointmentComponent} from './staff-appointment/staff-appointment.component'
import {  MatNativeDateModule, MatStepperModule, MAT_DIALOG_DATA } from "@angular/material";
import { CancelAppointmentDialogComponent as cancelAppointmentComponent} from './../platform/modules/scheduling/scheduler/cancel-appointment-dialog/cancel-appointment-dialog.component'
import { AppointmentViewComponent } from './../platform/modules/scheduling/appointment-view/appointment-view.component';
import { ContextMenuModule } from 'ngx-contextmenu';
import { MatDatetimepickerModule,MatNativeDatetimeModule } from "@mat-datetimepicker/core";
import { MatCheckboxModule, MatChip, MatChipsModule, MatAutocomplete, MatAutocompleteModule } from '@angular/material';
// import { TooltipModule } from 'ng2-tooltip-directive';
import {SymptomCheckerService} from './symptom-checker/symptom-checker.service'
import {ViewReportService} from './view-report/view-report.service';
import { MatVideoModule } from "mat-video";

import { MailboxService } from './../platform/modules/mailing/mailbox.service';
import { AngularEditorModule } from '@kolkov/angular-editor';
import {
  MatToolbarModule,
  MatButtonModule,
  MatSidenavModule,
  MatIconModule,
  MatListModule,
  MatMenuModule,
  MatExpansionModule,
  MatTableModule,
  MatDialogModule,
  MatSortModule,
  MatPaginatorModule,
  MatProgressSpinnerModule,
  MatTooltipModule,
  MAT_DIALOG_DEFAULT_OPTIONS,
  MatDialogRef,
  MatSelectModule,
  MatSlideToggle,
  MatSlideToggleModule,
  MatInputModule,
  MatFormFieldModule, 
  MatTabsModule,
  MatRadioModule
} from "@angular/material";
import { MenuListItemComponent } from "./layout/menu-list-item/menu-list-item.component";
import { DialogComponent } from "./layout/dialog/dialog.component";
import { NumbersOnlyDirective } from "./directives/numbers-only.directive";
import { DialogService } from "./layout/dialog/dialog.service";
import { StatusPipe } from "./pipes/status.pipe";
import { PhoneNumberDirective } from "./directives/phone-number.directive";
import { SsnDirective } from "./directives/ssn.directive";
import { ZipcodeDirective } from "./directives/zipcode.directive";
import { RateDirective } from "./directives/rate.directive";
import { MrnNumberDirective } from "./directives/mrn-number.directive";
import { SuperAdminHeaderComponent } from "./layout/super-admin-header.component";
import { ScrollbarModule } from "ngx-scrollbar";
import { LineChartComponent } from "./line-chart/line-chart.component";
import { ChartsModule } from "ng2-charts";
import { ClientHeaderLayoutComponent } from "./layout/client-header-layout/client-header-layout.component";
import { SpanPipe } from "./pipes/span.pipe";
import { PasswordValidator } from "./password-validator";
import { ChatWidgetComponent } from "./chat-widget/chat-widget.component"; 
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { GoogleAddressInputComponent } from "./controls/google-address-input/google-address-input.component";
import { GooglePlaceModule } from "ngx-google-places-autocomplete";
import { InvitationStatusPipe } from "./pipes/invitation-status.pipe";
import { DatePickerComponent } from "./date-picker/date-picker.component";
import { ClientLoginModelComponent } from "./login-model/client-login/client-login.component";
import { RouterModule } from "@angular/router";
import { AuthenticationService } from "src/app/platform/modules/auth/auth.service";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { LoginModelComponent } from "./login-model/login-model.component";
import { SecurityQuestionModelComponent } from "./security-question-model/security-question-model.component";
//import { MeanVideoComponent } from "./mean-video/mean-video.component";
import { SocketIoConfig, SocketIoModule } from "ngx-socket-io";
import { AppointmentGraphComponent } from "./appointment-graph/appointment-graph.component";
import { BarChartComponent } from "./bar-chart/bar-chart.component";
import { ApproveAppointmentDialogComponent } from "./approve-appointment-dialog/approve-appointment-dialog.component";
import { CancelAppointmentDialogComponent } from "./cancel-appointment-dialog/cancel-appointment-dialog.component";
import { UniquePipe } from "./pipes/unique.pipe";
import { TimeCheckPipe } from "./pipes/time-check.pipe";
import { EncounterPipe } from "./pipes/encounter.pipe";
import { AddNewCallerComponent } from "./add-new-caller/add-new-caller.component";
import { RatingPipe } from "./pipes/rating.pipe";
import { RatingModule } from "ng-starrating";
import { InvitedPendingComponent } from "./appointment-graph/invited-pending/invited-pending.component";
import { InvitedAcceptedComponent } from "./appointment-graph/invited-accepted/invited-accepted.component";
import { InvitedRejectedComponent } from "./appointment-graph/invited-rejected/invited-rejected.component";
import { AcceptRejectAppointmentInvitationComponent } from "./accept-reject-appointment-invitation/accept-reject-appointment-invitation.component";
import { TextChatComponent } from "./text-chat/text-chat.component";
import { TextChatUserNamePipe } from "./text-chat/text-chat-user-name.pipe";
import { TextChatUserImagePipe } from "./text-chat/text-chat-user-image.pipe";
import { CallButtonComponent } from "./call-button/call-button.component";
import { UploadFileComponent } from "./text-chat/uploadFile/upload-file.component";
import { ChatMessagePipe } from "./pipes/chat-message.pipe";
import { TextMessageFormatComponent } from "./text-chat/text-message-format/text-message-format.component";
import { NgxMaskModule,IConfig } from "ngx-mask";
import { SetReminderComponent } from './set-reminder/set-reminder.component';
import { FrontMaterialModule } from "src/app/front/front.material.module";
import { SymptomCheckerComponent } from './symptom-checker/symptom-checker.component';

import { TooltipModule } from 'ng2-tooltip-directive';
import { DndModule } from "ngx-drag-drop";
import { DynamicFormControlService } from "./dynamic-form/dynamic-form-control-service";
import { DynamicFormControlComponent } from "./dynamic-form/dynamic-form-control-component/dynamic-form-control-component";
import { DynamicFormComponent } from "./dynamic-form/dynamic-form-component/dynamic-form.component";
import { UrgentCareProviderActionComponent } from "./urgentcare-provideraction/urgentcare-provideraction.component";
import { PatientUrgentCareStatusComponent } from "./patient-urgentcare-status/patient-urgentcare-status.component";
import { CountDownComponent } from "./count-down/count-down.component";
import { VideoConsultationTestModalComponent } from "./video-consultation-test-modal/video-consultation-test-modal.component";
import { AudioRecordingService } from "./video-consultation-test-modal/audio-recording.service";
import { AddPrescriptionComponent } from "../platform/modules/agency-portal/clients/prescription/prescription-addprescription/prescription-addprescription.component";
import { DocViewerComponent } from "./doc-viewer/doc-viewer.component";
import { NgxDocViewerModule } from "ngx-doc-viewer";
import { ViewReportComponent } from './view-report/view-report.component';
import { FollowupAppointmentComponent } from './followup-appointment/followup-appointment.component';
import { AppointmentReschedulingDialogComponent } from "./appointment-rescheduling-dialog/appointment-rescheduling-dialog.component";
import { PreponeAppointmentComponent } from "./prepone-appointment/prepone-appointment.component";
import { PostponeAppointmentComponent } from "./postpone-appointment/postpone-appointment.component";
import { UrgentCareListingdialogComponent } from "./urgentcarelisting-dialog/urgentcarelisting-dialog.component";
import { ShowHTMLDataPipe } from "./pipes/showHTMLData.pipe";
import { AlerttypePipe } from "./pipes/alerttype.pipe";
import { BoldTextFontPipe } from "./pipes/boldtextfont.pipe";
import { DescriptionwithcolorPipe } from "./pipes/descriptionwithcolor.pipe";
import { FontcolorWithTooltipPipe } from "./pipes/fontclrwtooltip.pipe";
import { FontcolorWithUnderlinePipe } from "./pipes/fontclrwithunderline.pipe";
import { FontcolorPipe } from "./pipes/fontclr.pipe";
import { ShowIiconPipe } from "./pipes/show-iicon.pipe";
import { BlackFontcolorPipe } from "./pipes/blckfontcolor.pipe";
import { FontcolorWithUnderlineForTextResultPipe } from "./pipes/fontcolorfortextresult";
import { PieChartComponent } from "./pie-chart/pie-chart.component";
import { EncounterGraphComponent } from './encounter-graph/encounter-graph.component';
import { AlphanumericOnlyDirective } from './directives/alphanumeric-only.directive';
import { CallNotificationComponent } from "./call-notification/call-notification.component";
// import { ChatWidgetComponent } from "./chat-widget/chat-widget.component";
//import { NgxDocViewerModule } from "ngx-doc-viewer";
// const config: SocketIoConfig = {
//   url: "https://turn.stagingsdei.com:5187",
//   options: {}
// };

const maskConfig: Partial<IConfig> = {
  
};

@NgModule({
  imports: [
    CommonModule,
    ContextMenuModule.forRoot({
      useBootstrap4: true,
    }),
    MatCheckboxModule,
    MatChipsModule,
    MatAutocompleteModule,
    MatDatetimepickerModule,
    MatNativeDatetimeModule,
    MatToolbarModule,
    MatNativeDateModule,
    MatStepperModule,
    MatInputModule,
    FrontMaterialModule,
    MatFormFieldModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    MatMenuModule,
    MatExpansionModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    MatButtonModule,
    MatTooltipModule,
    MatSelectModule,
    ScrollbarModule,
    ChartsModule,
    MatSlideToggleModule,
    FormsModule,
    ReactiveFormsModule,
    GooglePlaceModule,
    RouterModule,
    MatDatepickerModule,
    MatTabsModule,
    MatRadioModule,
    AngularEditorModule,
    MatCheckboxModule,
    //SocketIoModule.forRoot(config)
    RatingModule,
    NgxMaskModule.forRoot(maskConfig),
     TooltipModule ,
     DndModule,
     NgxDocViewerModule,
     MatVideoModule
  ],
  declarations: [
    HeaderComponent,
    SuperAdminHeaderComponent,
    FooterComponent,
    SidebarComponent,
    MenuListItemComponent,
    DataTableComponent,
    DialogComponent,
    NumbersOnlyDirective,
    AlphanumericOnlyDirective,
    StatusPipe,
    PhoneNumberDirective,
    SsnDirective,
    ZipcodeDirective,
    RateDirective,
    MrnNumberDirective,
    LineChartComponent,
    ClientHeaderLayoutComponent,
    SpanPipe,
    InvitationStatusPipe,
    ChatWidgetComponent,
    GoogleAddressInputComponent,
    DatePickerComponent,
    AgencyLoginModelComponent,
    ClientLoginModelComponent,
    RegisterModelComponent,
    LoginModelComponent,
    SecurityQuestionModelComponent,
    AppointmentGraphComponent,
    BarChartComponent,
    PieChartComponent,
    StaffAppointmentComponent,
    //MeanVideoComponent,
    ApproveAppointmentDialogComponent,
    CancelAppointmentDialogComponent,
    UniquePipe,
    TimeCheckPipe,
    EncounterPipe,
    AddNewCallerComponent,
    InvitedPendingComponent,
    InvitedAcceptedComponent,
    InvitedRejectedComponent,
    AcceptRejectAppointmentInvitationComponent,
    //PublisherComponent,
    //SubscriberComponent,
    RatingPipe,
    TextChatComponent,
    TextChatUserNamePipe,
    TextChatUserImagePipe,
    CallButtonComponent,
    UrgentCareProviderActionComponent,
    UploadFileComponent,
    ChatMessagePipe,
    TextMessageFormatComponent,
    SetReminderComponent,
    AppointmentViewComponent,
    cancelAppointmentComponent,
    SymptomCheckerComponent,
    DynamicFormControlComponent,
    DynamicFormComponent,
    UrgentCareProviderActionComponent,
    PatientUrgentCareStatusComponent,
    CountDownComponent,
      AddPrescriptionComponent,
      VideoConsultationTestModalComponent,
      DocViewerComponent,
      ViewReportComponent,
      FollowupAppointmentComponent,
      AppointmentReschedulingDialogComponent,
      PreponeAppointmentComponent,
      PostponeAppointmentComponent,
      UrgentCareListingdialogComponent,
      ShowHTMLDataPipe,
      AlerttypePipe,
      BoldTextFontPipe,
      BlackFontcolorPipe,
      DescriptionwithcolorPipe,
      FontcolorWithTooltipPipe,
      FontcolorWithUnderlinePipe,
      FontcolorWithUnderlineForTextResultPipe,
      FontcolorPipe,
      ShowIiconPipe,
      EncounterGraphComponent,
      AlphanumericOnlyDirective,
      CallNotificationComponent
  ],
  providers: [
    SharedService,
    DialogService,
    MailboxService,
    SymptomCheckerService,
    ViewReportService,
    AuthenticationService,
    DynamicFormControlService,
    AudioRecordingService,
    { provide: MAT_DIALOG_DATA,  
      useValue: {
      hasBackdrop: true,
      disableClose: true,
      minWidth: "55%",
      maxWidth: "90%"
    } 
  },

    //CommonService
  ],
  entryComponents: [
    DialogComponent,
    ChatWidgetComponent,
    ApproveAppointmentDialogComponent,
    CancelAppointmentDialogComponent,
    AddNewCallerComponent,
    SetReminderComponent,
    AcceptRejectAppointmentInvitationComponent,
    UploadFileComponent,
    TextMessageFormatComponent,
    StaffAppointmentComponent,
    FollowupAppointmentComponent,
    AppointmentViewComponent,
    cancelAppointmentComponent,
    SymptomCheckerComponent,
    DynamicFormControlComponent,
    DynamicFormComponent,
    UrgentCareProviderActionComponent,
    PatientUrgentCareStatusComponent,
      AddPrescriptionComponent,
      VideoConsultationTestModalComponent,
      DocViewerComponent,
      ViewReportComponent,
      AppointmentReschedulingDialogComponent,
      PreponeAppointmentComponent,
      PostponeAppointmentComponent,
      UrgentCareListingdialogComponent,
      CallNotificationComponent
  ],
  exports: [
    CommonModule,
    MatToolbarModule,
    MatInputModule,
    MatFormFieldModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    MatDialogModule,
    HeaderComponent,
    SuperAdminHeaderComponent,
    FooterComponent,
    SidebarComponent,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatButtonModule,
    MatTooltipModule,
    DataTableComponent,
    DialogComponent,
    NumbersOnlyDirective,
    AlphanumericOnlyDirective,
    StatusPipe,
    PhoneNumberDirective,
    ZipcodeDirective,
    SsnDirective,
    MrnNumberDirective,
    MatSelectModule,
    ChartsModule,
    LineChartComponent,
    ClientHeaderLayoutComponent,
    ChatWidgetComponent,
    GoogleAddressInputComponent,
    RouterModule,
    MatDatepickerModule,
    MatTabsModule,
    AppointmentGraphComponent,
    ApproveAppointmentDialogComponent,
    CancelAppointmentDialogComponent,
    UniquePipe,
    TimeCheckPipe,
    EncounterPipe,
    MatRadioModule,
    TextChatComponent,
    CallButtonComponent,
    UploadFileComponent,
    ChatMessagePipe,
    TextMessageFormatComponent,
    //PublisherComponent,
    //SubscriberComponent,
    NgxMaskModule,
     TooltipModule,
      MatCheckboxModule,
      DynamicFormControlComponent,
      DynamicFormComponent,
      CountDownComponent,
      AddPrescriptionComponent,
      VideoConsultationTestModalComponent,
      DocViewerComponent,
      NgxDocViewerModule,
      ViewReportComponent,
      MatVideoModule,
      MatChipsModule,
    MatAutocompleteModule,
    AppointmentReschedulingDialogComponent,
    PreponeAppointmentComponent,
    PostponeAppointmentComponent,
    UrgentCareListingdialogComponent,
    ShowHTMLDataPipe,
      AlerttypePipe,
      BoldTextFontPipe,
      BlackFontcolorPipe,
      DescriptionwithcolorPipe,
      FontcolorWithTooltipPipe,
      FontcolorWithUnderlinePipe,
      FontcolorWithUnderlineForTextResultPipe,
      FontcolorPipe,
      ShowIiconPipe,
      BarChartComponent,
      PieChartComponent,
      EncounterGraphComponent
  ]
})
export class SharedModule {}
