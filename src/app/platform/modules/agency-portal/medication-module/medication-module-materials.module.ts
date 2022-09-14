import { NgModule } from '@angular/core';
import { MatButtonModule, MatDialogModule, MatSelectModule, MatInputModule, MatTabsModule, MatDatepickerModule, MatNativeDateModule, MatCardModule, MatSlideToggleModule, MatCheckboxModule, MatAutocompleteModule } from '@angular/material';


@NgModule({
  imports: [
    MatButtonModule, MatDialogModule, MatSelectModule, MatInputModule, MatTabsModule, MatCardModule, MatSlideToggleModule, MatCheckboxModule, MatAutocompleteModule
  ],
  exports: [
    MatButtonModule, MatDialogModule, MatSelectModule, MatInputModule, MatTabsModule, MatDatepickerModule, MatCardModule, MatSlideToggleModule, MatCheckboxModule, MatAutocompleteModule
  ],
})
export class MedicationModuleMaterialsModule { }
