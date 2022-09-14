
import { Component, Inject, Input, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Router } from '@angular/router';
import * as format from 'date-fns/format';
import { Metadata, ResponseModel } from 'src/app/platform/modules/core/modals/common-model';
import { CommonService } from 'src/app/platform/modules/core/services/common.service';

import { AppointmentGraphService } from '../appointment-graph/appointment-graph.service';
//import { Metadata } from '../client-profile.model';

@Component({
  selector: 'appurgentcarelistingdialog',
  templateUrl: './urgentcarelisting-dialog.component.html',
  styleUrls: ['./urgentcarelisting-dialog.component.css']
})
export class UrgentCareListingdialogComponent implements OnInit {
  upcomingAptfilterModel: any;
  allAppointmentsMeta: Metadata;
  headerText: string = "UrgentCare Appointments";
  allAppointmentsList: Array<any> = [];
  allAppointmentsDisplayedColumns = [
    {
        displayName: "Provider",
        key: "staffName",
        class: "",
        width: "150px",
        sticky: true
      },
      {
        displayName: "Patient",
        key: "fullName",
        class: "",
        width: "150px",
        type: "link",
        //url: "/web/member/profile",
        queryParamsColumn: "queryParamsPatientObj",
        sticky: true
      },
    //   {
    //     displayName: "Appt. Type",
    //     key: "appointmentType",
    //     width: "130px"
    //   },
    //   {
    //     displayName: "Appt. Mode",
    //     key: "appointmentMode",
    //     width: "130px"
    //   },
      {
        displayName: "Date Time",
        key: "dateTimeOfService",
        width: "300px",
        type: "link",
        //url: "/web/member/scheduling",
        queryParamsColumn: "queryParamsObj"
      },
      {
        displayName: "Symptom/Ailment",
        key: "notes",
        width: "210px",
        type: "50",
        isInfo: true
      },
    //   {
    //     displayName: "Rating",
    //     key: "rating",
    //     width: "110px",
    //     type: "rating"
    //   },
      // {
      //   displayName: "Review",
      //   key: "review",
      //   width: "150px",
      //   type: "50"
      // },
      // { displayName: "Status", key: "statusName", width: "80px" },
      { displayName: "Actions", key: "Actions", width: "50px" }
    ];

  upcomingAppointmentsActionButtons = [
    {
      displayName: "Select",
      key: "toWaitingRoom",
      class: "fa fa-arrow-right"
    }
  ];
  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private dialogModalRef: MatDialogRef<UrgentCareListingdialogComponent>, private route: Router, private appointmentGraphService: AppointmentGraphService,private commonService: CommonService) {

    this.allAppointmentsList = this.data.popmodel == null ? [] : this.data.popmodel;
    //this.allAppointmentsMeta = this.data.popmeta == null ? [] : this.data.popmeta;
  }
  closeDialog(action: string): void {
    this.dialogModalRef.close(action);
  }
  ngOnInit() {
    this.getAllPatientAppointmentList();
  }
//   onUpcomingTableActionClick(actionObj?: any) {

//     switch ((actionObj.action || '').toUpperCase()) {
//       case 'TOWAITINGROOM':
//         this.closeDialog("close");
//         this.route.navigate([`/web/waiting-room/reshedule/${actionObj.data.patientAppointmentId}/`]);
//         break;


//       default:
//         break;
//     }
//   }

//   onUpcomingAptPageOrSortChange(event: any) {

//   }

//   setUpcomingPaginatorModel(
//     pageNumber: number,
//     pageSize: number,
//     sortColumn: string,
//     sortOrder: string
//   ) {
//     this.upcomingAptfilterModel.pageNumber = pageNumber;
//     this.upcomingAptfilterModel.pageSize = pageSize;
//     this.upcomingAptfilterModel.sortOrder = sortOrder;
//     this.upcomingAptfilterModel.sortColumn = sortColumn;
//   }
getAllPatientAppointmentList(pageNumber: number = 1, pageSize: number = 5) {
    const filters = {
      // locationIds: this.currentLocationId,
      // staffIds: (this.userRoleName || '').toUpperCase() == 'ADMIN' ? "" : this.currentLoginUserId,
      //fromDate: format(new Date(), "YYYY-MM-DD"),
      //toDate: format(addDays(new Date(), 720), "YYYY-MM-DD"),
      // status: 'Approved',
      pageNumber,
      pageSize
    };
    this.appointmentGraphService
      .getUrgentcareAppointmentList(filters)
      .subscribe((response: ResponseModel) => {
        if (response != null && response.statusCode == 200) {

          this.allAppointmentsList =
            response.data != null && response.data.length > 0
              ? response.data
              : [];
          this.allAppointmentsList = (this.allAppointmentsList || []).map(x => {
            const staffsArray = (x.pendingAppointmentStaffs || []).map(
              y => y.staffName
            );
            console.log(this.allAppointmentsList)
            const staffIds = (x.pendingAppointmentStaffs || []).map(
              y => y.staffId
            );
            x.staffName = staffsArray.join(", ");
            (x["queryParamsPatientObj"] = {
              id:
                x.patientID > 0
                  ? this.commonService.encryptValue(x.patientID, true)
                  : null
            }),
              (x["queryParamsObj"] = {
                id:
                  x.patientID > 0
                    ? this.commonService.encryptValue(x.patientID, true)
                    : null,
                staffId: staffIds.join(","),
                date: format(x.startDateTime, "MM/DD/YYYY")
              });
            x.dateTimeOfService =
              format(x.startDateTime, "MM/DD/YYYY") +
              " (" +
              format(x.startDateTime, "h:mm A") +
              " - " +
              format(x.endDateTime, "h:mm A") +
              ")";
            return x;
          });
          this.allAppointmentsMeta = response.meta;
        }
        this.allAppointmentsMeta.pageSizeOptions = [5,10,25,50,100];
      });
  }

  onUpcomingAptPageOrSortChange(changeState?: any) {

    // this.setUpcomingPaginatorModel(
    //   changeState.pageNumber,
    //   changeState.pageSize,
    //   changeState.sort,
    //   changeState.order
    // );
    this.getAllPatientAppointmentList(changeState.pageNumber, changeState.pageSize);
  }
//   setUpcomingPaginatorModel(
//     pageNumber: number,
//     pageSize: number,
//     sortColumn: string,
//     sortOrder: string
//   ) {
//     this.upcomingAptfilterModel.pageNumber = pageNumber;
//     this.upcomingAptfilterModel.pageSize = pageSize;
//     this.upcomingAptfilterModel.sortOrder = sortOrder;
//     this.upcomingAptfilterModel.sortColumn = sortColumn;
//   }

}
