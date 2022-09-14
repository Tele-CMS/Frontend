import { Component, OnInit, ViewChild, ElementRef, ChangeDetectorRef } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { NotifierService } from "angular-notifier";
import { Router } from "@angular/router";
import { CommonService } from "./../../platform/modules/core/services";
import { MatAutocomplete, MatAutocompleteSelectedEvent, MatChipInputEvent } from '@angular/material';
import { Observable, of } from 'rxjs';
import { FormControl } from "@angular/forms";
import { debounceTime, distinctUntilChanged, filter, map, startWith, switchMap } from "rxjs/operators";
import { FilterModel } from './../../platform/modules/core/modals/common-model';
import { LoginUser } from './../../platform/modules/core/modals/loginUser.modal';

import { FormBuilder, FormGroup } from '@angular/forms';
import { MediaMatcher } from '@angular/cdk/layout';
import {SymptomCheckerService} from './symptom-checker.service'
import { observationEnum } from "./symptom-checker.model";
import {jsPDF} from 'jspdf';
import html2canvas from 'html2canvas';
import { debug } from "console";
import { isThisISOWeek } from "date-fns";

@Component({
  selector: 'app-symptom-checker',
  templateUrl: './symptom-checker.component.html',
  styleUrls: ['./symptom-checker.component.css']
})


export class SymptomCheckerComponent implements OnInit {
 showQuest:boolean=false;
 loading = false;
 summarySaved:boolean=false;
 keywords:any=[];
 reportObject:any;
 preliminaryOptions:boolean=true;
 covidConsulation:boolean=false;
 nextChoices:any[]=[{id:"1",label:"yes"},{id:"2",label:"no"}];
 loaderImage = "/assets/loader.gif";
 presentArray:any[]=[];
 viewSummary:boolean=false;
 absentArray:any[]=[];
 unknownArray:any[]=[];
 conclusion:any;
 observation:any="";
  userId: number;
  conditions:any;
  result:any;
  isSelected:any;
  optionChecked:boolean=false;
  subscription: any;
  forStaff: boolean = true;
  choice:string="present";
  selectedSymptom:string=''
  selectedSymptomValue:any=[];
  isInitial:boolean=true;
  symptomPageTitle: any = "Symptoms Assessments";
  covidPageTitle:any="Covid Assessments";
  currentDate = new Date();

  filterModel: FilterModel;
   riskCollection:any;
  symptomCollection:any;
  conditionCollection:any;
  dataURL: any;
  fileList: any = [];
  mobileQuery: MediaQueryList;
  leftMenu: boolean;
  _mobileQueryListener: () => void;

  delMessagesArray: number[] = [];
  should_stop:boolean=false;
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  patientId:any;
  //separatorKeysCodes: number[] = [ENTER, COMMA];
  userControl = new FormControl();
  filteredSymptoms$: Observable<any[]>;
  symptoms: any = [];
  age:any;
  gender:any;
  expanded: boolean = false;
  evidence:Array<any> = [];
  @ViewChild('conten') content: ElementRef;
  @ViewChild('userInput') userInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto') matAutocomplete: MatAutocomplete;

  constructor(

    private commonService: CommonService,
    private formBuilder: FormBuilder,
    private notifier: NotifierService,
    private router: Router,
    private symptomCheckerService:SymptomCheckerService,
    media: MediaMatcher,
    changeDetectorRef: ChangeDetectorRef,
    private activatedRoute: ActivatedRoute
  ) {

    this.mobileQuery = media.matchMedia('(min-width: 768px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
    this.expanded = true;
   this.symptoms=[];
   this.selectedSymptomValue = [];
    this.filterModel = new FilterModel();
    this.filterModel.pageSize = 100;
    this.getLoginUser();
    this.filteredSymptoms$ = this.userControl.valueChanges

    .pipe(
      startWith(''),
      // use switch map so as to cancel previous subscribed events, before creating new once
      switchMap(value => {
        if (value != null && typeof (value) == "string") {
          if (value.length > 2) {
              return this.getPatientSymptoms(value).pipe()
            } else {
              // if no value is present, return null
              return of(null);
            }
          }
          else return of(null);
        })
      );
  }



  ngOnInit() {

    this.commonService.loginUser.subscribe((user: LoginUser) => {
      if (user.data) {

        this.patientId = user.data.id;
        this.setParameters(user.data.id);
      }
    });

  }
  setParameters(id:any) {
    this.symptomCheckerService
      .GetPatientsDetailedInfo(id)
      .subscribe((response: any) => {

        if (response != null) {

          var clientModel = response.data;
          this.age = clientModel.age;
          this.gender = clientModel.gender.toLowerCase();
        }
      });
  }
  displayFn(user?: any): string | undefined {
    return user ? user.value : undefined;
  }


  getLoginUser() {
    this.subscription = this.commonService.loginUser.subscribe((user: LoginUser) => {
      if (user.data) {
        this.userId = user.data.userID;
        this.forStaff = (user.data.users3 != null && user.data.users3.userRoles.roleName == "Client") ? false : true;
      }
    });
  }


  getPatientSymptoms(searchText: string = 'headache'): any {
    return this.symptomCheckerService.getPatientSymptoms( searchText)
      .pipe(map(x => {
        return x;
      }));

  }

  add(event: MatChipInputEvent): void {

    // Add fruit only when MatAutocomplete is not open
    // To make sure this does not conflict with OptionSelected Event
    if (!this.matAutocomplete.isOpen) {
      const input = event.input;
      const value = event.value;

      // Add our fruit
      if ((value || '').trim()) {
        this.symptoms.push(value.trim());
      }

      // Reset the input value
      if (input) {
        input.value = '';
      }

      this.userControl.setValue(null);
    }
  }

  remove(user: string): void {
    const index = this.symptoms.indexOf(user);
    if (index >= 0) {
      this.symptoms.splice(index, 1);

    }
    this.optionChecked=this.symptoms.length==0?false:true;
  }


  selected(event: MatAutocompleteSelectedEvent): void {

    this.symptoms.push({
      id: event.option.value.id,
      value: event.option.viewValue,
      choice_id:"present"

    });
   this.optionChecked=true;
    this.userInput.nativeElement.value = '';
    this.userControl.setValue(null);

  }
  radioChange(value:any,symptomId:any)
  {

    this.choice=value;
    this.optionChecked=true;

    if(symptomId!='' && this.evidence.length>0)
    {
       var item=this.evidence.find(x=>x.id==symptomId);
      if(  item!=null && item !=undefined)
      {
        this.evidence=this.evidence.filter(x=>x!==item);
      }
    }
      this.evidence.push(
        {
          id: symptomId,
          choice_id: value
        });


  }

  setInitialvalues() {

    this.symptoms.forEach((value, index) => {

      this.evidence.push(
        {
          id: value.id,
          source: index == 0 ? "initial" : null,
          choice_id: "present"
        });
      if (this.isInitial) {

        this.selectedSymptomValue.push(value.value);
      }
    });
    this.isInitial = false;

  }
  moveNext() {


    this.loading = true;
    this.conditions = [];
    this.optionChecked = false;
    if (!this.should_stop) {

      if (this.evidence.length == 0) {
        this.setInitialvalues();
      }
      else {
        this.evidence.push(
          {
            id: this.selectedSymptom,
            source: null,
            choice_id: this.choice
          });

      }

    this.showQuest = true;
    var count=this.evidence.length;


    this.symptomCheckerService.getSymptomQuestions(JSON.stringify(this.evidence),this.age,this.gender).pipe(map(x => {
      return x;
    })).subscribe(resp => {
      this.loading = false;
      this.result = resp;
      this.selectedSymptom=resp.question.items[0].id;

      this.should_stop=resp.should_stop;
      if(resp.should_stop)
      {
       this.conditions=resp.conditions;
       this.getObservations();
       this.getSummary(false);
      }
    });
  }

  this.isSelected=null;
}
  getSummary(showSummary:any)
  {

  if(this.presentArray.length==0 && this.absentArray.length==0 && this.unknownArray.length==0)
  {
    this.getSymptoms();
    this.getRisks();
    this.getConditions();

  }
  this.viewSummary=showSummary;
  }
  CreateSummary(value: any, type: any) {
    if (value != null && value.common_name != null) {
      switch (type) {
        case 'present':
          this.presentArray.push(value.common_name);
          break;
        case 'absent':
          this.absentArray.push(value.common_name);
          break;
        case 'unknown':
          this.unknownArray.push(value.common_name);
          break;
      }


    }
  }

getSymptoms()
{
  this.symptomCheckerService.getSummary("symptom").pipe(map(x => {
    return x;
  })).subscribe(resp => {
    this.symptomCollection=resp;

    this.createArray(resp);
  });  }
  createArray(array:any)
  {

    this.evidence.forEach(element => {
      if (element.id != null) {

            var commonSymptom = array.find(x => x.id == element.id);
            this.CreateSummary(commonSymptom, element.choice_id);

      }

    });

  }
getRisks()
{
  this.symptomCheckerService.getSummary("risk").pipe(map(x => {
    return x;
  })).subscribe(resp => {

    this.riskCollection=resp;
    this.createArray(resp);
  });
}
getConditions()
{
  this.symptomCheckerService.getSummary("condition").pipe(map(x => {
    return x;
  })).subscribe(resp => {

    this.conditionCollection=resp;
    this.createArray(resp);
  });
}

getObservations() {
    this.symptomCheckerService.getObservations(JSON.stringify(this.evidence),this.age,this.gender).pipe(map(x => {
      return x;
    })).subscribe(resp => {
      this.conclusion=resp;
      switch (this.conclusion.triage_level) {
        case  "consultation":
          this.observation = observationEnum.consultation;
          break;
        case  "consultation_24":
          this.observation = observationEnum.consultation_24;
          break;
        case  "emergency":
          this.observation = observationEnum.emergency;
          break;
        case  "emergency_ambulance":
          this.observation = observationEnum.emergency_ambulance;
          break;
        case  "self_care":
          this.observation = observationEnum.self_care;
          break;
        default:
          this.observation = observationEnum.consultation;
          break;
      }


    });
  }
  captureScreen()
  {
    var data = document.getElementById('contentToConvert');
    html2canvas(data).then(canvas => {
      // Few necessary setting options
      var imgWidth = 20;
      var pageHeight = 295;
      var imgHeight = canvas.height * imgWidth / canvas.width;
      var heightLeft = imgHeight;

      const contentDataURL = canvas.toDataURL('image/png')
      let pdf = new jsPDF('p', 'pt', [canvas.width, canvas.height]); // A4 size page of PDF
      var position = 0;
      pdf.addImage(contentDataURL, 'PNG', 0, position, canvas.width, canvas.height)
      pdf.save('summary.pdf'); // Generated PDF
    });
  }
bookAppointment()
{

    let location = this.commonService.encryptValue(101, true);
    this.conditions.forEach((value, index) => {
      this.keywords.push(value.common_name.toLowerCase());
    });
    // this.getSummary(false);
    this.setReportParameters(true);
    localStorage.setItem("symptoms",this.keywords);
    this.router.navigate(["/doctor-list"], {
      queryParams: { loc: location}
    });
}
  onSearchClicked() {
    if (!this.expanded) {
      this.expanded = true;
    } else {
      console.log('search')
    }
  }
  covidNext()
  {
    this.getCovidSymptoms(this.evidence);
  }
getCovidSymptoms(evidence:any)
{
  this.loading = true;
  this.covidConsulation=true;
  var obj={
    sex:this.gender,
    age:this.age,
    evidence:evidence
  }

  if(!this.should_stop)
  {
  this.symptomCheckerService.getCovidQuestions(JSON.stringify(obj)).pipe(map(x => {
    return x;
  })).subscribe(resp => {
    this.loading = false;

    this.result = resp;
    this.should_stop=resp.should_stop;
    if(resp.should_stop)
    {

     this.getCovidSummary();
    }
  });
}
}
getCovidSummary()
{

  this.symptomCheckerService.getCovidSummary(JSON.stringify(this.evidence),this.age,this.gender).pipe(map(x => {
    return x;
  })).subscribe(resp => {

    this.conclusion=resp;

  });
}
  testAgain(value: any) {
    if (value == 'no') {
      this.router.navigate(["'web/dashboard'"]);
    }
    else {
      this.evidence = [];
      this.symptoms = [];
      this.should_stop = false;
      this.preliminaryOptions = true;
      this.covidConsulation = false;

    }
  }
  AddSymptomateReport() {

    if (!this.summarySaved) {
      this.setReportParameters(true);
      if (this.reportObject != null && this.reportObject != undefined) {
        this.symptomCheckerService.AddSymptomateReport(JSON.stringify(this.reportObject)).pipe(map(x => {
          return x;
        })).subscribe(resp => {
          this.notifier.notify('success', "Symptom Report has been saved successfully");
        });
      };

    }
    else {
      this.notifier.notify('success', "Symptom Report is already saved");
    }
    this.summarySaved=true;
  }

  setReportParameters(storeData: any) {

    var pArray: any[] = [];
    var aArray: any[] = [];
    var uArray: any[] = [];
    var rArray: any[] = [];
    var kArray: any[] = [];


    pArray.push(this.presentArray.join(','));
    aArray.push(this.absentArray.join(','));
    uArray.push(this.unknownArray.join(','));
    rArray.push(this.selectedSymptomValue.join(','));
    kArray.push(this.keywords.join(','));
    var object = {
      PatientabsentSymptoms: aArray,
      PatientFinalConditions:kArray,
      sex: this.gender,
      PatientpresentSymptoms: pArray,
      PatientreportedSymptoms: rArray,
      prepatientId: this.patientId,
      PatientunknownSymptoms: uArray,
      age: this.age
    }
    this.reportObject = object;
    if(storeData)
    {
      localStorage.setItem("reportObject",JSON.stringify(this.reportObject));
    }
  }


}
