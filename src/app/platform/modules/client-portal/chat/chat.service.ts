import { Injectable } from '@angular/core';
import { CommonService } from '../../core/services';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private getCareManagersListURL = 'CareManger/GetCareTeamMemberList';
  private getChatHistoryURL = "Chat/GetChatHistory";
  private updateChatForPOC = "Chat/UpdateChatForPOC";
  private getCareChatHistoryURL = "Chat/GetCareChatHistory";
  constructor(private commonService: CommonService) { }

  getCareManagersList(patientId: number, searchText: string, pageNumber: number, pageSize: number):Observable<any> {
    const queryParams = `?patientId=${patientId}&searchText=${searchText}&pageNumber=${pageNumber}&pageSize=${pageSize}`;
    return this.commonService.getAll(this.getCareManagersListURL + queryParams, {});
  }

  getChatHistory(fromUserId: number, toUserId: number, pageNo: number, pageSize: number) {
    return this.commonService.getAll(`${this.getChatHistoryURL}?FromUserId=${fromUserId}&ToUserId=${toUserId}&pageNumber=${pageNo}&pageSize=${pageSize}`, {}, false);
  }

  getCareChatHistory(fromUserId: number, toUserId: number, pageNo: number, pageSize: number) {
    return this.commonService.getAll(`${this.getCareChatHistoryURL}?FromUserId=${fromUserId}&ToUserId=${toUserId}&pageNumber=${pageNo}&pageSize=${pageSize}`, {}, false);
  }

  UpdateChatForPOC(chatId: number, confirmtype: string) {
    return this.commonService.getAll(`${this.updateChatForPOC}?ChatId=${chatId}&Confirmtype=${confirmtype}`, {}, false);
  }

}
