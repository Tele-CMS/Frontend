export class UserInvitationModel {
    invitationId: number;
    name: string;
    email: string;
    phone: string;
    locationId: number;
    location: string;
    organizationId: number;
    organization: string;
    createdDate: string;
    invitationSendDate: string;
}
export class SendUserInvitationModel {
    invitationId: number;
    firstName: string;
    middleName: string;
    lastName: string;
    email: string;
    phone: string;
    roleId:number;
}
