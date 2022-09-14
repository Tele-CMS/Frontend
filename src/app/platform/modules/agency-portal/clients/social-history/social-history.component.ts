import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { SocialHistoryModel } from '../client.model';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NotifierService } from 'angular-notifier';
import { ActivatedRoute } from '@angular/router';
import { CommonService, LayoutService } from '../../../core/services';
import { ClientsService } from '../clients.service';

@Component({
  selector: 'app-social-history',
  templateUrl: './social-history.component.html',
  styleUrls: ['./social-history.component.css']
})
export class SocialHistoryComponent implements OnInit {
  @Output() handleTabChange: EventEmitter<any> = new EventEmitter<any>();
  masterSocialHistory: Array<any>;
  socialHistory:SocialHistoryModel;
  socialForm: FormGroup;
  submitted: boolean = false;
  clientId:number;
  linkedEncounterId: number;
  header:string="Social History";
  constructor(private activatedRoute: ActivatedRoute,private formBuilder: FormBuilder,
    private clientService: ClientsService,private notifier: NotifierService,
    private commonService:CommonService, private layoutService: LayoutService) {
    this.masterSocialHistory = [];
    this.socialHistory = new SocialHistoryModel();
  }

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe(params => {
      this.clientId = params.id==undefined?null:this.commonService.encryptValue(params.id,false);
    });

    this.clientService.getMasterData('SOCIALHISTORY').subscribe((response:any)=>{
      this.masterSocialHistory = response.masterSocialHistory;
    })
    this.clientService.getPatientSocialHistory(this.clientId).subscribe((response:any)=>{
      this.socialHistory=response.data;
      this.socialForm.patchValue({
        ...response.data,
      })
    })

    this.layoutService.clientDrawerData.subscribe(({ encounterId }) => {
      this.linkedEncounterId = encounterId;
    });

    this.socialForm = this.formBuilder.group({
      alcohalID:[this.socialHistory.alcohalID,Validators.required],
      drugID:[this.socialHistory.drugID,Validators.required],
      occupation:[this.socialHistory.occupation,Validators.required],
      tobaccoID:[this.socialHistory.tobaccoID,Validators.required],
      travelID:[this.socialHistory.travelID,Validators.required]
    });
  }

  get formControls() { return this.socialForm.controls; }

  onSubmit(event: any) {
      if (!this.socialForm.invalid) {


        this.submitted = true;

        //assign form values
        let formValues = this.socialForm.value;

        //assign values
        formValues.patientID = this.clientId;
        formValues.id = this.socialHistory.id==null ? 0 : this.socialHistory.id;

        //assign form values to socialhistory model
        this.socialHistory = formValues;

        //validation check
        if(this.socialHistory.alcohalID==null ||this.socialHistory.drugID==null || this.socialHistory.occupation==null || this.socialHistory.tobaccoID==null || this.socialHistory.travelID==null)
        {
          this.notifier.notify('warning', "Please select all option");
        }
        else if(this.socialHistory.patientID==null ||this.socialHistory.id==null)
        {
          this.notifier.notify('warning', "Something went wrong try after some time!");
        }
        else
        {
          this.socialHistory.linkedEncounterId = this.linkedEncounterId;
          this.clientService.createSocialHistory(this.socialHistory).subscribe((response: any) => {
            this.submitted = false;
            if (response.statusCode == 200) {
              this.notifier.notify('success', response.message);
            } else {
              this.notifier.notify('error', response.message);
            }
          });
        }
      }
  }
}

