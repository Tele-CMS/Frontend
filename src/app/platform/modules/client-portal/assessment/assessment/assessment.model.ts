export class AssessmentModel {
    assignedBy: string;
    createdDate: string;
    documentId: number;
    documentName: string;
    documenttypeId: number;
    id: number;
    patientId: number;
    patientName: string;
    qScore: number;
    risk: string;
    status: string;
    assignedById:number;
}
export class PatientDocumentModel {
    id: number;
    patientDocumentId: number;
    documentId: number;
    documentName: string;
    patientName: string;
    patientId: number;
    assignedBy: string;
    status: string;
    completionDate:Date
    expirationDate:Date
    createdDate: Date;
    totalRecords: number;
}