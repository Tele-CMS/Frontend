export class PayrollReportModel {
    staffId: number;
    appointmentDate: Date;
    staffName: string;
    appointmentTypeId: number;
    appointmentType: string;
    activityTime: number;
    totalHoursWorkedInDay: number;
    dailyLimit: number;
    dayTimeWithoutOT: number;
    overtime: number;
    doubleOvertime: number;
    totalDistance: number;
    noOfBreaks: number;
}