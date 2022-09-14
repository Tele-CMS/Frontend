import { Component, Inject, OnInit } from '@angular/core';
import { NotifierService } from 'angular-notifier';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonService } from '../../../core/services';
import { DialogService } from '../../../../../shared/layout/dialog/dialog.service';
import { ProviderquestionnaireService } from '../providerquestionnaire.service';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ProviderQuestionnaireControlModel, QuestionnareControl, QuestionnareTypeModel } from '../providerquestionnaire.model';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';


@Component({
    selector: 'app-add-question',
    templateUrl: './add-question.component.html',
    styleUrls: ['./add-question.component.scss']
})
export class AddQuestionComponent implements OnInit {
    type: QuestionnareTypeModel;
    controlsFormGroup: FormGroup;
    submitted = false;
    controlsList: QuestionnareControl[];
    selectedControlType: number;
    isUpdate = false;
    isShowAddOptions= false;
    textFieldTypes:any[];
    // isShowType = false;
    constructor(
        private providerquestionnaireService: ProviderquestionnaireService,
        private formBuilder: FormBuilder,
        public dialogPopup: MatDialogRef<AddQuestionComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private notifier: NotifierService,
        private commonService: CommonService
    ) {
        this.textFieldTypes = [ {name:'Text', value: 'text'}, {name:'Numeric', value: 'number'} ];
        this.type = data.type;
        this.isUpdate = data.isUpdate;
        this.createForm(data.questionControl);
    }

    ngOnInit() {
        this.getControls(this.type.id);
    }

    createForm(providerQuestion: ProviderQuestionnaireControlModel | null) {
 
        this.controlsFormGroup = this.formBuilder.group({
            questionText: [providerQuestion ? providerQuestion.questionText : undefined, [Validators.required]],
            id: [providerQuestion ? providerQuestion.questionId : undefined],
            options: this.formBuilder.array([]),
            questionnaireTypeControlId:[providerQuestion ? providerQuestion.questionnaireTypeControlId : undefined, [Validators.required]],
            order: [providerQuestion ? providerQuestion.questionId : undefined],
            isActive: [providerQuestion ? providerQuestion.isActive : true],
            isRequired: [providerQuestion ? providerQuestion.isRequired : true],
            type: [ (providerQuestion && providerQuestion.control  && providerQuestion.control.type) ?  providerQuestion.control.type : undefined],
        });

        if (providerQuestion && providerQuestion.control && providerQuestion.control.options && providerQuestion.control.options.length>0){
            this.isShowAddOptions = true;
            const optionsObjs = [...providerQuestion.control.options];
            const options = [...optionsObjs.map(x => x.key)];
            this.bindOptions(options);
        }
        if(providerQuestion){
            this.selectedControlType =  providerQuestion.questionnaireTypeControlId;
        }
            
    }


    bindOptions(options: string[]) {
        options.forEach(o => {
            this.addQuestionnaireControlOption(o);
        });
    }

    get optionsControlFormGroup() {
        return <FormArray>this.controlsFormGroup.controls['options'];
    }




    addQuestionnaireControlOption(option: string) {
        const control = this.formBuilder.group({
            option: [option ? option : undefined, [Validators.required]]
        })
        this.optionsControlFormGroup.push(control);
    }

    removeOption(index) {
       
        this.optionsControlFormGroup.removeAt(index);
    }


    onControltypeChange(value: number) {

        const controlType = this.controlsList.find(x => x.id == value);
        this.isShowAddOptions =controlType.hasOptions;
        if (controlType.hasOptions) {
            if (this.optionsControlFormGroup.length == 0) {
                this.addQuestionnaireControlOption('');
            }
        } else {
            this.controlsFormGroup.controls['options'] = this.formBuilder.array([]);
        }


        const  isShowType = controlType.key == 'textbox' ? true : false;
        
        if(isShowType){
            if(!this.controlsFormGroup.controls.type.value)
            this.controlsFormGroup.controls.type.setValue('text');
        }
    }


    getControls(typeId) {
        this.commonService.loadingStateSubject.next(true);
        this.providerquestionnaireService.getQuestionnaireControlsByType(typeId).subscribe(res => {
            this.controlsList = res.data
            this.commonService.loadingStateSubject.next(true);}
            );
    }

    get isShowType(): boolean {
        {
            if(this.controlsList && this.controlsList.length >0 && this.selectedControlType){
                const texTcontrol = this.controlsList.find(x => x.key == 'textbox');
             return (texTcontrol && texTcontrol.id  == this.selectedControlType) ? true : false;
            } else {
                return false;
            }
        }  
    }

    onClose(isSaved = false) {
        this.dialogPopup.close(isSaved ?"SAVE": "");
    }

    onSubmit(){
        if(this.controlsFormGroup.invalid){
            return;
        }
        let formData  = this.controlsFormGroup.value;
        formData.options = (formData.options && formData.options.length >0) ? formData.options.map( m=> m.option) : [];
        let model = new ProviderQuestionnaireControlModel();
         model = formData;
         
        if(this.isUpdate)
        this.updateQuestion(model);
        else 
        this.addQuestion(model);
      
    }


    addQuestion(model:ProviderQuestionnaireControlModel){
        this.providerquestionnaireService.saveProviderQuestionnaireControl(model).subscribe(res => {
            if(res.data){
                this.onClose(true)
            } else {
               this.notifier.notify("error","Something went wrong..!");
            }
           
       });
    }

    updateQuestion(model:ProviderQuestionnaireControlModel){
        this.providerquestionnaireService.updateProviderQuestionnaireControl(model).subscribe(res => {
            if(res.data){
                this.onClose(true)
            } else {
                this.notifier.notify("error","Something went wrong..!")
            }
           
       });
    }

}
