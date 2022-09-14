export class UserTimesheetSheetViewModel {
    id: number;
    appointmentTypeId: number;
    appointmentTypeName: string;
    staffId: number;
    staffName: string;
    sunday: number;
    monday: number;
    tuesday: number;
    wednesday: number;
    thursday: number;
    friday: number;
    saturday: number;
    sunDate: Date;
    monDate: Date;
    tueDate: Date;
    wedDate: Date;
    thuDate: Date;
    friDate: Date;
    satDate: Date;
}
export class UserTimesheetTabularViewModel {
    id?: number;
    dateOfService?: string;
    startDateTime?: string;
    endDateTime?: string;
    appointmentTypeId?: number;
    appointmentTypeName?: string;
    staffId?: number;
    staffName?: string;
    statusId?: number;
    status?: string;
    distance?: number;
    driveTime?: number;
    expectedTimeDuration?: number;
    actualTimeDuration?: number;
    isTravelTime?: boolean;
    notes?: string;
}