export class EncounterModel {
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