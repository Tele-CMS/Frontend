export class ManageDatabaseModel {
    databaseDetailID: number;
    noOfOrg: number;
    databaseName: string;
    password: string;
    serverName: string;
    userName: string;
    createdBy: number;
    createdDate: string;
    isActive: boolean;
    isCentralised: boolean;
    isDeleted: boolean;
    rowNumber: number;
    totalRecords: number;
    totalPages: number;
    updatedBy?: number;
    updatedDate?: string;
    organizations?: string;
}