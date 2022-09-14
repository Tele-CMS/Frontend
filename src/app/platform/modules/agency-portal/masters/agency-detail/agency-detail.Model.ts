export class OrganizationModel {
    id: number;
    organizationName: string;
    businessName: string;
    description: string;
    address: string;
    phone: string;
    fax: string;
    email: string;
    logo: string;
    favicon: string;
    contactPersonName: string;
    contactPersonPhoneNumber: string;
    databaseDetailId: number;
    isDeleted: boolean;
    isActive: boolean;
    payrollStartWeekDay: string;
    payrollEndWeekDay: string;
    startDate: Date;
    planType: number;
    amountPerClient: number;
    totalNumberOfClients: number;
}