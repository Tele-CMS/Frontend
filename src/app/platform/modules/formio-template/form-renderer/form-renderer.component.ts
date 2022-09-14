import { Component, OnInit } from '@angular/core';
import { FormioOptions } from 'angular-formio';
import { ActivatedRoute } from '@angular/router';
import { CommonService } from '../../core/services';
import { TemplateService } from '../template.service';

@Component({
  selector: 'app-form-renderer',
  templateUrl: './form-renderer.component.html',
  styleUrls: ['./form-renderer.component.css']
})
export class FormRendererComponent implements OnInit {
  public jsonFormData: Object = {
    components: []
  };
  initialFormValues: any = null;
  formioOptions: FormioOptions = {
    disableAlerts: true
  }
  templateFormId: number = null;
  encounterId: number = null;
  templateFormName: string = null;

  constructor(
    private activatedRoute: ActivatedRoute,
    private commonService: CommonService,
    private templateService: TemplateService
  ) {
    this.activatedRoute.queryParams.subscribe(params => {
      this.templateFormId = params.id == undefined ? null : parseInt(this.commonService.encryptValue(params.id, false));
      this.encounterId = params.encId == undefined ? null : parseInt(this.commonService.encryptValue(params.encId, false));
    });
  }

  ngOnInit() {

    // this.jsonFormData = JSON.parse(`{"components":[{"label":"Text Field","allowMultipleMasks":false,"showWordCount":false,"showCharCount":false,"tableView":true,"alwaysEnabled":false,"type":"textfield","input":true,"key":"textField2","widget":{"type":""}},{"label":"Number","mask":false,"tableView":true,"alwaysEnabled":false,"type":"number","input":true,"key":"number2"},{"type":"button","label":"Submit","key":"submit","disableOnInvalid":true,"theme":"primary","input":true,"tableView":true}]}`)

    if (this.templateFormId) {
      this.templateService.getTemplateForm(this.templateFormId)
        .subscribe(
          response => {
            if (response.statusCode == 200) {
              this.jsonFormData = JSON.parse(response.data.templateJson || '');
              this.templateFormName = response.data.templateName || '';
              this.initialFormValues = JSON.parse(`{"data": {"firstname":"laxman singh karki","accept":true,"message":"hey this is a message","submit":true}}`);
            }
          })
    }
  }

  onSubmitTemplate(event: any) {
    console.log(event, this.jsonFormData)

    const postData = {
      id: null,
      data: JSON.stringify(event.data),
      templateId: this.templateFormId,
      encounterId: this.encounterId,
    }

  }

}
