export class PayrollBreakTimeModel {

    id?: number = 0;
    name?: string = "";
    duration?: number = 0;
    stateId?: number = 0;
    countryID?: number = 0;
    payrollBreaktimeDetails?: PayrollBreaktimeDetailModel[];
}
export class PayrollBreaktimeDetailModel {
    id?: number = 0;
    startRange?: number = 0;
    endRange?: number = 0;
    numberOfBreaks?: number = 0;
    isDeleted?: boolean = false;
}

