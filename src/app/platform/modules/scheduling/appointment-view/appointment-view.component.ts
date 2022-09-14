import { DatePipe } from '@angular/common';
import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { NotifierService } from 'angular-notifier';
import { AppService } from 'src/app/app-service.service';
import { DialogService } from 'src/app/shared/layout/dialog/dialog.service';
import { ChatInitModel } from 'src/app/shared/models/chatModel';
import { TextChatService } from 'src/app/shared/text-chat/text-chat.service';
import { ResponseModel } from 'src/app/super-admin-portal/core/modals/common-model';
import { ClientsService } from '../../agency-portal/clients/clients.service';
import { UserDocumentModel } from '../../agency-portal/users/users.model';
import { CommonService } from "../../core/services";
import { AppointmentModel } from '../scheduler/scheduler.model';
import { SchedulerService } from '../scheduler/scheduler.service';
import {ViewReportComponent} from './../../../../shared/view-report/view-report.component'

@Component({
  selector: 'app-appointment-view',
  templateUrl: './appointment-view.component.html',
  styleUrls: ['./appointment-view.component.css']
})
export class AppointmentViewComponent implements OnInit {

  appointment: AppointmentModel;
  appointmentId: number;
  reportId:any;
  appointmentForm: FormGroup;
  showReport:boolean=false;
  otherAppointments: AppointmentModel[] = [];
  otherAppointmentsPersistence: AppointmentModel[] = [];
  currentLoginUserId: any;
  isAdminLogin = false;
  isProviderLogin = false;
  selectedAppointments: number[];
  loading = false;
  isFirstLoad = true;
  isLoadingOtherAppointments = true;
  statusColors: Array<any>;
  documentList: Array<UserDocumentModel>;
  isLoadingDocuments= true
  isPatientScheduler: boolean = false;
  isDisplay: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private schedulerService: SchedulerService,
    public dialogPopup: MatDialogRef<AppointmentViewComponent>,
    private commonService: CommonService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogModal: MatDialog,
    private date: DatePipe,
    private clientService: ClientsService,
    private dialogService: DialogService,
    private notifier: NotifierService,
    private router: Router,
    private textChatService: TextChatService,
    private appService: AppService,
    private activatedRoute:ActivatedRoute

  ) {
    
     
    this.appointmentId = data;

    this.statusColors = [
      { name: "pending", color: "#74d9ff" },
      { name: "approved", color: "#93ee93" },
      { name: "cancelled", color: "#ff8484" },
      { name: "Accepted", color: "rgb(179, 236, 203)" },
      { name: "Tentative", color: "rgb(253, 209, 100)" },
    ];
  }

  ngOnInit() { 
    this.initializeFormFields(this.appointment);

    // this.commonService.loadingState.subscribe(
    //   (isloading: boolean) => {
    //     this.loading = isloading;
    //   }
    // );


    this.commonService.currentLoginUserInfo.subscribe(
      (user: any) => { 
        if (user) {
          this.currentLoginUserId = user.id;
          this.isAdminLogin =
            user.users3 &&
            user.users3.userRoles &&
            (user.users3.userRoles.userType || "").toUpperCase() == "ADMIN";

          this.isProviderLogin = user.users3 &&
            user.users3.userRoles &&
            (user.users3.userRoles.userType || "").toUpperCase() == "PROVIDER";
          this.selectedAppointments = [this.appointmentId];
          this.getAppointment(this.appointmentId);

        }
      }
    );


  }

  onNoClick(): void {
    this.dialogPopup.close();
  }


  initializeFormFields(appointment?: AppointmentModel) {
    appointment = appointment || new AppointmentModel();

    const configControls = {
      'patientName': [appointment.patientName],
      'dob': [appointment.patientInfoDetails == null || appointment.patientInfoDetails.patientInfo == null || appointment.patientInfoDetails.patientInfo.length == 0 || !appointment.patientInfoDetails.patientInfo[0].dob ? undefined : this.toDateTimeString(appointment.patientInfoDetails.patientInfo[0].dob, true)],
      'gender': [appointment.patientInfoDetails == null || appointment.patientInfoDetails.patientInfo == null || appointment.patientInfoDetails.patientInfo.length == 0 ? undefined : appointment.patientInfoDetails.patientInfo[0].gender],
      'email': [appointment.patientInfoDetails == null || appointment.patientInfoDetails.patientInfo == null || appointment.patientInfoDetails.patientInfo.length == 0 ? undefined : appointment.patientInfoDetails.patientInfo[0].email],
      'phone': [appointment.patientInfoDetails == null || appointment.patientInfoDetails.patientInfo == null || appointment.patientInfoDetails.patientInfo.length == 0 ? undefined : appointment.patientInfoDetails.patientInfo[0].phone],
      'patientPhotoThumbnailPath': [appointment.patientPhotoThumbnailPath],
      'startDateTime': [appointment.startDateTime ? this.toDateTimeString(appointment.startDateTime) : undefined],
      'endDateTime': [appointment.endDateTime ? this.toDateTimeString(appointment.endDateTime) : undefined],
      'notes': [appointment.notes],
      'isTelehealthAppointment': [appointment.isTelehealthAppointment],
      'statusName': [appointment.statusName],
      'isClientRequired': [appointment.isClientRequired],
      'mode': [appointment.mode],
      'type': [appointment.type],
      'provider': [appointment.appointmentStaffs == null || appointment.appointmentStaffs.length == 0 ? undefined : appointment.appointmentStaffs[0].staffName],

    }
    this.appointmentForm = this.formBuilder.group(configControls);
    this.appointmentForm.disable();
  }


  get f() {
    return this.appointmentForm.controls;
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
  getAppointment(appointmentId) {
    this.getUserDocuments(appointmentId);
    this.loading = true;
    this.schedulerService
      .getAppointmentDetailsWithPatient(appointmentId)
      .subscribe((response: any) => {
        if (response.statusCode === 200) {

          this.appointment = response.data;
          if(response.data.reportId>0 )
          {
            this.showReport=true;
            this.reportId=response.data.reportId;
          }
          this.initializeFormFields(this.appointment);
          this.loading = false;
          if (this.isFirstLoad) {
            this.getAllAppointments(this.appointment.patientID)
          } else {
            if (this.otherAppointmentsPersistence && this.otherAppointmentsPersistence.length > 1) {
              this.filterOtherAppointments(appointmentId);
            }

          }
        }
      });
  }

  getAllAppointments(patientId) {
    const filterModal = {
      locationIds: [101],
      // fromDate: format(getStart(this.viewDate), "YYYY-MM-DD"),
      // toDate: format(getEnd(this.viewDate), "YYYY-MM-DD"),
      staffIds: [this.currentLoginUserId],
      patientIds: [patientId],
    };
    this.schedulerService.getListData(filterModal).subscribe(response => {
      this.isLoadingOtherAppointments = true;
      if (response.statusCode === 200) {
        this.isLoadingOtherAppointments = false;
        this.otherAppointments = response.data;
        this.otherAppointmentsPersistence = response.data;
        if (this.otherAppointments && this.otherAppointments.length > 0) {
          this.filterOtherAppointments(this.appointmentId);
        }
      }
    });
  }

  filterOtherAppointments(currentAppointmentId) {
    this.otherAppointments = [...this.otherAppointmentsPersistence.filter(x => x.patientAppointmentId != currentAppointmentId)];
  }

  onClose() {
    this.dialogModal.closeAll();
  }

  onOtherAppointmentClick(appointmentId) {
    this.selectedAppointments.push(appointmentId);
    this.appointmentId = appointmentId;
    this.filterOtherAppointments(appointmentId);
    this.getAppointment(appointmentId);
  }

  toDateTimeString(date, onlyDate = false) {
    return this.date.transform(new Date(date), onlyDate ? 'MM/dd/yyyy' : 'MM/dd/yyyy HH:mm a')
  }

  slotDateTime(date) {
    return this.date.transform(new Date(date), 'MM/dd HH:mm a')
  }

  onBack() {
    this.selectedAppointments.pop();
    const previousAppointmentId = this.selectedAppointments[this.selectedAppointments.length - 1];
    this.appointmentId = previousAppointmentId;
    this.getAppointment(previousAppointmentId);
  }

  getBgColor(appointmentStatus): string{
    return this.statusColors.find(x => x.name.toLowerCase() == appointmentStatus.toLowerCase()).color;
  }

  getBgClass(index: number): string {
    return index % 2 == 0 ? 'evenCellColor' : 'oddCellColor';
}


  getUserDocuments(appyId) {
 this.isLoadingDocuments = true;
      this.clientService
        .getPateintApptDocuments(appyId)
        .subscribe((response: ResponseModel) => {

          this.isLoadingDocuments = false;
          if (response != null) {
            this.documentList = response.data != null && response.data.length > 0
            ? response.data
            : [];

          }
        });

  }

  getUserDocument(value: UserDocumentModel) {
    this.clientService.getUserDocument(value.id).subscribe((response: any) => {
      this.clientService.downloadFile(response, response.type, value.url);
    });
  }

  deleteUserDocument(id: number) {
    this.dialogService
      .confirm("Are you sure you want to delete this document?")
      .subscribe((result: any) => {
        if (result == true) {
          this.clientService
            .deleteUserDocument(id)
            .subscribe((response: ResponseModel) => {
              if (response != null) {
                this.notifier.notify("success", response.message);
                this.getUserDocuments(this.appointmentId);
              } else {
                this.notifier.notify("error", response.message);
              }
            });
        }
      });
  }

  videoCall(){ 
    // this.router.navigate(["/web/encounter/video-call"], {
    //   queryParams: {
    //     apptId: this.appointmentId,
    //   },
    // }); 
    // this.router.navigate(["/web/waiting-room/"+this.appointmentId]);
    // this.router.navigate(["web/waiting-room"], {
    //   queryParams: { 
    //     id: this.commonService.encryptValue(this.appointmentId,true),
    //   },
    // });
    if(!this.isProviderLogin){   
      if(this.router.url == "/web/client/my-scheduling" || this.router.url == "/web/client/dashboard"){
         
        this.router.navigate(["web/waiting-room"], {
          queryParams: { 
            id: this.commonService.encryptValue(this.appointmentId,true),
          },
        }); 
      }else{ 
          var encry = this.commonService.encryptValue(this.appointmentId,true)
            this.router.navigateByUrl(`web/waiting-room/reshedule/${encry}`)
           } 
    }else{  
    console.log("here.."); 
    this.commonService.appointmentDataSubject.next(this.appointmentId);
      this.router.navigate(["web/waiting-room"], {
        queryParams: { 
          id: this.commonService.encryptValue(this.appointmentId,true),
        },
      }); 
    } 
     
   
    this.dialogModal.closeAll();
  }

  chat(){
    this.commonService.loginUser.subscribe((response: any) => { 
      if (response.access_token) { 
        var chatInitModel = new ChatInitModel();
        chatInitModel.isActive = true;
        chatInitModel.AppointmentId = this.appointmentId;
        chatInitModel.UserId = response.data.userID;
        
        if(this.isProviderLogin){
          chatInitModel.UserRole = response.data.users1.userRoles.userType;
        }else{
          chatInitModel.UserRole = response.data.users3.userRoles.userType;
        }
       
        this.appService.CheckChatActivated(chatInitModel);
        // this.getAppointmentInfo(
        //   chatInitModel.AppointmentId,
        //   chatInitModel.UserRole
        // );
        this.textChatService.setAppointmentDetail(
          chatInitModel.AppointmentId,
          chatInitModel.UserRole
        );
        this.textChatService.setRoomDetail(
          chatInitModel.UserId,
          chatInitModel.AppointmentId
        );
        this.dialogModal.closeAll();
      }
    });
  }
}
