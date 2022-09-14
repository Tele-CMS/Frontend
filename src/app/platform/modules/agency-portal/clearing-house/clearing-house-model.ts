export class ClearingHouseListingModel {
    id?: number = null;
    name?: string = '';
}

export class ClearingHouseModel {
    id: number;
    clearingHouseName: string;
    senderID: string;
    receiverID: string;
    interchangeQualifier: string;
    ftpurl: string;
    portNo: string;
    ftpUsername: string;
    ftpPassword: string;
    path837: string;
    path835: string;
    totalRecords: number;
}