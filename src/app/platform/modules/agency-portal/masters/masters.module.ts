import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { AppointmentTypeComponent } from "./appointment-type/appointment-type.component";
import { ServiceCodesComponent } from "./service-codes/service-codes.component";
import { MastersRoutingModule } from "./masters-routing.module";
import { AppointmentTypeModalComponent } from "./appointment-type/appointment-type-modal/appointment-type-modal.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { PlatformMaterialModule } from "../../../platform.material.module";
import { ServiceCodeModalComponent } from "./service-codes/service-code-modal/service-code-modal.component";
import { MAT_DIALOG_DEFAULT_OPTIONS } from "@angular/material";
import { SharedModule } from "../../../../shared/shared.module";
import { ServiceCodeService } from "./service-codes/service-code.service";
import { AppointmentTypeService } from "./appointment-type/appointment-type.service";
import { IcdCodesComponent } from "./icd-codes/icd-codes.component";
import { IcdCodeModalComponent } from "./icd-codes/icd-code-modal/icd-code-modal.component";
import { ICDCodeService } from "./icd-codes/icd-code.service";
import { ColorPickerModule } from "ngx-color-picker";
import { RolePermissionsComponent } from "./role-permissions/role-permissions.component";
import { SecurityQuestionComponent } from "./security-question/security-question.component";
import { SecurityQuestionService } from "./security-question/security-question.service";
import { SecurityQestionModalComponent } from "./security-question/security-question-modal/security-question-modal.component";
import { CustomFieldsComponent } from "./custom-fields/custom-fields.component";
import { CustomFieldModalComponent } from "./custom-fields/custom-fields-modal/custom-fields-modal.component";
import { CustomFieldsService } from "./custom-fields/custom-fields.service";
import { InsuranceTypeComponent } from "./insurance-type/insurance-type.component";
import { InsuranceTypeModalComponent } from "./insurance-type/insurance-type-modal/insurance-type-modal.component";
import { InsuranceTypeService } from "./insurance-type/insurance-type.service";
import { RolePermissionService } from "./role-permissions/role-permission.service";
import { LocationMasterComponent } from "./location-master/location-master.component";
import { LocationModalComponent } from "./location-master/location-master-modal/location-master-modal.component";
import { LocationService } from "./location-master/location-master.service";
import { NgxMaterialTimepickerModule } from "ngx-material-timepicker";
import { RoundingRulesComponent } from "./rounding-rules/rounding-rules.component";
import { RoundingRulesModalComponent } from "./rounding-rules/rounding-rules-modal/rounding-rules-modal.component";
import { RoundingRulesService } from "./rounding-rules/rounding-rules.service";
import { UserRolesComponent } from "./user-roles/user-roles.component";
import { UserRoleModalComponent } from "./user-roles/user-role-modal/user-role-modal.component";
import { UserRoleService } from "./user-roles/user-role.service";
import { TagsComponent } from "./tags/tags.component";
import { TagModalComponent } from "./tags/tag-modal/tag-modal.component";
import { TagsService } from "./tags/tags.service";
import { AgencyDetailComponent } from "./agency-detail/agency-detail.component";
import { AgencyDetailService } from "./agency-detail/agency-detail.service";
import { QuestionComponent } from "./question/question.component";
import { ServiceComponent } from "./service/service.component";
import { SpecialityComponent } from "./speciality/speciality.component";
import {SpecialityModalComponent} from "./speciality/speciality-modal/speciality-modal.component"
import { ServiceModalComponent } from "./service/service-modal/service-modal.component";
import { MasterService } from "src/app/platform/modules/agency-portal/masters/service/service.service";
import { AddKeywordComponent } from "../keyword/add-keyword/add-keyword.component";
import { AddCareCategoryComponent } from "../keyword/add-carecategory/add-carecategory.component";
import { CareCategoryComponent } from "../keyword/carecategory/carecategory.component";
import { KeywordComponent } from "../keyword/keywords/keyword.component";
import { DiseaseManagementProgramComponent } from "./disease-management-program/disease-management-program.component";
import { DiseaseManagementProgramModalComponent } from "./disease-management-program/disease-management-program-modal/disease-management-program-modal.component";
import { DiseaseManagementProgramActivityModalComponent } from "./disease-management-program/disease-management-program-activity-modal/disease-management-program-activity-modal.component";
import { DiseaseManagementProgramService } from "./disease-management-program/disease-management.service";

@NgModule({
  imports: [
    CommonModule,
    MastersRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    PlatformMaterialModule,
    ColorPickerModule,
    [NgxMaterialTimepickerModule.forRoot()],
    SharedModule
  ],
  providers: [
    AppointmentTypeService,
    ServiceCodeService,
    ICDCodeService,
    SecurityQuestionService,
    CustomFieldsService,
    InsuranceTypeService,
    RolePermissionService,
    LocationService,
    RoundingRulesService,
    UserRoleService,
    TagsService,
    AgencyDetailService,
    MasterService,
    DiseaseManagementProgramService,
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
  declarations: [
    AppointmentTypeComponent,
    ServiceCodesComponent,
    AppointmentTypeModalComponent,
    ServiceCodeModalComponent,
    IcdCodesComponent,
    IcdCodeModalComponent,
    SecurityQuestionComponent,
    SecurityQestionModalComponent,
    CustomFieldsComponent,
    CustomFieldModalComponent,
    InsuranceTypeComponent,
    InsuranceTypeModalComponent,
    RolePermissionsComponent,
    LocationMasterComponent,
    LocationModalComponent,
    RoundingRulesComponent,
    RoundingRulesModalComponent,
    UserRolesComponent,
    UserRoleModalComponent,
    TagsComponent,
    TagModalComponent,
    AgencyDetailComponent,
    QuestionComponent,
    ServiceComponent,
    ServiceModalComponent,
    SpecialityComponent,
    SpecialityModalComponent,
    AddKeywordComponent,
    CareCategoryComponent,
    AddCareCategoryComponent,
    KeywordComponent,
    DiseaseManagementProgramComponent,
    DiseaseManagementProgramModalComponent,
    DiseaseManagementProgramActivityModalComponent
  ],
  entryComponents: [
    AppointmentTypeModalComponent,
    ServiceCodeModalComponent,
    IcdCodeModalComponent,
    SecurityQestionModalComponent,
    CustomFieldModalComponent,
    InsuranceTypeModalComponent,
    LocationModalComponent,
    RoundingRulesModalComponent,
    UserRoleModalComponent,
    TagModalComponent,
    ServiceModalComponent,
    SpecialityModalComponent,
    DiseaseManagementProgramModalComponent
    // AddKeywordComponent
  ]
})
export class MastersModule {}
