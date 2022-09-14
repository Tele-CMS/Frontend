export class ControlBase<T> {
    value: T|undefined;
    formControlName: string;
    label: string;
    isRequired: boolean;
    order: number;
    controlType: string;
    type: string;
    options: {key: string, value: string}[];
    questionText:string;
    questionId:number;
  
    constructor(options: {
        value?: T;
        formControlName?: string;
        label?: string;
        isRequired?: boolean;
        order?: number;
        controlType?: string;
        type?: string;
        options?: {key: string, value: string}[];
        questionText? :string;
        questionId? :number;

      } = {}) {
      this.value = options.value;
      this.formControlName = options.formControlName || '';
      this.label = options.label || '';
      this.isRequired = !!options.isRequired;
      this.order = options.order === undefined ? 1 : options.order;
      this.controlType = options.controlType || '';
      this.type = options.type || '';
      this.options = options.options || [];
      this.questionText = options.questionText || '';
      this.questionId = options.questionId || 0;
    }
  }

  export  class ControlTypesHelper{

    static controlTypes= {
        textbox : 'textbox',
        dropdown : 'dropdown',
        radiobutton : 'radiobutton',
        checkbox : 'checkbox',
        textarea : 'textarea',
    }
   
    

  }


  export class QuestionBase<T> {
    value: T|undefined;
    key: string;
    label: string;
    required: boolean;
    order: number;
    controlType: string;
    type: string;
    options: {key: string, value: string}[];
  
    constructor(options: {
        value?: T;
        key?: string;
        label?: string;
        required?: boolean;
        order?: number;
        controlType?: string;
        type?: string;
        options?: {key: string, value: string}[];
      } = {}) {
      this.value = options.value;
      this.key = options.key || '';
      this.label = options.label || '';
      this.required = !!options.required;
      this.order = options.order === undefined ? 1 : options.order;
      this.controlType = options.controlType || '';
      this.type = options.type || '';
      this.options = options.options || [];
    }


  }

  export class SaveQuestionAsnwerRequestModel{
    patientAppointmentId: number;
    answers: QuestionnaireAnswerModel[] = [];
  }

  export class QuestionnaireAnswerModel {
    questionId: number;
    answer: string;
  }