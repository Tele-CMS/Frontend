export class MessageCountModel {
    inboxCount: number=0;
    sentboxCount: number=0;
    favouriteMessageCount: number=0;
    deletedMessageCount: number=0;
}
export class MessageModel{
    messageId: number;
    fromName: string;
    toName: string;
    toUserId:number;
    thumbnail: string;
    isStaff: boolean;
    subject: string;
    text: string;
    messageDate: string;
    unread: boolean;
    isFavourite: boolean;
    parentMessageId?: number;
    fromInbox: boolean;
    totalCount: number;
    totalRecords: number;
    title:string;
    forwardReply:string;
    fromUserId:number;
    isThreadType:boolean=false;
    isCheckBoxClicked:boolean=false
}