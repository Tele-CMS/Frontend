import { AppointmentGraphService } from "./../appointment-graph.service";
import {
  FilterModel,
  Metadata
} from "./../../../super-admin-portal/core/modals/common-model";
import { Component, OnInit } from "@angular/core";
import { format } from "date-fns";
import { CommonService } from "src/app/platform/modules/core/services";
import { ResponseModel } from "src/app/platform/modules/core/modals/common-model";
@Component({
  selector: "app-invited-accepted",
  templateUrl: "./invited-accepted.component.html",
  styleUrls: ["./invited-accepted.component.css"]
})
export class InvitedAcceptedComponent implements OnInit {
  invitedAcceptedDisplayedColumns: Array<any>;
  invitedAcceptedActionButtons: Array<any>;
  invitedAcceptedAptfilterModel: FilterModel;
  invitedAcceptedAppointmentMeta: Metadata;
  invitedAcceptedPatientAppointment: Array<any> = [];
  constructor(
    private appointmentGraphService: AppointmentGraphService,
    private commonService: CommonService
  ) {
    this.invitedAcceptedAppointmentMeta = null;
    this.invitedAcceptedAptfilterModel = new FilterModel();
  }

  ngOnInit() {
    this.invitedAcceptedDisplayedColumns = [
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
      }
    ];

    this.invitedAcceptedActionButtons = [];
    this.getAcceptedInvitedPatientAppointmentList();
  }
  getAcceptedInvitedPatientAppointmentList() {
    this.appointmentGraphService
      .getAcceptedInvitedPatientAppointment(this.invitedAcceptedAptfilterModel)
      .subscribe((response: ResponseModel) => {
        if (response != null && response.statusCode == 200) {
          this.invitedAcceptedPatientAppointment =
            response.data != null && response.data.length > 0
              ? response.data
              : [];
          this.invitedAcceptedPatientAppointment = (this
            .invitedAcceptedPatientAppointment || []
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
          this.invitedAcceptedAppointmentMeta = response.meta;
        } else {
          this.invitedAcceptedPatientAppointment = [];
          this.invitedAcceptedAppointmentMeta = null;
        }
      });
  }
}
