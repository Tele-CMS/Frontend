import { DatePipe } from '@angular/common';
import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { NotifierService } from 'angular-notifier';
import { forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { QuestionnaireAnswerModel, SaveQuestionAsnwerRequestModel } from 'src/app/shared/dynamic-form/dynamic-form-models';
import { QuestionnareTypeModel } from '../../agency-portal/providerquestionnaire/providerquestionnaire.model';
import { LoginUser } from '../../core/modals/loginUser.modal';
import { CommonService } from "../../core/services";
import { WaitingRoomService } from '../waiting-room.service';
import { ViewReportComponent } from './../../../../shared/view-report/view-report.component'


@Component({
    selector: 'app-assessment-appointment',
    templateUrl: './assessment-appointment.component.html',
    styleUrls: ['./assessment-appointment.component.scss']
})
export class AssessmentAppointmentComponent implements OnInit {

    appointmentId: number;
    controls: any
    isFormDisabled = true;
    showReport: boolean = false;
    isClient: boolean = false;
    reportId: any;
    constructor(private waitingRoomService: WaitingRoomService,
        private notifier: NotifierService,
        private commonService: CommonService,
        private dialogModal: MatDialog,
        private router: Router,
        private route: ActivatedRoute) {

        this.commonService.loginUser.subscribe(

            (user: LoginUser) => {
                if (user.data) {
                    const userRoleName = user.data.users3 && user.data.users3.userRoles.userType;
                    if ((userRoleName || "").toUpperCase() === "CLIENT") {
                        this.isClient = true; 
                        this.isFormDisabled = false;
                    }
                    else {
                        this.isClient = false; 
                        this.isFormDisabled = true;
                    }
                }
            }
        );

    }
    ngOnInit(): void {
        const apptIdEncry = this.route.snapshot.paramMap.get('id'); 
        const apptId = this.commonService.encryptValue(apptIdEncry,false);
        this.appointmentId = Number(apptId);
        this.loadData();
    }

    loadData() {
        this.commonService.loadingStateSubject.next(true);
        const questionnaireTypesReq = this.getMasterQuestionnaireTypes();
        const getAppointmentDetails = this.getAppointmentDetails(this.appointmentId);

        forkJoin([questionnaireTypesReq, getAppointmentDetails]).subscribe(resArray => {
            const types: QuestionnareTypeModel[] = resArray[0];
            const waitingRoomType = types.find(x => x.value == 'Waiting Room');
            const appointmentDetails = resArray[1];

            if (waitingRoomType && appointmentDetails) {
                const staffId = appointmentDetails.appointmentStaffs[0].staffId;
                this.getQestions(waitingRoomType.id, staffId, this.appointmentId);
            }
        })
    }

    getMasterQuestionnaireTypes() {
        return this.waitingRoomService.getMasterData("MASTERQUESTIONNAIRETYPES").pipe(
            map(res => res.masterQuestionnaireTypes)
        );
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

    getQestions(type: number, staffId, appointmentId) {

        this.waitingRoomService.getProvidersQuestionnaireControlsByType(type, staffId, appointmentId).subscribe(res => {

            if (res.data && res.data.length > 0) {
                this.controls = res.data.map(m => {
                    m.control.questionId = m.questionId;
                    return m.control;
                });
            } else {
                this.notifier.notify("success", "No questionnaire added")
            }

            this.commonService.loadingStateSubject.next(false);
        })
    }

    onSubmitData(_answers: QuestionnaireAnswerModel[]) {
        this.commonService.loadingStateSubject.next(true);
        const postDataModel: SaveQuestionAsnwerRequestModel = {
            patientAppointmentId: this.appointmentId,
            answers: _answers
        };

        this.waitingRoomService.saveAnswers(postDataModel).subscribe(res => {
            if (res.data) {
                this.notifier.notify("success", "Answers saved successfully")
            }
            this.commonService.loadingStateSubject.next(false);
        })
    }
    showInfermedicaReport() {
        const modalPopup = this.dialogModal.open(
            ViewReportComponent,
            {
                hasBackdrop: true,
                data: this.reportId,
            }
        );

        modalPopup.afterClosed().subscribe((result) => {

        });
    }
    backto(){
        if(this.isClient){
            this.router.navigate(["/web/client/dashboard"]);
        }else{
            this.router.navigate(["/web/dashboard"]);
        }
    }
}
