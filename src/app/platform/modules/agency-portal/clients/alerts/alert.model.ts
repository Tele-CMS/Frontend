import { FilterModel } from "../../../core/modals/common-model";

export class AlertsFilterModel extends FilterModel{
    PatientId: number;
    AlertTypeIds: Array<number>;
    startDate: string;
    endDate: string;
}