import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MailboxComponent } from './mailbox/mailbox.component';
import { MailingRoutingModule } from './mailing-routing.module';
import { MatCheckboxModule, MatIconModule, MatFormFieldModule, MatInputModule, MatChip, MatChipsModule, MatAutocomplete, MatAutocompleteModule, MatSidenavModule, MatButtonModule } from '@angular/material';
import {MatMenuModule} from '@angular/material/menu';
import { ScrollbarModule } from 'ngx-scrollbar';
import { MailboxService } from './mailbox.service';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AngularEditorModule } from '@kolkov/angular-editor';

@NgModule({
  imports: [
    CommonModule,
    MailingRoutingModule,
    MatCheckboxModule,
    MatMenuModule,
    MatIconModule,
    ScrollbarModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule,
    FormsModule,
    MatChipsModule,
    MatAutocompleteModule,
    MatSidenavModule,
    AngularEditorModule
  ],
  providers:[MailboxService],
  declarations: [MailboxComponent]
})
export class MailingModule { }
