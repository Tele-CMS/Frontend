import { NgModule } from "@angular/core";
//import { MatFileUploadModule } from "angular-material-fileupload";

import {
  MatButtonModule,
  MatCheckboxModule,
  MatToolbarModule,
  MatChipsModule,
  MatOptionModule,
  MatGridListModule,
  MatProgressBarModule,
  MatSliderModule,
  MatSlideToggleModule,
  MatMenuModule,
  MatDialogModule,
  MatSnackBarModule,
  MatSelectModule,
  MatInputModule,
  MatSidenavModule,
  MatCardModule,
  MatIconModule,
  MatRadioModule,
  MatProgressSpinnerModule,
  MatTabsModule,
  MatListModule,
  MatTableModule,
  MatPaginatorModule,
  MatSortModule,
  MatDatepickerModule,
  MatNativeDateModule,
  MatExpansionModule
} from "@angular/material";
import { NgxMaterialTimepickerModule } from "ngx-material-timepicker";
import { MatTooltipModule } from "@angular/material/tooltip";

@NgModule({
  imports: [
    MatButtonModule,
    MatCheckboxModule,
    MatToolbarModule,
    MatChipsModule,
    MatOptionModule,
    MatGridListModule,
    MatProgressBarModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatMenuModule,
    MatDialogModule,
    MatSnackBarModule,
    MatSelectModule,
    MatInputModule,
    MatSidenavModule,
    MatCardModule,
    MatIconModule,
    MatRadioModule,
    MatProgressSpinnerModule,
    MatTabsModule,
    MatListModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    //NgxMaterialTimepickerModule,
    [NgxMaterialTimepickerModule.forRoot()],
    MatDatepickerModule,
    MatNativeDateModule,
    MatTooltipModule,
    MatExpansionModule
    // MatFileUploadModule
    
  ],
  exports: [
    MatButtonModule,
    MatCheckboxModule,
    MatToolbarModule,
    MatChipsModule,
    MatOptionModule,
    MatGridListModule,
    MatProgressBarModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatMenuModule,
    MatDialogModule,
    MatSnackBarModule,
    MatSelectModule,
    MatInputModule,
    MatSidenavModule,
    MatCardModule,
    MatIconModule,
    MatRadioModule,
    MatProgressSpinnerModule,
    MatTabsModule,
    MatListModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    NgxMaterialTimepickerModule,
    MatDatepickerModule,
    MatTooltipModule,
    MatExpansionModule
    //MatFileUploadModule
  ]
})
export class FrontMaterialModule {}
