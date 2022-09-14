import { Component, OnInit, Inject, ViewEncapsulation } from '@angular/core';
import { SectionItem, Code, Answer, SectionItemModel } from './document.model';
import { ResponseModel } from '../../../../../super-admin-portal/core/modals/common-model';
import { FormGroup, FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { NotifierService } from 'angular-notifier';
import { QuestionairePreviewService } from '../questionaire-preview.service';
import { MemberHRAService } from '../../member-hra/member-hra.service';
import { DomSanitizer } from '@angular/platform-browser';
import { PreviewIndividualReportComponent } from '../../member-hra/member-hra-listing/preview-individual-report/preview-individual-report.component';
import { ReplaySubject, Subject, Observable, of } from 'rxjs';
import { catchError, filter, tap, takeUntil, debounceTime, map, finalize, delay } from 'rxjs/operators';

interface selectSearchModel {
  id: number
  value: string
}
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
  styleUrls: ['./document-preview.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class DocumentPreviewComponent implements OnInit {
  urlSafe: any;
  imageBlobUrl: string;
  documentId: number;
  docName: string;
  patientDocumentId: number;
  patientId: number;
  sectionItemData: SectionItem[];
  sectionItemCodes: Code[];
  resultArray: Array<any>;
  answerArray: Answer[] = [];
  form: FormGroup;
  submitted: boolean = false;
  sectionItemModel: SectionItemModel;
  headerText: string;
  key: string;
  providerId: number;

  constructor(private docPreviewService: QuestionairePreviewService, private docPreviewDialogModalRef: MatDialogRef<DocumentPreviewComponent>, private sanitizer: DomSanitizer, public dialogModal: MatDialog, private memberHRAService: MemberHRAService, @Inject(MAT_DIALOG_DATA) public data: any, private notifier: NotifierService) {
    this.sectionItemData = data.sectionItemData;
    this.sectionItemCodes = data.sectionItemCodes;
    this.answerArray = data.answer || [];
    this.documentId = data.documentId;
    this.patientId = data.patientId;
    this.patientDocumentId = data.patientDocumentId;
    this.sectionItemModel = new SectionItemModel();
    this.key = data.key ? data.key : '';
    this.docName = data.docName;
    this.providerId = data.providerId;
    if (this.docName != '') {
      this.headerText = this.patientDocumentId > 0 ? `Submit ${this.docName}` : `${this.docName} Preview`
    } else {
      this.headerText = this.patientDocumentId > 0 ? `Submit Assessment` : `Assessment Preview`
    }
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
    let logsData = {
      "docName":this.docName,
      "providerId":this.providerId
    }
    const formData =
    {
      ...this.sectionItemModel,
      answer: this.answerArray,
      patientID: this.patientId,
      documentId: this.documentId,
      sectionItems: this.sectionItemData,
      patientDocumentId: this.patientDocumentId,
      codes: this.sectionItemCodes,
      logs: logsData
    };
    let mandatoryAnsweredArray = [];
    this.sectionItemData.forEach(x => {
      if (x.isMandatory == true) {
        if (this.answerArray.find(a => a.sectionItemId == x.id)) {
          mandatoryAnsweredArray.push(x)
        }
      }
    })
    if (this.sectionItemData.filter(x => x.isMandatory).length != mandatoryAnsweredArray.length) {
      this.submitted = false;
      this.notifier.notify('warning', 'Please give the answers to mandatory questions.')
      return false
    }
    this.docPreviewService.savePatientDocumentAnswer(formData).subscribe((response: any) => {
      this.submitted = false;
      if (response.statusCode == 200) {
        if (this.docName == 'HRA Scoring') {
          this.memberHRAService.generateIndividualSummaryPDF(formData.patientDocumentId, formData.patientID).subscribe((response: any) => {
            this.createImageFromBlob(response);
          });
        }
        this.notifier.notify('success', response.message)
        this.closeDialog('save');
      } else {
        this.notifier.notify('error', response.message)
      }
    });

  }
  createImageFromBlob(image: Blob) {
    let reader = new FileReader();
    this.imageBlobUrl = "";
    this.urlSafe = ''
    reader.addEventListener("load", () => {
      this.imageBlobUrl = reader.result as string;

      this.urlSafe = this.sanitizer.bypassSecurityTrustResourceUrl(this.imageBlobUrl);
      let previewModal;
      previewModal = this.dialogModal.open(PreviewIndividualReportComponent, { data: { urlSafe: this.urlSafe } })
      previewModal.afterClosed().subscribe((result: string) => {
      });
    }, false);
    if (image) {
      reader.readAsDataURL(image);
    }
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
      let index = this.answerArray.findIndex((obj) => obj.sectionItemId == questionId && obj.answerId == optId)
      const answerObj = this.answerArray.find((obj) => obj.sectionItemId == questionId && obj.answerId == optId);
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
  get countAnswers() {
    let distinctanswerArray = Array.from(new Set(this.answerArray.map(x => x.sectionItemId))).map(sectionItemId => {
      let x = this.answerArray.find(x => x.sectionItemId == sectionItemId)
      return {
        ...x
      }
    })
    return distinctanswerArray.filter(x => x.answerId > 0 || (x.answerId == 0 && (x.textAnswer != null || x.textAnswer != '' || x.textAnswer != undefined))).length
  }
  closeDialog(action: string): void {
    this.docPreviewDialogModalRef.close(action);
  }
  printAssessmentForm() {
    let patientDocId = this.patientDocumentId || null;
    this.docPreviewService.generateAssessmentFormPDF(patientDocId, this.patientId, this.documentId).subscribe((response: any) => {
      this.docPreviewService.downLoadFile(response, 'application/pdf', `Assessment Form.pdf`)
    });
  }
}
