export class FilterModel {
  pageNumber: number = 1;
  pageSize: number = 5;
  sortColumn: string = "";
  sortOrder: string = "";
  searchText: string = "";
}
export class ReportModel {
  pageNumber: number = 1;
  pageSize: number = 10;
  sortColumn: string = "";
  sortOrder: string = "";
  searchText: string = "";
}


export class ResponseModel {
  data: any = [];
  statusCode: number;
  message: string = "";
  appError: string = "";
  meta: Metadata;
}
export class Metadata {
  totalRecords: number;
  currentPage: number;
  pageSize: number;
  defaultPageSize: number;
  totalPages: number;
  pageSizeOptions:number[]=[];
}

export class ProviderListFilterModel {
  pageNumber: number = 1;
  pageSize: number = 10;
  sortColumn: string = "";
  sortOrder: string = "";
  searchText: string = "";
}

export class ProviderSearchFilterModel extends ProviderListFilterModel {
  Date: string;
  Locations: string;
  Taxonomies: string;
  // Genders: string;
  Gender: string;
  Specialities: string;
  Services: string;
  Rates: string;

  MinRate: string;
  
  ReviewRating: string;
  SortType:string;
  ProvidersearchText:string;
  ProviderId:string;
  keywords:string;
}
export class PaymentFilterModel extends FilterModel {
  AppDate: string = "";
  PayDate: string = "";
  PatientName: string = "";
  StaffName: string = "";
  Status: string = "";
  AppointmentType: string = "";
  RangeStartDate: string = "";
  RangeEndDate: string = "";

}
export class RefundFilterModel extends FilterModel {
  AppDate: string = "";
  RefundDate: string = "";
  PatientName: string = "";
  StaffName: string = "";
}

