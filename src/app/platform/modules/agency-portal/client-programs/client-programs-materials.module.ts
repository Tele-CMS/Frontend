import { NgModule } from '@angular/core';
import { MatButtonModule, MatDialogModule, MatSelectModule, MatInputModule, MatDatepickerModule, MatCheckboxModule } from '@angular/material';


@NgModule({
  imports: [
    MatButtonModule, MatDialogModule, MatSelectModule, MatInputModule, MatCheckboxModule
  ],
  exports: [
    MatButtonModule, MatDialogModule, MatSelectModule, MatInputModule, MatDatepickerModule, MatCheckboxModule
  ],
})
export class ClientProgramsMaterialsModule { }
