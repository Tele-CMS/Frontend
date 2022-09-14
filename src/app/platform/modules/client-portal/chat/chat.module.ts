import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { ChatUsersComponent } from './chat-users/chat-users.component';
import { ChatMessagesComponent } from './chat-messages/chat-messages.component';
import { ChatService } from './chat.service';
import { ScrollbarModule } from 'ngx-scrollbar';
import { FormsModule } from '@angular/forms';

const routes: Routes = [{
  path: '',
  component: ChatUsersComponent
}]


@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    ScrollbarModule,
    FormsModule
  ],
  declarations: [ChatUsersComponent, ChatMessagesComponent],
  entryComponents: [ChatMessagesComponent],
  providers: [ChatService]
})
export class ChatModule { }
