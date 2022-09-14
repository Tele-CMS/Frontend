import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../../../shared/shared.module';
import { MatButtonModule, MatInputModule } from '@angular/material';
import {ClearingHouseRoutingModule} from './clearing-house.routing';
import { ClearingHouseListingComponent } from './clearing-house-listing/clearing-house-listing.component'
import { ClearingHouseService } from './clearing-house.service';
import { AddClearingHouseComponent } from './add-clearing-house/add-clearing-house.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    MatButtonModule,
    MatInputModule,
    ClearingHouseRoutingModule
  ],
  entryComponents:[AddClearingHouseComponent],
  declarations: [ClearingHouseListingComponent, AddClearingHouseComponent],
  providers: [ClearingHouseService]
})
export class ClearingHouseModule { }
