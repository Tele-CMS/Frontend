
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";

import { SharedModule } from "src/app/shared/shared.module";
//import { CommonService } from 'src/app/platform/modules/core/services';
import { ProviderDocumentsComponent } from "./providerdocuments/providerdocuments.component";
import { ProviderDocumentRoutingModule } from "./provider-documents.module.routing";
import { AddProviderDocumentComponent } from "./add-provider-document/add-provider-document.component";
import { PlatformMaterialModule } from "src/app/platform/platform.material.module";
import { CommonService } from "../../core/services/common.service";
import { ProviderDocumentService } from "./provider-documents.service";

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    ProviderDocumentRoutingModule,
    SharedModule,
    PlatformMaterialModule,
  ],
  declarations: [ProviderDocumentsComponent,AddProviderDocumentComponent],
  providers: [ProviderDocumentService],
  entryComponents: [
    ProviderDocumentsComponent,AddProviderDocumentComponent
  ],
})
export class ProviderDocumentModule {}
