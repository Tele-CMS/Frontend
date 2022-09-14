import { FilterModel } from "src/app/super-admin-portal/core/modals/common-model";

export class ClientEncounter {

    id: number;
    patientID: number;
    patientAppointmentId: number;
    dateOfService: Date;
    startDateTime: Date;
    endDateTime: Date;
    appointmentStartDateTime: Date;
    appointmentEndDateTime: Date;
    serviceLocationID: number;
    staffName: string;
    patientName: string;
    duration: string;
    appointmentType: string;
    status: string;
    totalRecords: number;
    unitsBlocked: number;
    unitsConsumed: number;
    isDirectService: boolean;
    isBillableEncounter: boolean;
}
export class ClientEncounterFilterModel extends FilterModel {
    
    fromDate: string;
    toDate:string;
    encounterTypeIds:Array<number>;
    CareManagerIds: Array<number>;
    EnrollmentId: number;
    status:number;
    message: string;
    subject: string;
    nextAppointmentPresent: boolean;
  }
