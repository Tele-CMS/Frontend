export class ProgramModel {
    assignedDate: string;
    dateOfEnrollment: string;
    diseaseManageProgram: string;
    diseaseManageProgramId: number
    patientDiseaseManagementProgramId: number
    patientId: number
}
export class DMProgramsModel {
    id: number;
    description: string;
}
export class ProgramsDataModel {
    programName: string;
    programId: number;
    dateOfEnrollment: string;
    graduationDate: string;
    dateOfTermination: string;
    statusId: number;
    frequencyId: number;
    otherFrequencyDescription:string
}