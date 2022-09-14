import { UserQualificationComponent } from "./user-qualification/user-qualification.component";
import { UserAwardComponent } from "./user-award/user-award.component";
import { UserExperienceComponent } from "./user-experience/user-experience.component";
import { NgModule } from "@angular/core";
import { CommonModule, FormatWidth } from "@angular/common";
import { UsersRoutingModule } from "./users.module.routing";
import { UsersService } from "./users.service";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { SharedModule } from "../../../../shared/shared.module";
import { PlatformMaterialModule } from "../../../platform.material.module";
import { UserListingComponent } from "./user-listing/user-listing.component";
import { UserComponent } from "./user/user.component";
import { AddUserComponent } from "./add-user/add-user.component";
import { CustomFieldsComponent } from "./custom-fields/custom-fields.component";
import { AvailabilityComponent } from "./availability/availability.component";
import { NgxMaskModule } from "ngx-mask";
import { NgxMaterialTimepickerModule } from "ngx-material-timepicker";
import { UserLeavesComponent } from "./user-leaves/user-leaves.component";
import { PayrollRateComponent } from "./payroll-rate/payroll-rate.component";
import { UserProfileComponent } from "./user-profile/user-profile.component";
import { UserDocumentsComponent } from "./user-documents/user-documents.component";
import { AddUserDocumentComponent } from "./user-documents/add-user-document/add-user-document.component";
import { ManageLeavesComponent } from "./manage-leaves/manage-leaves.component";
import { ApplyLeaveComponent } from "./manage-leaves/apply-leave/apply-leave.component";
import { ApplyLeaveModalComponent } from "./user-leaves/apply-leave-modal/apply-leave-modal.component";
import { UserTimeSheetTabularViewService } from "./user-time-sheet-tabular-view/user-time-sheet-tablular.service";
import { UserTimeSheetViewService } from "./user-time-sheet-sheet-view/user-time-sheet-sheet.service";
import { UserTimeSheetTabularViewComponent } from "./user-time-sheet-tabular-view/user-time-sheet-tabular-view.component";
import { UserTimeSheetSheetViewComponent } from "./user-time-sheet-sheet-view/user-time-sheet-sheet-view.component";
import { UserTimeSheetComponent } from "./user-time-sheet/user-time-sheet.component";
import { ScrollbarModule } from "ngx-scrollbar";
import { MAT_DIALOG_DEFAULT_OPTIONS } from "@angular/material";
import { UserInvitationComponent } from "./user-invitation/user-invitation.component";
import { SendUserInvitationComponent } from "./user-invitation/send-user-invitation/send-user-invitation.component";
import { UserInvitationService } from "../users/user-invitation/user-invitation.service";
import { NgxMatSelectSearchModule } from "ngx-mat-select-search";

@NgModule({
  imports: [
    CommonModule,
    UsersRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    PlatformMaterialModule,
    [NgxMaskModule.forRoot()],
    [NgxMaterialTimepickerModule.forRoot()],
    ScrollbarModule,
    NgxMatSelectSearchModule
  ],
  declarations: [
    UserListingComponent,
    UserComponent,
    AddUserComponent,
    CustomFieldsComponent,
    AvailabilityComponent,
    UserLeavesComponent,
    PayrollRateComponent,
    UserProfileComponent,
    UserDocumentsComponent,
    AddUserDocumentComponent,
    ManageLeavesComponent,
    ApplyLeaveComponent,
    ApplyLeaveModalComponent,
    UserTimeSheetComponent,
    UserTimeSheetTabularViewComponent,
    UserTimeSheetSheetViewComponent,
    UserInvitationComponent,
    SendUserInvitationComponent,
    UserExperienceComponent,
    UserAwardComponent,
    UserQualificationComponent
  ],
  providers: [
    UsersService,
    UserTimeSheetViewService,
    UserTimeSheetTabularViewService,
    UserInvitationService,
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
    AddUserComponent,
    CustomFieldsComponent,
    AvailabilityComponent,
    AddUserDocumentComponent,
    ApplyLeaveModalComponent,
    UserTimeSheetComponent,
    UserTimeSheetTabularViewComponent,
    UserTimeSheetSheetViewComponent,
    SendUserInvitationComponent,
    UserExperienceComponent,
    UserAwardComponent,
    UserQualificationComponent
  ]
})
export class UsersModule {}
