import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl, AbstractControl, ValidationErrors } from '@angular/forms';
import { TagModal } from '../tag.modal';
import { TagsService } from '../tags.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { NotifierService } from 'angular-notifier';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-tag-modal',
  templateUrl: './tag-modal.component.html',
  styleUrls: ['./tag-modal.component.css']
})
export class TagModalComponent implements OnInit {
  tagForm: FormGroup;
  tagModal: TagModal;
  tagId: number;
  // for loading ...
  loadingMasterData: boolean = false;
  submitted: boolean = false;
  // master value fields
  userRoleType: Array<any> = [];

  colorCode = '';
  fontColorCode = '';
  organizationID = 0;

  constructor(
    private formBuilder: FormBuilder,
    private tagsService: TagsService,
    private dialogRef: MatDialogRef<TagModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: TagModal,
    private notifier: NotifierService
  ) {
    this.tagModal = data || new TagModal();
    this.tagId = this.tagModal.id;
  }

  ngOnInit() {
    this.loadMasterData();
    this.initializeFormFields(this.tagModal);
  }

  // convenience getter for easy access to form fields
  get f() { return this.tagForm.controls; }

  initializeFormFields(tagObj?: TagModal) {
    tagObj = tagObj || new TagModal();
    const configControls = {
      'tag': new FormControl(tagObj.tag, {
        validators: [Validators.required],
        asyncValidators: [this.validateTagName.bind(this)],
        updateOn: 'blur'
      }),
      'description': [tagObj.description],
      'colorCode': [tagObj.colorCode],
      'fontColorCode': [tagObj.fontColorCode],
      'roleTypeID': [tagObj.roleTypeID, Validators.required],
    }
    this.tagForm = this.formBuilder.group(configControls);
    this.colorCode = tagObj.colorCode || '';
    this.fontColorCode = tagObj.fontColorCode || '';
    this.organizationID = tagObj.organizationID || 0;
  }

  loadMasterData() {
    // load master data
    this.loadingMasterData = true;
    const masterData = { masterdata: 'userRoleType' };
    this.tagsService.getMasterData(masterData).subscribe((response: any) => {
      this.loadingMasterData = false;
      this.userRoleType = response.userRoleType || [];
    });
  }

  onSubmit(): any {
    this.submitted = true;
    if (this.tagForm.invalid) {
      this.submitted = false;
      return;
    }
    this.tagModal = this.tagForm.value;
    this.tagModal.id = this.tagId;
    this.tagModal.colorCode = this.colorCode;
    this.tagModal.fontColorCode = this.fontColorCode;
    this.tagModal.value = this.tagModal.tag;
    this.tagModal.organizationID = this.organizationID;
    this.tagsService.create(this.tagModal).subscribe((response: any) => {
      this.submitted = false;
      if (response.statusCode === 200) {
        this.notifier.notify('success', response.message)
        this.dialogRef.close('SAVE');
      } else {
        this.notifier.notify('error', response.message)
      }
    })
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

  validateTagName(ctrl: AbstractControl): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> {
    return new Promise((resolve) => {
      const postData = {
        "labelName": "Tag name",
        "tableName": "MASTER_MANAGETAG_TAG",
        "value": ctrl.value,
        "colmnName": "TAG",
        "id": this.tagId,
      }
      if (!ctrl.dirty) {
        resolve();
      } else
      this.tagsService.validate(postData)
        .subscribe((response: any) => {
          if (response.statusCode !== 202)
            resolve({ uniqueName: true })
          else
            resolve();
        })
    })
  }
}
