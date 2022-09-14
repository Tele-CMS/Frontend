import { Injectable } from "@angular/core";
import { CommonService } from "../core/services";
import { FilterModel } from "../core/modals/common-model";
import { map } from "rxjs/operators";

@Injectable({
    providedIn: 'root'
})

export class MailboxService {
    private getMessageCountURL = "api/Message/GetMessageCounts";
    private getInboxMessagesURL ="api/Message/GetInboxData";
    private getSentMessagesURL ="api/Message/GetSentMessageData";
    private getDeletedMessagesURL ="api/Message/GetDeleteMessageList";
    private getFavouriteMessagesURL="api/Message/GetFavouriteMessageList";
    private deleteSentMessagesURL="api/Message/DeleteSentMessage";
    private deleteInboxMessagesURL="api/Message/DeleteInboxMessage";
    private getThreadMessagesURL="api/Message/GetThreadMessages";
    private getMessageByIdURL="api/Message/GetMessageById";
    private replyMessageURL="api/Message/ReplyMessages";
    private forwardMessageURL="api/Message/ForwardMessages";
    private getUserListURL="api/Message/UsersDropDown";
    private composeMessageURL="api/Message/Compose";
    private setMessageAsFavouriteURL="api/Message/ChangeFavouriteMessageStatus";
    

    constructor(private commonService: CommonService) {
    }

    getMessageCount(forStaff: boolean) {
        return this.commonService.getAll(this.getMessageCountURL+"?forStaff="+forStaff, {});
    }
    getInboxMessages(id:number,forStaff:boolean,filterModel:FilterModel)
    {
        return this.commonService.getAll(this.getInboxMessagesURL+"?id="+id+"&forStaff="+forStaff+ "&pageNumber="+filterModel.pageNumber+"&pageSize="+filterModel.pageSize+"&sortColumn="+filterModel.sortColumn+"&sortOrder="+filterModel.sortOrder, {});
    }
    getSentMessages(id:number,forStaff:boolean,filterModel:FilterModel)
    {
        return this.commonService.getAll(this.getSentMessagesURL+"?id="+id+"&forStaff="+forStaff+ "&pageNumber="+filterModel.pageNumber+"&pageSize="+filterModel.pageSize+"&sortColumn="+filterModel.sortColumn+"&sortOrder="+filterModel.sortOrder, {});
    }
    getDeletedMessages(id:number,forStaff:boolean,filterModel:FilterModel)
    {
        return this.commonService.getAll(this.getDeletedMessagesURL+"?id="+id+"&forStaff="+forStaff+ "&pageNumber="+filterModel.pageNumber+"&pageSize="+filterModel.pageSize+"&sortColumn="+filterModel.sortColumn+"&sortOrder="+filterModel.sortOrder, {});
    }
    getFavouriteMessages(id:number,forStaff:boolean,filterModel:FilterModel)
    {
        return this.commonService.getAll(this.getFavouriteMessagesURL+"?id="+id+"&forStaff="+forStaff+ "&pageNumber="+filterModel.pageNumber+"&pageSize="+filterModel.pageSize+"&sortColumn="+filterModel.sortColumn+"&sortOrder="+filterModel.sortOrder, {});
    }
    getThreadMessage(id:number,forStaff:boolean)
    {
        return this.commonService.getAll(this.getThreadMessagesURL+"?parentMessageId="+id+"&forStaff="+forStaff, {});
    }
    getMessageById(id:number)
    {
        return this.commonService.getById(this.getMessageByIdURL+"?MessageId="+id, {});
    }
    replyMessage(id:number)
    {
        return this.commonService.getById(this.replyMessageURL+"?MessageId="+id, {});
    }
    forwardMessage(id:number)
    {
        return this.commonService.getById(this.forwardMessageURL+"?MessageId="+id, {});
    }
    
    getUserList(forStaff:boolean,searchText:string='')
    {
        return this.commonService.getAll(this.getUserListURL+"?isStaff="+forStaff +"&searchText="+searchText, {})
        .pipe(map(x=>{
            return x.data;
          }));
    }
   
    composeMessage(data:any)
    {
        return this.commonService.post(this.composeMessageURL, data);
    }
    setMessageAsFavourite(id:number,fromInbox:boolean,isFavourite)
    {
        return this.commonService.patch(this.setMessageAsFavouriteURL+"?MessageId="+id+"&FromInbox="+fromInbox+"&IsFavourite="+isFavourite, {});
    }

    deleteSentMessages(ids:any)
    {
        return this.commonService.patch(this.deleteSentMessagesURL, ids);
    }
    deleteInboxMessages(ids:any)
    {
        return this.commonService.patch(this.deleteInboxMessagesURL, ids);
    }
}