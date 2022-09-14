
import { Component, OnInit, OnDestroy, NgModule,ViewChild, Input, Injector} from '@angular/core';
import {  FormBuilder, FormGroup, Validators} from "@angular/forms";
import { MatDialogRef } from '@angular/material';
import { Router } from '@angular/router';
import { NotifierService } from 'angular-notifier';
import { CommonService } from 'src/app/platform/modules/core/services/common.service';
import { OnboardingApiService } from '../../onboarding-api.service';
import { OnboardingService } from '../../onboarding.service';

@Component({
    selector: 'add-header-modal',
    templateUrl: './add-header-modal.component.html',
    styleUrls: ['./add-header-modal.component.css'],
   // animations: [appModuleAnimation()]
})
export class AddHeaderModalComponent implements OnInit, OnDestroy
{
    @Input() Headerid: number;
    @ViewChild('inputFile') inputFile;

  

    constructor(
        injector: Injector,
        private formBuilder: FormBuilder,
        private _router: Router,
        private _commonService: CommonService,
        private notifier: NotifierService,
        private _onboardingService: OnboardingApiService,
        private dialogModalRef: MatDialogRef<AddHeaderModalComponent>
    ) {
      //  super(injector);
        this.categories = [
        
            {
                id: '9a67dff7-3c38-4052-a335-0cef93438ff6',
                title: 'Web',
                slug: 'web'
            },

            {
                id: 'a89672f5-e00d-4be4-9194-cb9d29f82165',
                title: 'Firebase',
                slug: 'firebase'
            },

            {
                id: '02f42092-bb23-4552-9ddb-cfdcc235d48f',
                title: 'Cloud',
                slug: 'cloud'
            },

            {
                id: '5648a630-979f-4403-8c41-fc9790dea8cd',
                title: 'Android',
                slug: 'android'
            }
        ];
    }
   
    FileType: number;
    HeadingForm: any;
    submitted: boolean=false;
    HeadingDataForm : any;
    IsPreview: boolean = false;
    format: any;
    url: any;
    SelectedFile: any;
    IsDetailVisible: boolean =false;
    imgpath: string='';
    videopath: string='';
    categories: any;
    selectedCategories: any = [];
    IsImage : boolean;
    videourl: string = '';
    headerdata: any = [];

   

    ngOnInit(): void {
            this.HeadingForm = this.formBuilder.group({
                Id: 0,
                Title: ['', Validators.required],
                Duration: [0, Validators.required],
                Description: ['', Validators.required]
            });

            if (this.Headerid > 0) {
                this.GetHeader();
            }

  }

    close(action: any) : void {
        this.dialogModalRef.close(action);
      }
    ngOnDestroy(): void {
       
    }

     localUrl: any[];
    onSelectFile(event) {
        const file = event.target.files && event.target.files[0];
       
        var reader = new FileReader();
      
        if (file) {
           
            reader.readAsDataURL(file);
            if (file.type.indexOf('image') > -1) {
                if (this.FileType==1) this.format = 'image';
            } else if (file.type.indexOf('video') > -1) {
                if (this.FileType == 2) this.format = 'video';
            }
            reader.onload = (event) => {
                this.url = (<FileReader>event.target).result;
            }
        }
    }

    GetHeader() {
       // this.spinnerService.show();
        this._onboardingService.getOnboardingHeaderForEdit(this.Headerid).subscribe((response: any) => {
           // console.log("Data Response ", response.onboardingHeader);
            this.headerdata = response.onboardingHeader;
             this.selectedCategories = this.categories.filter(x => x.slug == this.headerdata.category)[0];
        
            if (this.headerdata.headerImage != null && this.headerdata.headerImage !="") {
                this.FileType = 1;
                this.IsImage = true;
                this.url = this.headerdata.headerImage;
            } else if (this.headerdata.headerVideo != null && this.headerdata.headerVideo != "") {
                this.FileType = 2;
                this.IsImage = false;
                this.videopath = this.headerdata.headerVideo;
            }

            this.HeadingForm = this.formBuilder.group({
                Id: this.Headerid,
                Title: [this.headerdata.header, Validators.compose([Validators.required])],
                Duration: [0],
                Description: [this.headerdata.headerDescription, Validators.compose([Validators.required])]
               
            });
           // this.spinnerService.hide();
        });
    }




    resobj: any;
    onHeadingSubmit() {
        if (this.FileType == 1) {
            this.imgpath = this.url;
        }
        
        this.submitted = true;

        //console.log('HeadingForm', this.HeadingForm);

        if ((this.HeadingForm.value.Title != '' && this.HeadingForm.value.Title != null) && (this.HeadingForm.value.Description != '' && this.HeadingForm.value.Description != null)
            // ) {
             && (this.selectedCategories.title != '' && this.selectedCategories.title != null) ) {

            if (this.Headerid == 0) {
                this.Headerid = null;
            }

            this.resobj = {
                header: this.HeadingForm.value.Title,
                headerDescription: this.HeadingForm.value.Description,
                headerImage: this.imgpath,
                headerVideo: this.videopath,
                activeStatus: true,
                category: this.selectedCategories.slug,
                duration: 0,
                id:this.Headerid,
                isImage: this.FileType 
            };
        //console.log('resobj', this.resobj);
      

          //  this.spinnerService.show();
            this._onboardingService.createOrEdit(this.resobj).subscribe((response: any) => {
                this.close('close');
               // console.log("response ", response)
             //   this.spinnerService.hide();
                if (!this.Headerid) {
                    this.handleOnboardingRedirection(response);
                    // this.notify.success(('Successfully Created'));
                    this.notifier.notify('success',"Successfully Created")
                }
                else {
                    // this.notify.success(('Successfully Updated'));
                    this.notifier.notify('success',"Successfully Updated")
                     window.location.reload();
               }
              
            this.submitted = false;
           
        });
        }
    }

    handleOnboardingRedirection(sectionId: number) {
        var encryptedId = this._commonService.encryptValue(sectionId, true);

        this._router.navigate(['/web/onboarding/section/'], { queryParams: { id: encryptedId } });
    }
    /**
   * Function to handle Field is valid
   */
 isControlValid(controlName: string, HeadingForm: FormGroup): boolean {
    const control = HeadingForm.controls[controlName];
    return control.valid && (control.dirty || control.touched);
  }
  
  /**
  * Function to handle Field is in-valid
  */
  isControlInvalid(controlName: string, HeadingForm: FormGroup): boolean {
    const control = HeadingForm.controls[controlName];
    return control.invalid && (control.dirty || control.touched);
  }
  
  /**
  * Function to handle Field has error
  */
  controlHasError(validation: string, controlName: string, HeadingForm: FormGroup): boolean {
    const control = HeadingForm.controls[controlName];
    return control.hasError(validation) && (control.dirty || control.touched);
  }
  
  /**
  * Function to handle Field errors on touch
  */
  isControlTouched(controlName: string, formGroup: FormGroup): boolean {
    const control = formGroup.controls[controlName];
    return control.dirty || control.touched;
  }
}
