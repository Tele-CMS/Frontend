import { Metadata } from "./../../../../../super-admin-portal/core/modals/common-model";
import { PaymentFilterModel } from "./../../../core/modals/common-model";
import { PaymentService } from "./../payment.service";
import { DialogService } from "src/app/shared/layout/dialog/dialog.service";
import { NotifierService } from "angular-notifier";
import { ActivatedRoute, Router } from "@angular/router";
import { FormBuilder } from "@angular/forms";
import { FormGroup } from "@angular/forms";
import { Component, OnInit } from "@angular/core";
import { FilterModel } from "src/app/platform/modules/core/modals/common-model";
import { CommonService } from "src/app/platform/modules/core/services";
import { MatDatepickerInputEvent } from "@angular/material/datepicker";
import { DatePipe } from "@angular/common";
import { AppointmentTypeService } from "../../masters/appointment-type/appointment-type.service";
import { AppointmentTypeModal } from "../../masters/appointment-type/appointment-type.model";
import { MasterService } from "../../masters/service/service.service";
@Component({
  selector: "app-payment-history",
  templateUrl: "./payment-history.component.html",
  styleUrls: ["./payment-history.component.css"]
})
export class PaymentHistoryComponent implements OnInit {
  metaData: any;
  filterModel: PaymentFilterModel;
  paymentFormGroup: FormGroup;
  payments: Array<any> = [];
  appopintmentTypes: any[] = [];
  appopintmentStatus: any[] = [];
  displayedColumns: Array<any> = [
    {
      displayName: "Payment Date",
      key: "paymentDate",
      isSort: true,
      class: ""
    },

    {
      displayName: "Payment",
      key: "netAmount",
      class: "",
      isSort: true,

    },
    {
      displayName: "Patient",
      key: "fullName",
      class: "",
      isSort: true,
    },
    {
      displayName: "Appt Date",
      key: "appointmentDate",
      class: "",
      isSort: true,
    },
    {
      displayName: "Appt Time",
      key: "appointmentTime",
      class: ""
    },

    {
      displayName: "Appt Status",
      key: "status",
      class: "",

    },

    {
      displayName: "Transaction Id",
      key: "paymentToken",
      class: ""
    }

  ];
  actionButtons: Array<any> = [
  ];
  totalNetAmount: number;
monthstatus:string;
  constructor(
    private formBuilder: FormBuilder,
    private paymentService: PaymentService,
    private datePipe: DatePipe,
    private route: ActivatedRoute,
  ) {
    this.filterModel = new PaymentFilterModel();

  }
  ngOnInit() {
    this.route.queryParams
      .subscribe(params => {
        this.monthstatus = params.monthstatus;
      });

    this.paymentFormGroup = this.formBuilder.group({
      name: "",
      payDate: "",
      appDate: "",
      appStatus: "",
      appType: "",
      rangeStartDate: "",
      rangeEndDate: "",
    });
    this.setIntialValues();
    this.getMasterData();
    this.getPayments(this.filterModel);

  }
  setIntialValues() {

    if(this.monthstatus!=null){
      var date = new Date();
      this.f.rangeStartDate.setValue(new Date(date.getFullYear(), date.getMonth()-1, 1));
      this.f.rangeEndDate.setValue(new Date(date.getFullYear(), date.getMonth(), 0));
      this.filterModel.RangeStartDate = new Date(date.getFullYear(), date.getMonth()-1, 1).toString();
      this.filterModel.RangeEndDate = new Date(new Date(date.getFullYear(), date.getMonth(), 0)).toString();
    }
    else{
      var date = new Date();
      this.f.rangeStartDate.setValue(new Date(date.getFullYear(), date.getMonth(), 1));
      this.f.rangeEndDate.setValue(new Date(date.getFullYear(), date.getMonth() + 1, 0));
      this.filterModel.RangeStartDate = new Date(date.getFullYear(), date.getMonth(), 1).toString();
      this.filterModel.RangeEndDate = new Date(new Date(date.getFullYear(), date.getMonth() + 1, 0)).toString();
    }


    this.applyFilter();

  }
  get f() {
    return this.paymentFormGroup.controls;
  }
  onPageOrSortChange(changeState?: any) {
    this.setPaginatorModel(
      changeState.pageNumber,
      changeState.pageSize,
      changeState.sort,
      changeState.order,
      this.f.name.value,
      this.f.payDate.value,
      this.f.appDate.value,
      this.f.appStatus.value,
      this.f.appType.value,
      this.f.rangeStartDate.value,
      this.f.rangeEndDate.value
    );
    this.getPayments(this.filterModel);
  }
  applyPayDateFilter(event: MatDatepickerInputEvent<Date>) {
    this.f.payDate.setValue(new Date(event.value));
    this.applyFilter();
  }
  applyAppDateFilter(event: MatDatepickerInputEvent<Date>) {

    this.f.appDate.setValue(new Date(event.value));
    this.applyFilter();
  }
  onDropDownClose(event: boolean) {
    if (!event)
      this.applyFilter();
  }

  applyStartDateFilter(event: MatDatepickerInputEvent<Date>) {
    this.f.rangeStartDate.setValue(new Date(event.value));
    this.applyFilter();
  }

  applyEndDateFilter(event: MatDatepickerInputEvent<Date>) {
    this.f.rangeEndDate.setValue(new Date(event.value));
    this.applyFilter();
  }

  applyFilter() {
    this.setPaginatorModel(
      1,
      this.filterModel.pageSize,
      this.filterModel.sortColumn,
      this.filterModel.sortOrder,
      this.f.name.value,
      this.f.payDate.value,
      this.f.appDate.value,
      this.f.appStatus.value,
      this.f.appType.value,
      this.f.rangeStartDate.value,
      this.f.rangeEndDate.value,
    );

    this.getPayments(this.filterModel);
  }

  getPayments(filterModel: PaymentFilterModel) {

    this.paymentService
      .getAppointmentPayments(filterModel)
      .subscribe((response: any) => {
        if (response != null && response.statusCode == 302) {
          this.metaData = response.meta;
          this.payments = response.data;
          if (this.payments && this.payments.length > 0) {

            this.payments = this.payments.map(x => { x.netAmount = "$ " + x.netAmount; return x });
            this.totalNetAmount = this.payments[0].totalNetAmount as number;
          }
        } else {
          this.payments = [];
          this.metaData = new Metadata();
        }
        this.metaData.pageSizeOptions = [5, 10, 25, 50, 100];
      });
  }
  clearFilters() {
    this.paymentFormGroup.reset();

    this.setPaginatorModel(
      1,
      this.filterModel.pageSize,
      this.filterModel.sortColumn,
      this.filterModel.sortOrder,
      "",
      "",
      "",
      "",
      "",
      "",
      ""
    );
    this.getPayments(this.filterModel);
  }


  setPaginatorModel(
    pageNumber: number,
    pageSize: number,
    sortColumn: string,
    sortOrder: string,
    name: string,
    payDate: any,
    appDate: any,
    appStatus: any,
    appType: any,
    rangeStartDate: any,
    rangeEndDate: any

  ) {
    this.filterModel.pageNumber = pageNumber;
    this.filterModel.pageSize = pageSize;
    this.filterModel.sortOrder = sortOrder;
    this.filterModel.sortColumn = sortColumn;
    this.filterModel.PatientName = name;
    this.filterModel.AppointmentType = appType && appType.length > 0 ? appType.toString() : "";
    this.filterModel.Status = appStatus && appStatus.length > 0 ? appStatus.toString() : "";

    this.filterModel.PayDate =
      payDate != null && payDate != ""
        ? this.datePipe.transform(new Date(payDate), "MM/dd/yyyy")
        : "";
    this.filterModel.AppDate =
      appDate != null && appDate != ""
        ? this.datePipe.transform(new Date(appDate), "MM/dd/yyyy")
        : "";

    this.filterModel.RangeStartDate = rangeStartDate != null && rangeStartDate != ""
      ? this.datePipe.transform(new Date(rangeStartDate), "MM/dd/yyyy")
      : "";
    this.filterModel.RangeEndDate = rangeEndDate != null && rangeEndDate != ""
      ? this.datePipe.transform(new Date(rangeEndDate), "MM/dd/yyyy")
      : "";
  }

  getMasterData() {
    const data = "APPOINTMENTTYPE,APPOINTMENTSTATUS";
    this.paymentService.getMasterData(data).subscribe((response: any) => {
      if (response != null) {
        this.appopintmentTypes = response.appointmentType != null ? response.appointmentType : [];
        this.appopintmentStatus = response.appointmentStatus != null ? response.appointmentStatus : [];
      }
    });
  }

  exportPaymentPdf() {

    this.paymentService.exportPaymentPdf(this.filterModel)
      .subscribe((response: any) => {

        this.paymentService.downLoadFile(response, 'application/pdf', `Payment Report`)
      });
  }



}
