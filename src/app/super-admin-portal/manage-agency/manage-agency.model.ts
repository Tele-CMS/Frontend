export class OrganizationSubscriptionPlan {
    id?: number;
    planName?: string;
    startDate?: Date;
    planType?: number;
    amountPerClient?: number;
    totalNumberOfClients?: number;
    organizationID?: number;
    isDeleted?: boolean;
}

export class OrganizationSMTPDetail {
    id?: number;
    serverName?: string;
    port?: string;
    connectionSecurity?: string;
    smtpUserName?: string;
    smtpPassword?: string;
    smtpConfirmPassword?: string;
    organizationID?: number;
    isDeleted?: boolean;
}

export class ManageAgencyModel {
    id?: number;
    organizationName?: string;
    businessName?: string;
    description?: string;
    address?: string;
    address1?: string;
    apartmentNumber?: number;
    countryID?: number;
    stateID?: number;
    city?: string;
    zip?: string;
    phone?: string;
    fax?: string;
    email?: string;
    logo?: string;
    favicon?: string;
    contactPersonFirstName?: string;
    contactPersonMiddleName?: string;
    contactPersonLastName?: string;
    contactPersonPhoneNumber?: string;
    contactPersonEmail?: string;
    userName?: string;
    password?: string;
    VendorIdDirect?: string;
    VendorNameDirect?: string;
    VendorIdIndirect?: string;
    VendorNameIndirect?: string;
    confirmPassword?: string;
    databaseDetailId?: number;
    databaseName?: string;
    isDeleted?: boolean = false;
    isActive?: boolean = true;
    latitude?: number = 0;
    longitude?: number = 0;
    totalRecords?: number;
    organizationSubscriptionPlans?: OrganizationSubscriptionPlan = {};
    organizationSMTPDetail?: OrganizationSMTPDetail = {};
    isPersonalAccount: boolean;
    preOrganizationID: any;
    nPINumber: any;
}
