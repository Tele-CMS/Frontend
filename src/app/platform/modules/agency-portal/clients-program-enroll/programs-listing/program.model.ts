import { FilterModel } from "../../../core/modals/common-model";

export class ProgramModel {
    assignedDate: string;
    dateOfEnrollment: string;
    diseaseManageProgram: string;
    diseaseManageProgramId: number
    patientDiseaseManagementProgramId: number
    patientId: number;
    totalRecords: number;
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
    otherFrequencyDescription: string
}

export class ProgramsFilterModel extends FilterModel {
    ProgramIds: Array<number>;
    Status: number=null;
    StartDate: string;
    EndDate: string;
    CareManagerIds: Array<number>;
    EnrollmentId: number
    conditionId:Array<number>
    isEligible?:string
    startAge: number;
    endAge: number;
    searchText:string;
    relationship:Array<string>
    genderId: Array<number>
    nextAppointmentPresent: boolean;
}

export class ClientBulkMessageEmail {
    id?: number;
    subject: string;
    message: string;
    template: string;
    templateName: string;
    value: string
}
