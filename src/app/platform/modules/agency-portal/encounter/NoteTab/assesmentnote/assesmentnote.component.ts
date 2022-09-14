import { Component, Input, OnInit } from '@angular/core';
import { NotifierService } from 'angular-notifier';
import { forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { WaitingRoomService } from 'src/app/platform/modules/waiting-room/waiting-room.service';
import { QuestionnareTypeModel } from '../../../providerquestionnaire/providerquestionnaire.model';

@Component({
  selector: 'app-assesmentnote',
  templateUrl: './assesmentnote.component.html',
  styleUrls: ['./assesmentnote.component.css']
})
export class AssesmentnoteComponent implements OnInit {
  controls: any;
  @Input('appointmentId') appointmentId;
    reportId: any;
    showReport: boolean;
  constructor(private waitingRoomService: WaitingRoomService, private notifier: NotifierService,) { }

  ngOnInit() {

    this.loadData();
  }

  loadData() {

    const questionnaireTypesReq = this.getMasterQuestionnaireTypes();
    const getAppointmentDetails = this.getAppointmentDetails(this.appointmentId);

    forkJoin([questionnaireTypesReq, getAppointmentDetails]).subscribe(resArray => {
        const types: QuestionnareTypeModel[] = resArray[0];
        const waitingRoomType = types.find(x => x.value == 'Waiting Room');
        const appointmentDetails = resArray[1];

        if (waitingRoomType && appointmentDetails) {
            const staffId = appointmentDetails.appointmentStaffs[0].staffId;
            this.getQestions(waitingRoomType.id, staffId );
        }
    })
}
getAppointmentDetails(id) {

    return this.waitingRoomService.getAppointmentDetails(id).pipe(
        map(res => {
            this.reportId = res.data.reportId;
            if (this.reportId > 0) {
                this.showReport = true;
            }

            return res.data
        })
    );
}

getMasterQuestionnaireTypes() {
    return this.waitingRoomService.getMasterData("MASTERQUESTIONNAIRETYPES").pipe(
        map(res => res.masterQuestionnaireTypes)
    );
}

  getQestions(type: number, staffId) {

    this.waitingRoomService.getProvidersQuestionnaireControlsByType(type, staffId, this.appointmentId).subscribe(res => {

        if (res.data && res.data.length > 0) {
            this.controls = res.data.map(m => {
                m.control.questionId = m.questionId;
                return m.control;
            });
        } else {
            this.notifier.notify("success", "No questionnaire added")
        }

    })
}
}
