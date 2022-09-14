export class MemberHRAModel {
    id: number
    patientId: number
    documentId: number
    statusId: number
    patientDocumentId: number
    memberName: string;
    eligibilityStartDate: string;
    assessmentName: string;
    diseaseConditions: string;
    score: string;
    risk: string;
    count:number;
    distinctPatients:number;
    distinctAssessments:number
    healthPlan: string;
    assignedDate: string;
    expirationDate: string;
    completionDate: string;
    status: string;
    assignedBy: number;
    isChecked: boolean;
  totalRecords: number
  nextAppointmentDate: string;
}
export class MemberBulkHRAEmail{
    id?:number;
    subject:string;
    message:string;
    template:string;
    templateName:string;
    value:string
}
