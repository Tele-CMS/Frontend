import { Metadata } from "./../../../../../super-admin-portal/core/modals/common-model";
import { RefundFilterModel } from "./../../../core/modals/common-model";
import { PaymentService } from "./../payment.service";
import { DialogService } from "src/app/shared/layout/dialog/dialog.service";
import { NotifierService } from "angular-notifier";
import { Router } from "@angular/router";
import { FormBuilder } from "@angular/forms";
import { FormGroup } from "@angular/forms";
import { Component, OnInit } from "@angular/core";
import { FilterModel } from "src/app/platform/modules/core/modals/common-model";
import { CommonService } from "src/app/platform/modules/core/services";
import { MatDatepickerInputEvent } from "@angular/material/datepicker";
import { DatePipe } from "@angular/common";
@Component({
  selector: "app-refund-history",
  templateUrl: "./refund-history.component.html",
  styleUrls: ["./refund-history.component.css"]
})
export class RefundHistoryComponent implements OnInit {
  metaData: any;
  filterModel: RefundFilterModel;
  paymentFormGroup: FormGroup;
  payments: Array<any> = [];
  displayedColumns: Array<any> = [
    {
      displayName: "Refund Date",
      key: "refundDate",
      isSort: true,
      class: "",
      width: "12%"
    },
    // {
    //   displayName: "Payment Amount",
    //   key: "bookingAmount",
    //   class: ""
    // },
    // {
    //   displayName: "Commission",
    //   key: "commissionPercentage",
    //   class: ""
    // },
    {
      displayName: "Payment",
      key: "netAmount",
      class: "",
      type: "decimal"
    },
    {
      displayName: "Patient Name",
      key: "fullName",
      class: ""
    },
    {
      displayName: "Appt Date",
      key: "appointmentDate",
      class: ""
    },
    {
      displayName: "Appt Time",
      key: "appointmentTime",
      class: ""
    },
    {
      displayName: "Payment Mode",
      key: "paymentMode",
      class: "",
      width: "14%"
    },
    // {
    //   displayName: "Payment Status",
    //   key: "isActive",
    //   class: "",
    //   width: "10%",
    //   type: "togglespan",
    //   permission: true
    // },
    {
      displayName: "TransactionId",
      key: "refundToken",
      class: ""
    }
    //{ displayName: "Actions", key: "Actions", class: "", width: "10%" }
  ];
  actionButtons: Array<any> = [
    // { displayName: 'Edit', key: 'edit', class: 'fa fa-pencil' },
    // { displayName: 'Delete', key: 'delete', class: 'fa fa-times' },
  ];

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private notifier: NotifierService,
    private dialogService: DialogService,
    private paymentService: PaymentService,
    private datePipe: DatePipe
  ) {
    this.filterModel = new RefundFilterModel();
  }
  ngOnInit() {
    this.paymentFormGroup = this.formBuilder.group({
      name: "",
      payDate: "",
      appDate: ""
    });

    this.getPayments(this.filterModel);
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
      this.f.appDate.value
    );
    this.getPayments(this.filterModel);
  }
  applyPayDateFilter(event: MatDatepickerInputEvent<Date>) {
    this.f.payDate.setValue(new Date(event.value));
    this.applyFilter();
  }
  applyAppDateFilter(event: MatDatepickerInputEvent<Date>) {
    let d = event.value;
    let dd = new Date(event.value);
    this.f.appDate.setValue(new Date(event.value));
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
      this.f.appDate.value
    );
    this.getPayments(this.filterModel);
  }

  getPayments(filterModel: RefundFilterModel) {
    this.paymentService
      .getAppointmentRefunds(filterModel)
      .subscribe((response: any) => {
        if (response != null && response.statusCode == 302) {
          this.metaData = response.meta;
          this.payments = response.data;
        } else {
          this.payments = [];
          this.metaData = new Metadata();
        }
        this.metaData.pageSizeOptions = [5,10,25,50,100];
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
    appDate: any
  ) {
    this.filterModel.pageNumber = pageNumber;
    this.filterModel.pageSize = pageSize;
    this.filterModel.sortOrder = sortOrder;
    this.filterModel.sortColumn = sortColumn;
    this.filterModel.PatientName = name;
    this.filterModel.RefundDate =
      payDate != null && payDate != ""
        ? this.datePipe.transform(new Date(payDate), "MM/dd/yyyy")
        : "";
    this.filterModel.AppDate =
      appDate != null && appDate != ""
        ? this.datePipe.transform(new Date(appDate), "MM/dd/yyyy")
        : "";
  }
}
