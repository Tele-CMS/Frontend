import { FilterModel } from "../../../../core/modals/common-model";

export class ClientAlerts extends FilterModel {
    //patientId?: number;
    alertsDayDifference: number;
    AlertTypeIds: Array<number>;
    searchText : string;
    CareManagerIds: Array<number>;
    EnrollmentId: number;
    StartDate: string;
    EndDate: string;
    subject: string;
    message: string;
    dob:string;
    medicalID: string;
    eligibilityStatus: string;
    startAge: number;
    endAge: number;
    riskIds: Array<number>;
    ProgramIds: Array<number>;
    GenderIds: Array<number>;
    RelationshipIds: Array<number>;
    PrimaryConditionId: number;
  ComorbidConditionIds: Array<number>;
  nextAppointmentPresent: boolean;
}

export class AlertsReminderModel{
    id?:number = null;
    title:string = '';
    startDate: Date = new Date();
    endDate: Date = new Date();
    masterReminderMessageTypeIDs?: Array<any>;
    messageTypeIds?: Array<any>;
    masterReminderFrequencyTypeID?: string = '';
    isActive?: boolean = null;
    //enrollmentId?: number = null;
    isSendReminderToCareManager? : boolean = null;
    careManagerMessage?: string = '';
    message?: string = '';
    notes?: string = '';

    //Filters
    locationIds?:number = null;
    alertsDayDifference: number;
    AlertTypeIds: Array<number>;
    CareManagerIds: Array<number>;
    ComorbidConditionIds: Array<number>;
    FilterEndDate:  Date = new Date();
    EnrollmentId: number;
    GenderIds: Array<number>;
    PrimaryConditionId: number;
    ProgramIds: Array<number>;
    RelationshipIds: Array<number>;
    FilterStartDate:  Date = new Date();
    dob: Date = new Date();
    eligibilityStatus: string;
    endAge: number;
    medicalID: string;
    riskIds: Array<number>;
    searchText : string;
    //subject: string;
    //message: string;
    startAge: number;

    
}
