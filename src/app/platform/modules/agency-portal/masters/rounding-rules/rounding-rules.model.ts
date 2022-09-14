export class RoundingRuleModel {
    id?: number = 0;
    organizationID?: number = 0;
    ruleName?: string = '';
    roundingRuleDetail?: RoundingRuleDetail[];
}
export class RoundingRuleDetail {
    id?: number = 0;
    endRange?: number = 0;
    startRange?: number = 0;
    unit?: number = 0;
    isDeleted?: boolean = false;
}
