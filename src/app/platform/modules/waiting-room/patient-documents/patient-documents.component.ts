import { DatePipe } from '@angular/common';
import { Component, OnInit, Inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NotifierService } from 'angular-notifier';
import { forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { QuestionnaireAnswerModel, SaveQuestionAsnwerRequestModel } from 'src/app/shared/dynamic-form/dynamic-form-models';
import { DialogService } from 'src/app/shared/layout/dialog/dialog.service';
import { ResponseModel } from 'src/app/super-admin-portal/core/modals/common-model';
import { QuestionnareTypeModel } from '../../agency-portal/providerquestionnaire/providerquestionnaire.model';
import { UserDocumentModel } from '../../agency-portal/users/users.model';
import { LoginUser } from '../../core/modals/loginUser.modal';
import { CommonService } from "../../core/services";
import { WaitingRoomService } from '../waiting-room.service';


@Component({
    selector: 'app-patient-documents',
    templateUrl: './patient-documents.component.html',
    styleUrls: ['./patient-documents.component.scss']
})
export class PatientDocumentsComponent implements OnInit {

    appointmentId: number;
    clientId: number;
    controls: any
    documentList: Array<UserDocumentModel>;
    fileList: any = [];
    isPatient = false;
    isProvider= false;
    constructor(private waitingRoomService: WaitingRoomService,
        private notifier: NotifierService,
        private commonService: CommonService,
        private route: ActivatedRoute, 
        private dialogService: DialogService,) { 
          this.commonService.loginUser.subscribe(
            (user: LoginUser) => {
                if (user.data) {
                    const userRoleName = user.data.users3 && user.data.users3.userRoles.userType;
                    if ((userRoleName || "").toUpperCase() === "CLIENT") {
                      console.log("user ",user.data);
                       
                        this.isPatient = true;
                        this.clientId = user.data.userID;
                    }
                    else {
                        this.isProvider = true;
                        this.clientId = 0;
                    }
                }
            }
        );
            
    }
    ngOnInit(): void { 
      const apptIdEncry = this.route.snapshot.paramMap.get('id'); 
      const apptId = this.commonService.encryptValue(apptIdEncry,false);
        this.appointmentId = Number(apptId);
        this.commonService.loadingStateSubject.next(true);
        this.getUserDocuments(this.appointmentId);
    }


    getUserDocuments(appyId) {
      this.commonService.loadingStateSubject.next(true);
             this.waitingRoomService
               .getPateintApptDocuments(appyId)
               .subscribe((response: ResponseModel) => {
                this.commonService.loadingStateSubject.next(false);
                
                 if (response != null) {
                   this.documentList = response.data != null && response.data.length > 0
                   ? response.data
                   : [];
                   
                 }
               });
         
         }


    getUserDocument(value: UserDocumentModel) {
        this.waitingRoomService.getUserDocument(value.id).subscribe((response: any) => {
          this.waitingRoomService.downloadFile(response, response.type, value.url);
        });
      }
    
      deleteUserDocument(id: number) {
        this.dialogService
          .confirm("Are you sure you want to delete this document?")
          .subscribe((result: any) => {
            if (result == true) {
              this.waitingRoomService
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
    
      
  uploadFile(e) {

    let fileExtension = e.target.files[0].name.split('.').pop().toLowerCase();
    var input = e.target;
    var reader = new FileReader();
    reader.onload = () => {
     const dataURL = reader.result;
      this.fileList.push({
        data: dataURL,
        ext: fileExtension,
        fileName: e.target.files[0].name
      });

      this.saveDocuments(this.appointmentId);
    };

   
    reader.readAsDataURL(input.files[0]);
    // }
    // else
    //   this.notifier.notify('error', "Please select valid file type");
  }
//   removeFile(index: number) {
//     this.fileList.splice(index, 1);
//   }

  saveDocuments(apptId:number) {
    ///Please chnage this API to avoid loops

      if (this.fileList.length > 0) {
        this.commonService.loadingStateSubject.next(true);
        let formValues = {
          base64: this.fileList,
          documentTitle: "Document",
          documentTypeId: 17,
          expiration: "",
          key: "PATIENT",
          otherDocumentType: "",
          userId: this.clientId,
          patientAppointmentId: apptId
        }
        console.log("formdata ",formValues);
        
        let dic = [];
        formValues.base64.forEach((element, index) => {
          dic.push(`"${element.data.replace(/^data:([a-z]+\/[a-z0-9-+.]+(;[a-z-]+=[a-z0-9-]+)?)?(;base64)?,/, '')}": "${element.ext}"`);
        });
        let newObj = dic.reduce((acc, cur, index) => {
          acc[index] = cur;
          return acc;
        }, {})
        formValues.base64 = newObj;
        this.waitingRoomService.uploadUserDocuments(formValues).subscribe((response: ResponseModel) => {
         
          if (response != null && response.statusCode == 200) {
           
            this.getUserDocuments(this.appointmentId);
            //this.notifier.notify('success', response.message);
            //this.closeDialog("save");
          }
          else this.notifier.notify('error', response.message);
        });
        this.fileList = [];
      }
      else {
        //this.notifier.notify('error', "Please add atleast one file");
      }
     
    }

}
