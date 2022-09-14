export class CancelationRule {
    uptoHours: number;
    refundPercentage: number;
}

export class ManageFeesRefundsModel{
    providers:number[];
    f2fFee: number;
    newOnlineFee: number;
    folowupFees: number;
    folowupDays: number;
    cancelationRules : CancelationRule[] =[];
    urgentcareFee:number;
}

