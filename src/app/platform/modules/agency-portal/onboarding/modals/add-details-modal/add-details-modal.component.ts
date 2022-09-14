
import { Component, OnInit, OnDestroy, NgModule,ViewChild, Input, Injector} from '@angular/core';
import {  FormBuilder, FormGroup, Validators } from "@angular/forms";



import Quill from 'quill'
import BlotFormatter from 'quill-blot-formatter/dist/BlotFormatter';
//  import VideoResize from 'quill-video-resize-module';
import { NotifierService } from 'angular-notifier';
import { OnboardingService } from '../../onboarding.service';

import { MatDialogRef } from '@angular/material';
import { OnboardingApiService } from '../../onboarding-api.service';
Quill.register('modules/blotFormatter', BlotFormatter);
// Quill.register('modules/videoResize', VideoResize);


@Component({
    selector: 'add-details-modal',
    templateUrl: './add-details-modal.component.html',
    styleUrls: ['./add-details-modal.component.css'],
  //  animations: [appModuleAnimation()]
})
export class AddDetailsModalComponent implements OnInit, OnDestroy{
    @Input() Headerid: number;
    @Input() Detailid: number;
    @ViewChild('inputFile') inputFile;
    // editor: Editor;
    // toolbar: Toolbar = [
    //     ["bold", "italic"],
    //     ["underline", "strike"],
    //     ["code", "blockquote"],
    //     ["ordered_list", "bullet_list"],
    //     [{ heading: ["h1", "h2", "h3"] }],
    //     ["link", "image"],
    //     ["text_color", "background_color"],
    //     ["align_left", "align_center", "align_right", "align_justify"]
    // ];


    modules = {}
    title = 'Write Text Here....';

    blured = false
    focused = false
   


    OrderId: number;

     

    constructor(
        injector: Injector,
        private formBuilder: FormBuilder,
       // public modal: NgbActiveModal,
        private notifier: NotifierService ,
        private _onboardingService: OnboardingApiService,

        private dialogModalRef: MatDialogRef<AddDetailsModalComponent>  ) {
       
        this.modules = {
            blotFormatter: {
                // empty object for default behaviour.
            },
            // videoResize: {
            //     // See optional "config" below
            // },
            'toolbar': {
                container: [
                    ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
                    ['blockquote', 'code-block'],

                    [{ 'header': 1 }, { 'header': 2 }],               // custom button values
                    [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                    [{ 'script': 'sub' }, { 'script': 'super' }],      // superscript/subscript
                    [{ 'indent': '-1' }, { 'indent': '+1' }],          // outdent/indent
                    [{ 'direction': 'rtl' }],                         // text direction

                    [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
                    [{ 'header': [1, 2, 3, 4, 5, 6, false] }],

                    [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
                    [{ 'font': [] }],
                    [{ 'align': [] }],

                    ['clean'],                                         // remove formatting button

                    ['link', 'image', 'video'],                         // link and image, video
                    ['emoji'],
                ]
            }
        }
    
    

    }
   
    html: any;
    submitted: boolean=false;
    HeadingDataForm : any;
    Detaildata: any;

    ngOnInit(): void {
       
        //console.log('Headerid',this.Headerid);
        //console.log('Detailid', this.Detailid);
      
        this.HeadingDataForm = this.formBuilder.group({
            Title: ['', Validators.required],
            Description: ['', Validators.required]
           
        });
debugger
        if (this.Detailid > 0) {
            this.GetHeaderDetails();
        }
        //this.editor = new Editor();
  }
    close(action: any) : void {
        this.dialogModalRef.close(action);
      }
    ngOnDestroy(): void {
       // this.editor.destroy();
    }

    

    resobj: any;

    GetHeaderDetails() {
        debugger
  //      this.spinnerService.show();
        this._onboardingService.getOnboardingDetailForEdit(this.Detailid).subscribe((response: any) => {
            //console.log("Data Response ", response.onboardingDetail);
            this.Detaildata = response.onboardingDetail;
            //console.log("Headerdetaildata ", this.Detaildata);
            this.OrderId = this.Detaildata.order;  
            this.html = this.Detaildata.description;
            this.HeadingDataForm = this.formBuilder.group({
                Title: [this.Detaildata.title],
                Description: [this.Detaildata.shortDescription],
               
            });

      //      this.spinnerService.hide();

        });
    }

    onHeadingDataSubmit() {
       
      
        this.submitted = true;
        if (typeof (this.html) != 'string'){
           // this.html = toHTML(this.html);
          
        }
        
        
        if ((this.HeadingDataForm.value.Title != '' && this.HeadingDataForm.value.Title != null) && (this.HeadingDataForm.value.Description != '' && this.HeadingDataForm.value.Description != null)
            && (this.html != '' && this.html != null) ) {

            if (this.Detailid == 0) {
                this.Detailid = null;
                this.OrderId = null;

            }

            this.resobj = {
                title: this.HeadingDataForm.value.Title,
                shortDescription: this.HeadingDataForm.value.Description,
                description:this.html,
                onboardingHeaderId: this.Headerid,
                id: this.Detailid,
                order: this.OrderId,
            };
            //console.log('resobj', this.resobj);
           // this.spinnerService.show();
            this._onboardingService.createOrEditDetails(this.resobj).subscribe((response: any) => {
                //console.log("response ", response);
                this.HeadingDataForm.reset();
                this.html = '';
                this.submitted = false;
                this.close('close');
              //  this.spinnerService.hide();
                if (this.Detailid == null) {
                    this.notifier.notify('success',"Successfully Created")
                   // this.notify.success(('Successfully Created'));

                } else {
                    this.notifier.notify('success',"Successfully Created")
                    // this.notify.success(('Successfully Updated'));
                }
                window.location.reload();
            });
        }
    }


    /* Quill-editor*/
    created(event: any) {
        // tslint:disable-next-line:no-console
        ////console.log('editor-created', event)
    }

    changedEditor() {
        if (typeof (this.html) != 'string') {
          //  this.html = toHTML(this.html);
         
        }
        
        // tslint:disable-next-line:no-console
        //console.log('editor-change', event)
    }

    focus($event: any) {
        // tslint:disable-next-line:no-console
       // console.log('focus', $event)
        this.focused = true
        this.blured = false
    }

    blur($event: any) {
        // tslint:disable-next-line:no-console
        //console.log('blur', $event)
        this.focused = false
        this.blured = true
    }

    /**
  * Function to handle Field has error
  */
    controlHasError(validation: string, controlName: string, HeadingDataForm: FormGroup): boolean {
        const control = HeadingDataForm.controls[controlName];
        var er = control.hasError(validation);
        //console.log(HeadingDataForm,control);
        return (control.hasError(validation) || (control.value).trim() =='') && (control.dirty || control.touched);
    }
}


