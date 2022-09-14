import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { SectionItem, Code } from '../../questionnaire/documents/document.model';
import { DocumentService } from '../../questionnaire/documents/document.service';
import { ResponseModel } from '../../../../../super-admin-portal/core/modals/common-model';

@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.css']
})
export class QuestionComponent implements OnInit {

  documentId: number;
  sectionItemId: number;
  sectionItemData: SectionItem[];
  sectionItemCodes: Code[];
  form: FormGroup;
  questions: any = [

    new Object({
      controlType: "dropdown",
      key: 'brave',
      label: 'Bravery Rating',
      options: [
        { key: 'solid', value: 'Solid' },
        { key: 'great', value: 'Great' },
        { key: 'good', value: 'Good' },
        { key: 'unproven', value: 'Unproven' }
      ],
      order: 3
    }),

    new Object({
      controlType: "textbox",
      key: 'firstName',
      label: 'First name',
      value: 'Bombasto',
      required: true,
      order: 1
    }),

    new Object({
      controlType: "textbox",
      key: 'emailAddress',
      label: 'Email',
      order: 2
    }),
    new Object({
      controlType: "radio",
      key: 'gender',
      label: 'gender',
      order: 2,
      type: 'radio',
      options: [
        { key: 1, value: 'Male' },
        { key: 2, value: 'Female' }
      ],
    }),
    new Object({
      controlType: "checkbox",
      key: 'hobbies',
      label: 'hobbies',
      type: 'checkbox',
      order: 2,
      options: [
        { key: 'cricket', value: 'cricket' },
        { key: 'badminton', value: 'badminton' },
        { key: 'pool', value: 'pool' },
        { key: 'snooker', value: 'snooker' }
      ],
    })
  ];
  constructor(private docPreviewService: DocumentService) { }
  ngOnInit() {
    // console.log(this.jsonObj);
    this.form = this.toFormGroup(this.questions);
  }
  onSubmit() {
    let a = this.form.value;
  }

  toFormGroup(questions: any) {
    let group: any = {};

    questions.forEach(question => {
      if (question.type == "checkbox") {
        question.options.forEach(element => {
          group[question.key + "_" + element.key] = new FormControl(true)
        });
      }
      else
        group[question.key] = new FormControl(question.value)
    });
    return new FormGroup(group);
  }


  filterCodes(catId: number) {
    this.sectionItemCodes.filter(x => x.categoryId == catId);
  }
  onChecked(event: any) {
  }
}
