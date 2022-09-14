export class AudiLogModel {
    id: number;
    oldValue: string;
    newValue: string;
    action: string;
    logDate: Date;
    columnName: string;
    screenName: string;
    tableName: string;
    patientName: string;
    createdByName: string;
    ipAddress: string;
    totalRecords: number;
    parentInfo: string;
    columnID: number;
}
export class LoginLogModel {
    id: number;
    oldValue: string;
    newValue: string;
    action: string;
    logDate: Date;
    columnName: string;
    screenName: string;
    tableName: string;
    patientName: string;
    createdByName: string;
    ipAddress: string;
    totalRecords: number;
    columnID: number;
    loginAttempt: string;
    roleName: string;
    userName: string;
}

export class HRAEmailAndMessageReportLogModel {
    id: number;
    fileName: string;
    reportDate: Date;
    formatReportDate: string;
    reportType: number;
    hRAReportType: string;
    careManagerName: string;
    totalRecords: number;
}
