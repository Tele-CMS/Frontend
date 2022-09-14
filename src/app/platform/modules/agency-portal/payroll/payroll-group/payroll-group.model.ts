export class PayrollGroupModel {
    id: number = 0;
    groupName: string = "";
    payPeriodId: number = null;
    workWeekId: number = null;
    dailyLimit: number = null;
    weeklyLimit: number = null;
    overTime: number = null;
    doubleOverTime: number = 0;
    isCaliforniaRule: boolean = false;
    payPeriodName: string = "";
    workWeekName: string = "";
    totalRecords: number = null;
    payrollBreakTimeId: number = null;
}