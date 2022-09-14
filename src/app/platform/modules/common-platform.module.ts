import { CommonService } from "./../../super-admin-portal/core/services/common.service";
import { NgModule } from "@angular/core";
import { SocialHistoryComponent } from "src/app/platform/modules/agency-portal/clients/social-history/social-history.component";
import { FamilyHistoryComponent } from "src/app/platform/modules/agency-portal/clients/family-history/family-history.component";
import { VitalsComponent } from "src/app/platform/modules/agency-portal/clients/vitals/vitals.component";
import { DocumentsComponent } from "src/app/platform/modules/agency-portal/clients/documents/documents.component";
import { FamilyHistoryModelComponent } from "src/app/platform/modules/agency-portal/clients/family-history/family-history-model/family-history-model.component";
import { VitalModalComponent } from "src/app/platform/modules/agency-portal/clients/vitals/vital-modal/vital-modal.component";
import { AddDocumentComponent } from "src/app/platform/modules/agency-portal/clients/documents/add-document/add-document.component";
@NgModule({
  imports: [],
  entryComponents: [
    // FamilyHistoryModelComponent,
    // VitalModalComponent,
    // AddDocumentComponent
  ],
  declarations: [
    // SocialHistoryComponent,
    // FamilyHistoryComponent,
    // VitalsComponent,
    // DocumentsComponent
]
})
export class CommonPlatformModule {
  constructor(commonService: CommonService) {
    commonService.initializeAuthData();
  }
}
