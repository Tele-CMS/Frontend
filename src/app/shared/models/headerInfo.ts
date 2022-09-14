import { NavItem } from "./navItem";

export interface HeaderInfo {
  user: object;
  userLocations?: Array<object>;
  userNavigations?: NavItem[];
}
export class NotificationsModel {
  messageNotification: MessageNotificationModel[];
  userDocumentNotification: UserDocumentNotificationModel[];
}
export class UserDocumentNotificationModel {
  documentId: number;
  message: string;
  documentName: string;
  expiration: string;
  timeStamp: string;
  notificationAction: string;
  type: string;
}
export class MessageNotificationModel {
  messageId: number;
  parentMessageId: number;
  thumbNail: string;
  fromName: string;
  subject: string;
  messageDate: string;
}
