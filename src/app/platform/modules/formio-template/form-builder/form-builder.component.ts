import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormioOptions, FormioHookOptions } from 'angular-formio';
import { TemplateService } from '../template.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonService } from '../../core/services';
import { NotifierService } from 'angular-notifier';

@Component({
  selector: 'app-form-builder',
  templateUrl: './form-builder.component.html',
  styleUrls: ['./form-builder.component.css']
})
export class FormBuilderComponent implements OnInit {
  // @ViewChild('json') jsonElement?: ElementRef;
  public form: Object = {
    components: []
  };
  jsonFormData: Object;
  templateFormId: number = null;
  templateName: string = null;
  templateCategoryId: number = null;
  templateSubCategoryId: number = null
  masterTemplateCategory: Array<any> = [];
  masterTemplateSubCategory: Array<any> = [];
  formioOptions: FormioOptions = {
    disableAlerts: true,
  }
  submitted: boolean;

  constructor(
    private templateService: TemplateService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private commonService: CommonService,
    private notifierService: NotifierService
  ) {
    this.submitted = false;
    this.activatedRoute.queryParams.subscribe(params => {
      this.templateFormId = params.id == undefined ? null : parseInt(this.commonService.encryptValue(params.id, false));
    });
  }

  ngOnInit() {
    if (this.templateFormId) {
      this.templateService.getTemplateForm(this.templateFormId)
        .subscribe(
          response => {
            if (response.statusCode == 200) {
              this.form = JSON.parse(response.data.templateJson || '');
              this.templateName = response.data.templateName;
              this.templateCategoryId = response.data.templateCategoryId;
              this.templateSubCategoryId = response.data.templateSubCategoryId;
              if (this.templateSubCategoryId > 0)
                this.getMasterTemplateSubCategoryData(this.templateCategoryId)
            }
          })
    }
    this.getMasterTemplateCategoryData();
  }
  onChange(event) {
    // this.jsonElement.nativeElement.innerHTML = '';
    // this.jsonElement.nativeElement.appendChild(document.createTextNode(JSON.stringify(event.form, null, 4)));
  }

  SaveTemplateForm() {
    if (!this.templateName || !this.templateName.trim()) {
      return null;
    }

    const jsonFormString = JSON.stringify(this.form);
    const postData = {
      id: this.templateFormId,
      templateName: this.templateName,
      templateJson: jsonFormString,
      templateCategoryId: this.templateCategoryId,
      templateSubCategoryId: this.templateSubCategoryId
    }
    this.submitted = true;
    this.templateService.saveTemplateForm(postData)
      .subscribe(
        response => {
          this.submitted = false;
          if (response.statusCode == 200) {
            this.notifierService.notify('success', response.message);

            if (!this.templateFormId && response.data.id) {
              const encryptId = this.commonService.encryptValue(response.data.id, true);
              this.router.navigate(['/web/Masters/template/builder'], { queryParams: { id: encryptId } });
            }
          }
          else {
            this.notifierService.notify('error', response.message);
          }
        }
      )
  }
  getMasterTemplateCategoryData() {
    this.templateService.getMasterCategoryTemplateForDD()
      .subscribe(
        (response: any) => {
          if (response.statusCode === 200) {
            this.masterTemplateCategory = response.data;
          } else {
            this.masterTemplateCategory = [];
          }
        });
  }
  getMasterTemplateSubCategoryData(masterCategoryId: number) {
    this.templateService.getMasterSubCategoryTemplateForDD(masterCategoryId)
      .subscribe(
        (response: any) => {
          if (response.statusCode === 200) {
            this.masterTemplateSubCategory = response.data;
          } else {
            this.masterTemplateSubCategory = [];
          }
        });
  }
  onMasterCategorySelect(event: any) {
    this.templateCategoryId = event.value
    this.getMasterTemplateSubCategoryData(this.templateCategoryId);
  }
}
