import { Component, OnInit, Inject } from '@angular/core';
import { SectionItem, Code, Answer, SectionItemModel } from '../documents/document.model';
import { DocumentService } from '../documents/document.service';
import { ResponseModel } from '../../../../../super-admin-portal/core/modals/common-model';
import { FormGroup, FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { NotifierService } from 'angular-notifier';

function groupBy(array, f) {
  var groups = {};
  array.forEach((o) => {
    var group = JSON.stringify(f(o));
    groups[group] = groups[group] || [];
    groups[group].push(o);
  });
  return Object.keys(groups).map((group) => {
    return groups[group];
  });
}

@Component({
  selector: 'app-document-preview',
  templateUrl: './document-preview.component.html',
  styleUrls: ['./document-preview.component.css']
})
export class DocumentPreviewComponent implements OnInit {
  documentId: number;
  patientDocumentId: number;
  patientId: number;
  sectionItemData: SectionItem[];
  sectionItemCodes: Code[];
  resultArray: Array<any>;
  answerArray: Answer[] = [];
  form: FormGroup;
  submitted: boolean = false;
  sectionItemModel: SectionItemModel;
  constructor(private docPreviewService: DocumentService, private docPreviewDialogModalRef: MatDialogRef<DocumentPreviewComponent>, @Inject(MAT_DIALOG_DATA) public data: any, private notifier: NotifierService) {
    this.sectionItemData = data.sectionItemData;
    this.sectionItemCodes = data.sectionItemCodes;
    this.answerArray = data.answer || [];
    this.documentId = data.documentId;
    this.patientId = data.patientId;
    this.patientDocumentId = data.patientDocumentId;
    this.sectionItemModel = new SectionItemModel();
  }

  ngOnInit() {
    if (this.sectionItemData) {
      this.resultArray = groupBy(this.sectionItemData, function (item) {
        return [item.sectionName];
      });
    }
  }

  onSubmit() {
    this.submitted = true;
    const formData =
    {
      ...this.sectionItemModel,
      answer: this.answerArray,
      patientID: this.patientId,
      documentId: this.documentId,
      sectionItems: this.sectionItemData,
      codes: this.sectionItemCodes,
    };
    this.docPreviewService.savePatientDocumentAnswer(formData).subscribe((response: any) => {
      this.submitted = false;
      if (response.statusCode == 200) {
        this.notifier.notify('success', response.message)
        this.closeDialog('save');
      } else {
        this.notifier.notify('error', response.message)
      }
    });

  }
  filterCodes(categoryId: number) {
    return this.sectionItemCodes.filter(x => x.categoryId == categoryId);
  }

  getAnswer(sectionItemId: number, optId?: number) {
    let answer = null;
    if (!this.answerArray || !this.answerArray.length) {
      return answer;
    }
    if (!optId) {
      const answerObj = (this.answerArray || []).find((obj) => obj.sectionItemId == sectionItemId)
      answer = answerObj ? answerObj.textAnswer ? answerObj.textAnswer : answerObj.answerId : null;
    } else {
      const answerObj = (this.answerArray || []).find((obj) => obj.sectionItemId == sectionItemId && obj.answerId == optId)
      answer = answerObj ? true : false;
    }
    return answer;
  }
  pushAnswers(event: any, optId: number, questionId: number, inputType: string) {
    if (optId != null && inputType.toLowerCase() == 'radiobutton') {
      let index = this.answerArray.findIndex((obj) => obj.sectionItemId == questionId);
      const answerObj = this.answerArray.find((obj) => obj.sectionItemId == questionId);
      if (index == -1) {
        this.answerArray.push({
          'id': answerObj && answerObj.id || 0,
          'sectionItemId': questionId,
          'answerId': optId,
          'textAnswer': "",
        });
      } else {
        this.answerArray.splice(index, 1, {
          'id': answerObj && answerObj.id || 0,
          'sectionItemId': questionId,
          'answerId': optId,
          'textAnswer': "",
        })
      }
    } else if (optId == null && (inputType.toLowerCase() == 'textarea' || inputType.toLowerCase() == 'textbox')) {
      let index = this.answerArray.findIndex((obj) => obj.sectionItemId == questionId)
      const answerObj = this.answerArray.find((obj) => obj.sectionItemId == questionId);
      if (index == -1) {
        this.answerArray.push({
          'id': answerObj && answerObj.id || 0,
          'sectionItemId': questionId,
          'answerId': 0,
          'textAnswer': event.target.value,
        });
      } else {
        this.answerArray.splice(index, 1, {
          'id': answerObj && answerObj.id || 0,
          'sectionItemId': questionId,
          'answerId': 0,
          'textAnswer': event.target.value,
        })
      }
    } else if (optId != null && inputType.toLowerCase() == 'checkbox') {
      let index = this.answerArray.findIndex((obj) => obj.sectionItemId == questionId)
      const answerObj = this.answerArray.find((obj) => obj.sectionItemId == questionId);
      if (event.checked || index == -1) {
        this.answerArray.push({
          'id': answerObj && answerObj.id || 0,
          'sectionItemId': questionId,
          'answerId': optId,
          'textAnswer': "",
        });
      } else {
        this.answerArray.splice(index, 1)
      }

    } else if (optId != null && inputType.toLowerCase() == 'dropdown') {
      let index = this.answerArray.findIndex((obj) => obj.sectionItemId == questionId);
      const answerObj = this.answerArray.find((obj) => obj.sectionItemId == questionId);
      if (index == -1) {
        this.answerArray.push({
          'id': answerObj && answerObj.id || 0,
          'sectionItemId': questionId,
          'answerId': optId,
          'textAnswer': "",
        });
      } else {
        this.answerArray.splice(index, 1, {
          'id': answerObj && answerObj.id || 0,
          'sectionItemId': questionId,
          'answerId': optId,
          'textAnswer': "",
        })
      }
    }
  }
  closeDialog(action: string): void {
    this.docPreviewDialogModalRef.close(action);
  }

}
