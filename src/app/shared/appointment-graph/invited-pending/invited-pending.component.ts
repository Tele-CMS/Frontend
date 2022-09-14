import { Router, NavigationEnd } from "@angular/router";
import { AppointmentGraphService } from "./../appointment-graph.service";
import {
  FilterModel,
  Metadata
} from "./../../../super-admin-portal/core/modals/common-model";
import { Component, OnInit, OnDestroy } from "@angular/core";
import { format } from "date-fns";
import { CommonService } from "src/app/platform/modules/core/services";
import { ResponseModel } from "src/app/platform/modules/core/modals/common-model";

@Component({
  selector: "app-invited-pending",
  templateUrl: "./invited-pending.component.html",
  styleUrls: ["./invited-pending.component.css"]
})
export class InvitedPendingComponent implements OnInit, OnDestroy {
  invitedDisplayedColumns: Array<any>;
  invitedActionButtons: Array<any>;
  invitedAptfilterModel: FilterModel;
  invitedAppointmentMeta: Metadata;
  invitedPatientAppointment: Array<any> = [];

  mySubscription: any;
  constructor(
    private appointmentGraphService: AppointmentGraphService,
    private commonService: CommonService,
    private router: Router
  ) {
    this.invitedAppointmentMeta = null;
    this.invitedAptfilterModel = new FilterModel();

    this.router.routeReuseStrategy.shouldReuseRoute = function() {
      return false;
    };
    this.mySubscription = this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        // Trick the Router into believing it's last link wasn't previously loaded
        this.router.navigated = false;
      }
    });
  }

  ngOnInit() {
    this.invitedDisplayedColumns = [
      {
        displayName: "Provider",
        key: "staffName",
        width: "110px",
        sticky: true
      },
      {
        displayName: "Patient Name",
        key: "fullName",
        width: "120px",
        type: "link",
        url: "/web/client/profile",
        queryParamsColumn: "queryParamsPatientObj",
        sticky: true
      },
      {
        displayName: "Appt Type",
        key: "appointmentType",
        width: "130px"
      },
      {
        displayName: "Date Time",
        key: "dateTimeOfService",
        width: "250px",
        type: "link",
        url: "/web/client/scheduling",
        queryParamsColumn: "queryParamsObj"
      },
      {
        displayName: "Symptom/Ailment",
        key: "notes",
        width: "250px",
        type: "50",
        isInfo: true
      },
      { displayName: "Actions", key: "Actions", width: "80px", sticky: true }
    ];

    this.invitedActionButtons = [
      { displayName: "Approve", key: "approve", class: "fa fa-check" },
      { displayName: "Cancel", key: "cancel", class: "fa fa-ban" }
    ];
    this.getPendingInvitedPatientAppointmentList();
  }
  ngOnDestroy() {
    if (this.mySubscription) {
      this.mySubscription.unsubscribe();
    }
  }
  getPendingInvitedPatientAppointmentList() {
    this.appointmentGraphService
      .getPendingInvitedPatientAppointment(this.invitedAptfilterModel)
      .subscribe((response: ResponseModel) => {
        if (response != null && response.statusCode == 200) {
          this.invitedPatientAppointment =
            response.data != null && response.data.length > 0
              ? response.data
              : [];
          this.invitedPatientAppointment = (this.invitedPatientAppointment || []
          ).map(x => {
            const staffsArray = (x.pendingAppointmentStaffs || []).map(
              y => y.staffName
            );
            const staffIds = (x.pendingAppointmentStaffs || []).map(
              y => y.staffId
            );
            x.staffName = staffsArray.join(", ");
            x.dateTimeOfService =
              format(x.startDateTime, "MM/DD/YYYY") +
              " (" +
              format(x.startDateTime, "h:mm A") +
              " - " +
              format(x.endDateTime, "h:mm A") +
              ")";
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
            return x;
          });
          this.invitedAppointmentMeta = response.meta;
        } else {
          this.invitedPatientAppointment = [];
          this.invitedAppointmentMeta = null;
        }
      });
  }
}
