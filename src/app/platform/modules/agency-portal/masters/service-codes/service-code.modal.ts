export class ServiceCodeModal {
  id?: number = 0;
  serviceCode?: string = "";
  ruleID?: number = null;
  unitDuration?: number = null;
  unitTypeID?: number = null;
  ratePerUnit?: number = null;
  description?: string = "";
  modifierModel?: Modifier[];
  isBillable?: boolean = false;
  isRequiredAuthorization?: boolean = false;
  type?: string = "";
  totalRecords?: number = null;
  isBillableStatus?: string = "";
  reqAuthStatus?: string = "";
  serviceCodeId?: number = 0;
  linkedEncounterId? : any;
}

export class Modifier {
  modifier?: string = "";
  rate?: number = null;
}
