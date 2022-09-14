import { FilterModel } from "../../../core/modals/common-model";

export  class CustomReportBulkMessageEmail{
    id?:number;
    subject:string;
    message:string;
    template:string;
    templateName:string;
    value:string
}


export class CustomReportFilter extends FilterModel {
    ruleId?: string = null;
    isEligible: boolean = false;
    isBiometricsComplete?: boolean = null;
    isEncountersCompliant?: boolean = null;
}

export class CustomReportEmailandMessageFilter {
  ruleId?: string = null;
  isEligible: boolean = false;
  isBiometricsComplete?: boolean = null;
  isEncountersCompliant?: boolean = null;
  message: string = null;
  subject: string = null;
  pageNumber: number = 1;
  pageSize: number = 5;
  sortColumn: string = '';
  sortOrder: string = '';
  searchText: string = ''
}
