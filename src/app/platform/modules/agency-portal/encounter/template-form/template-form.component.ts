import { Component, Inject } from '@angular/core';
import { FormioOptions } from 'angular-formio';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-template-form',
  templateUrl: './template-form.component.html',
  styleUrls: ['./template-form.component.css']
})
export class TemplateFormComponent {
  public jsonFormData: Object = {
    components: []
  };
  initialFormValues: Object = {
    data: {}
  };
  formioOptions: FormioOptions = {
    disableAlerts: true
  }
  encounterTemplateId: number = null;
  templateFormId: number = null;
  encounterId: number = null;
  templateFormName: string = null;

  constructor(
    public dialogPopup: MatDialogRef<TemplateFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {

    let formJson = {components: []}, formData = {data: {}};
    try{
      formJson = JSON.parse(data.templateJson);
      formData = JSON.parse(data.templateData);
    } catch(err) { }

    this.encounterTemplateId = data.id || null;
    this.jsonFormData = data.templateJson ? formJson : this.jsonFormData;
    this.templateFormName = data.templateName || '';
    this.initialFormValues = data.templateData ? formData  : this.initialFormValues;
    this.templateFormId = data.templateId;
    this.encounterId = data.encounterId;
  }

  onSubmitTemplate(event: any) {
    const postData = {
      id: this.encounterTemplateId,
      templateData: JSON.stringify(event),
      masterTemplateId: this.templateFormId,
      patientEncounterId: this.encounterId,
    }
    this.onClose(postData);
  }

  onClose(data?: any) {
    this.dialogPopup.close(data);
  }

}
