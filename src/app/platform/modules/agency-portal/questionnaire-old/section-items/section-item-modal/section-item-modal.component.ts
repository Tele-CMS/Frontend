import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, AbstractControl, ValidationErrors, FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { NotifierService } from 'angular-notifier';
import { Observable } from 'rxjs';
import { SectionItemModel } from '../../documents/document.model';
import { DocumentService } from '../../documents/document.service';

@Component({
  selector: 'app-section-item-modal',
  templateUrl: './section-item-modal.component.html',
  styleUrls: ['./section-item-modal.component.css']
})
export class SectionItemModalComponent implements OnInit {
  sectionItemModel: SectionItemModel;
  sectionItemForm: FormGroup;
  documentId: number;
  submitted: boolean = false;
  masterCategories: Array<any>;
  masterDocuments: Array<any>;
  masterControlValues: Array<any>;
  masterSectionDDValues: Array<any>;
  constructor(private formBuilder: FormBuilder,
    private sectionDialogModalRef: MatDialogRef<SectionItemModalComponent>,
    private sectionItemService: DocumentService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private notifier: NotifierService) {
    this.sectionItemModel = data.sectionItemModel;
    this.documentId = parseInt(data.documentId);
  }

  ngOnInit() {
    this.sectionItemForm = this.formBuilder.group({
      categoryId: [this.sectionItemModel.categoryId],
      displayOrder: [this.sectionItemModel.displayOrder],
      id: [this.sectionItemModel.id],
      itemLabel: [this.sectionItemModel.itemLabel],
      itemtype: [this.sectionItemModel.itemtype],
      sectionId: [this.sectionItemModel.sectionId],
      documentId: [this.documentId]
    });
    this.getMasterData();
    if (this.documentId) {
      this.getSectionItemList();
    }
  }
  getMasterData() {
    const masterData = { masterdata: 'DOCUMENTS,categories' }
    this.sectionItemService.getMasterData(masterData)
      .subscribe((response: any) => {
        if (response) {
          this.masterCategories = response.categories || [];
          this.masterDocuments = response.documents || [];
        } else {
          this.masterCategories = [];
          this.masterDocuments = [];
        }
      })
  }
  onDocumentSelect(id) {
    this.documentId = id;
    if (this.documentId) {
      this.getSectionItemList();
    }
  }
  get formControls() { return this.sectionItemForm.controls; }
  onSubmit() {
    if (!this.sectionItemForm.invalid) {
      this.submitted = true;
      this.sectionItemModel = this.sectionItemForm.value;
      // this.sectionItemModel.documentId = this.documentId;
      this.sectionItemService.saveSectionItem(this.sectionItemModel).subscribe((response: any) => {
        this.submitted = false;
        if (response.statusCode == 200) {
          this.notifier.notify('success', response.message)
          this.closeDialog('save');
        } else {
          this.notifier.notify('error', response.message)
        }
      });
    }
  }
  closeDialog(action: string): void {
    this.sectionDialogModalRef.close(action);
  }
  getSectionItemList() {
    this.sectionItemService.getSectionItemDDValues(this.documentId).subscribe((response: any) => {
      if (response.statusCode == 200) {
        this.masterSectionDDValues = response.data.sectionItems;
        this.masterControlValues = response.data.controlTypes;
      } else {
        this.masterSectionDDValues = [];
      }
    }
    );
  }
}
