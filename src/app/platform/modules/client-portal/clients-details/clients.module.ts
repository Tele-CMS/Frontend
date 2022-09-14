import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ClientComponent } from "./client/client.component";
import { ClientsRoutingModule } from "./clients.module.routing";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { SharedModule } from "../../../../shared/shared.module";
import { PlatformMaterialModule } from "../../../platform.material.module";
import { DemographicInfoComponent } from "./demographic-info/demographic-info.component";
import { AddressComponent } from "./address/address.component";
import { ClientsService } from "./clients.service";
import { MAT_DIALOG_DEFAULT_OPTIONS } from "@angular/material";
import { ChartsModule } from "ng2-charts";

@NgModule({
  imports: [
    CommonModule,
    ClientsRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    PlatformMaterialModule,
    ChartsModule
  ],
  providers: [
    ClientsService,
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
    DemographicInfoComponent,
    AddressComponent,
  ],
  declarations: [
    ClientComponent,
    DemographicInfoComponent,
    AddressComponent,
   
  ]
  //exports: [DiagnosisModalComponent]
})
export class ClientsModule {}
