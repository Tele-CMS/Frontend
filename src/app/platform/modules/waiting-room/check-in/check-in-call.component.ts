import { DatePipe } from '@angular/common';
import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { NotifierService } from 'angular-notifier';
import { format } from 'date-fns';
import { forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { DocViewerComponent } from 'src/app/shared/doc-viewer/doc-viewer.component';
import { QuestionnaireAnswerModel, SaveQuestionAsnwerRequestModel } from 'src/app/shared/dynamic-form/dynamic-form-models';
import { DialogService } from 'src/app/shared/layout/dialog/dialog.service';
import { VideoConsultationTestModalComponent } from 'src/app/shared/video-consultation-test-modal/video-consultation-test-modal.component';
import { ResponseModel } from 'src/app/super-admin-portal/core/modals/common-model';
import { QuestionnareTypeModel } from '../../agency-portal/providerquestionnaire/providerquestionnaire.model';
import { FileViewModel, UserDocumentModel } from '../../agency-portal/users/users.model';
import { UsersService } from '../../agency-portal/users/users.service';
import { PatientAppointmentListModel } from '../../client-portal/client-profile.model';
import { LoginUser } from '../../core/modals/loginUser.modal';
import { CommonService } from "../../core/services";
import { WaitingRoomService } from '../waiting-room.service';


@Component({
    selector: 'app-check-in-call',
    templateUrl: './check-in-call.component.html',
    styleUrls: ['./check-in-call.component.scss']
})
export class CheckInCallComponent implements OnInit, OnDestroy {

    appointmentId: number;
    patientAppointment: PatientAppointmentListModel;
    isShowTimer = false;
    isEnded: boolean;
    isStarted: boolean;
    isPatient = false;
    todayDate = new Date();
    fromDate: string;
    toDate: string;
    documentList: Array<UserDocumentModel> = [];
    userId:number;
    staffid:number;
    constructor(private waitingRoomService: WaitingRoomService,
        private notifier: NotifierService,
        private commonService: CommonService,
        private route: ActivatedRoute,
        private dailog: MatDialog,
        private userService: UsersService,
        private router:Router) {

            this.commonService.loginUser.subscribe(

                (user: LoginUser) => {
                    if (user.data) {

                        const userRoleName = user.data.users3 && user.data.users3.userRoles.userType;
                        if ((userRoleName || "").toUpperCase() === "CLIENT") {
                           this.isPatient = true;
                        }

                    }
                }
            );
    }

    ngOnInit(): void {
      const apptIdEncry = this.route.snapshot.paramMap.get('id'); 
      const apptId = this.commonService.encryptValue(apptIdEncry,false);
        this.appointmentId = Number(apptId);

        const isCalled = localStorage.getItem('called_'+this.appointmentId);
        if(isCalled == 'true'){
            this.call();
        } else
        this.getAppointmentDetails(this.appointmentId);
        //this.getUserDocuments();
    }


    getAppointmentDetails(id) {
        return this.waitingRoomService.getAppointmentDetails(id).subscribe(res => {
            if(res.data){
                this.patientAppointment = res.data;
                this.getUserDocuments();
                if(new Date(this.patientAppointment.endDateTime) < new Date()){
                    this.isEnded = true;
                } else if(new Date(this.patientAppointment.startDateTime) < new Date()){
                    this.isStarted = true;
                }
                else {
                    this.isShowTimer =true;
                }
            }
        })
    }

    call(){
        localStorage.setItem('called_'+this.appointmentId, 'true');
        if(this.isPatient == true){
            this.router.navigate(['/web/waiting-room/check-in-video-call/'+ this.commonService.encryptValue(this.appointmentId,true)]);
        } else {
             this.router.navigate(['/web/waiting-room/check-in-soap/'+  this.commonService.encryptValue(this.appointmentId,true)]);
            // this.router.navigate(["web/waiting-room/check-in-soap/"], {
            //   queryParams: { 
            //     id: this.commonService.encryptValue(this.appointmentId,true),
            //   },
            // });
             
        }
    }





    onAudioVideoTest() {
        const modalPopup = this.dailog.open(
            VideoConsultationTestModalComponent,
          {
            hasBackdrop: true,

            width:"55%"
          }
        );

        // modalPopup.afterClosed().subscribe((result) => {
        //   // if (result === "SAVE") this.fetchEvents();
        // });
      }


    ngOnDestroy(): void {


    }

    getUserDocuments() {
        //this.userId=6
        this.staffid=this.patientAppointment.appointmentStaffs[0].staffId;
      if (this.staffid != null) {
        //this.fromDate = this.fromDate == null ? '1990-01-01' : format(this.fromDate, "YYYY-MM-DD");
        //this.toDate = this.toDate == null ? format(this.todayDate, "YYYY-MM-DD") : format(this.toDate, "YYYY-MM-DD");
        this.userService.getprovidereductaionalDocumentsForPatientCheckin(this.staffid).subscribe((response: ResponseModel) => {
          if (response != null) {
            this.documentList = (response.data != null && response.data.length > 0) ? response.data : [];
            // if(response.statusCode== 404){
            //   this.notifier.notify('error', "No Records Found")
            // }
          }
        }
        );
      }
    }


    onOpenDocViewer(doc) {

        const modalPopup = this.dailog.open(
            DocViewerComponent,
          {
            hasBackdrop: true,
            width:"62%",
            data: doc
          }
        );

        // modalPopup.afterClosed().subscribe((result) => {
        //   // if (result === "SAVE") this.fetchEvents();
        // });
      }

      getUserDocument(value: UserDocumentModel) {
        this.userService.getUserDocument(value.id).subscribe((response: any) => {
          this.userService.downloadFile(response, response.type, value.url);
        }
        );
      }


      openFileViewer(value: UserDocumentModel) {
        this.userService.getUserDocument(value.id).subscribe((response: any) => {

          //  this.userService.downloadFile(response, response.type, value.url);
          const model:FileViewModel = {blob:response,filetype:value.extenstion,fileUrl:value.url}

          const modalPopup = this.dailog.open(
            DocViewerComponent,
          {
            hasBackdrop: true,
            width:"62%",
            data: model
          }
        );
        }
        );
      }
}
