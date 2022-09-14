import { Component, OnInit } from '@angular/core';
import { Color } from 'ng2-charts';
import { CommonService } from "src/app/platform/modules/core/services";
import { merge, Subscription, Subject } from "rxjs";
import { EncounterGraphService } from './encounter-graph.service';
import { format, addDays, addYears,startOfMonth, setMonth, endOfMonth, setYear, startOfYear, endOfYear, isValid } from "date-fns";
import { Router } from '@angular/router';
import { ResponseModel } from 'src/app/platform/modules/core/modals/common-model';
@Component({
  selector: 'app-encounter-graph',
  templateUrl: './encounter-graph.component.html',
  styleUrls: ['./encounter-graph.component.css']
})
export class EncounterGraphComponent implements OnInit {
  subscription: Subscription;
  currentLoginUserId: number;
  currentLocationId: number;
  userRoleName: string;
  userId:string;  
//for encounter graph
masterStaffsForEncounter: Array<any>;
masterEncounterTypes: Array<any> = [];
lineChartDataForEncounters: Array<any>;
lineChartColors_encounter: Array<Color>;
lineChartLabels_encounters: Array<any> = [];
lineChartData_encounters: Array<any>;
lineChartOptions_encounters: any
showEncounterGraph: boolean = false
filterParamsForEncounter: {
  encounterTypeIds: Array<string>,
  encounterTimeIntervalId: number,
  CareManagerIds: Array<number>,
  EnrollmentId: number,
  nextAppointmentPresent: boolean,
  //isCheckTotalEnrollments: boolean
}
masterEncountertimeIntervalData: Array<any> = []
masterEnrollmentTypeFilter: Array<any> = [];
filterParamsForHRA: {
  careManagerIds: Array<string>
  EnrollmentId: number,
  nextAppointmentPresent: boolean,
}
filterParams: {
  programIds: Array<string>,
  conditionIds: Array<string>,
  timeIntervalFilterId: number,
  isCheckTotalEnrollments: boolean,
  isCheckEnrolled: boolean,
  isCheckNotEnrolled: boolean,
  CareManagerIds: Array<number>;
  EnrollmentId: number,
  nextAppointmentPresent: boolean
}
filterParamsFoRisk: {
  careManagerIds: Array<string>,
  EnrollmentId: number,
  nextAppointmentPresent: boolean,
}
areRetainedFilters: boolean;
masterStaffs: Array<any>;
  constructor(
    private commonService:CommonService,
    private encounterGraphService:EncounterGraphService,
    private router:Router
  ) { 
    //for encounter graph
    this.filterParamsForEncounter = {
      encounterTypeIds: [],
      encounterTimeIntervalId: null,
      CareManagerIds: [],
      EnrollmentId: null,
      nextAppointmentPresent: null
    }
    this.filterParamsForHRA = {
      careManagerIds: [],
      EnrollmentId: null,
      nextAppointmentPresent: null
    }
    this.filterParams = {
      programIds: [],
      conditionIds: [],
      timeIntervalFilterId: null,
      isCheckTotalEnrollments: false,
      isCheckEnrolled: true,
      isCheckNotEnrolled: false,
      CareManagerIds: [],
      EnrollmentId: null,
      nextAppointmentPresent: null
    }
    this.filterParamsFoRisk = {
      careManagerIds: [],
      EnrollmentId: null,
      nextAppointmentPresent: null
    }
  }

  ngOnInit() { 
    // this.filterModel = new FilterModel();
    // this.textChatModel = new TextChatModel();
    this.subscription = this.commonService.currentLoginUserInfo.subscribe(
      (user: any) => {
        if (user) {
          this.currentLoginUserId = user.id;
          this.userId=user.userID;
          this.currentLocationId = user.currentLocationId;
          this.userRoleName =
            user && user.users3 && user.users3.userRoles.userType; 
            this.filterParamsForEncounter.CareManagerIds = [this.currentLoginUserId]; 
            let CMIdArray = [];
            CMIdArray.push(this.currentLoginUserId);
            this.filterParamsForHRA.careManagerIds = CMIdArray;
            this.filterParamsFoRisk.careManagerIds = CMIdArray;
            this.getMasterData(); 
            this.getStaffsByLocation();  
            this.getDataForHRABarChart(this.filterParamsForHRA);
            this.getDataForRiskGraph(this.filterParamsFoRisk);
        }
      }
    );

    if (sessionStorage.getItem("dashboardFilters")) {
      try {
        const dashboardFiltersString = this.commonService.encryptValue(sessionStorage.getItem("dashboardFilters"), false);
        const { filterParamsForEncounter,filterParamsForHRA,filterParamsFoRisk,filterParams} = JSON.parse(dashboardFiltersString); 
        this.filterParamsForEncounter = filterParamsForEncounter;
        this.filterParamsForHRA = filterParamsForHRA;
        this.filterParamsFoRisk = filterParamsFoRisk;
        this.filterParams = filterParams;
        this.areRetainedFilters = true;
      } catch (err) {
        console.error(err);
      }
    }
  }
  getMasterData() {
    const masterData = { masterdata: "CAREPLANSTATUSFILTER,APPOINTMENTIMEGRAPHFILTER,APPOINTMENTSTATUS,ENCOUNTERTYPES,ENCOUNTERGRAPHFILTER,MASTERTASKSTIMEINTERVAL,PATIENTCAREGAPSTATUS,ALERTSINDICATORFILTER,MASTERCAREGAPSTIMEINTERVAL,MASTERENROLLMENTTYPEFILTER,MASTERCAREGAPSGRAPHVIEWFILTER,MASTERDISEASECONDITIONMAPPEDWITHDMP,MASTERTHERACLASSGRAPHVIEWTYPE,POCHUGSSTATUS,HUGSCHARTTYPE,POCHUGSTYPE" };
    this.encounterGraphService.getMasterData(masterData)
      .subscribe((response: any) => {
        const staticEncTypes = ['Acute Care', 'Wellness Visit', 'Administrative', 'Disease Management'];  
        this.masterEnrollmentTypeFilter = response.masterEnrollmentTypeFilter || [];
        this.masterEncountertimeIntervalData = response.encounterGraphfilter || [];
        this.masterEncounterTypes = response.encounterTypes || [];
        // default selected filter values
        if (!this.areRetainedFilters) {  
          if (this.masterEnrollmentTypeFilter.length > 0) {
            this.filterParamsForHRA.EnrollmentId = this.masterEnrollmentTypeFilter.find(x => x.id > 0 && x.value.toLowerCase() == 'all').id;
            this.filterParams.EnrollmentId = this.masterEnrollmentTypeFilter.find(x => x.id > 0 && x.value.toLowerCase() == 'all').id;
            this.filterParamsFoRisk.EnrollmentId = this.masterEnrollmentTypeFilter.find(x => x.id > 0 && x.value.toLowerCase() == 'all').id;
          } 
          let defautlEncTimeIntervalObj = this.masterEncountertimeIntervalData.find(x => x.value == 'Weekly'); 
          let defaultEnrollTypeObj = this.masterEnrollmentTypeFilter.find(x => x.value == 'All');
           
          this.filterParamsForEncounter.encounterTimeIntervalId = defautlEncTimeIntervalObj && defautlEncTimeIntervalObj.id;
          this.filterParamsForEncounter.encounterTypeIds = (response.encounterTypes || []).filter(x => staticEncTypes.includes(x.value)).map(x => x.id);
          this.filterParamsForEncounter.EnrollmentId = defaultEnrollTypeObj && defaultEnrollTypeObj.id;
        }
         
        // if (this.filterParams.EnrollmentId > 0)
        //   this.getDataForProgramEnrollesLineChart(this.filterParams)
        // if (this.filterParams.timeIntervalFilterId > 0) {
        //   this.getDataForProgramEnrollesLineChart(this.filterParams)
        // }
         
        if (this.filterParamsForEncounter.encounterTimeIntervalId > 0) {
          this.getDataForEncounterLineChart(this.filterParamsForEncounter)
        }
         
        // this.viewEmptyEncounterGraph();
        // this.viewEmptyAppointmentGraph();
         
      });
  }
  getStaffsByLocation(): void {
    const locId = this.currentLocationId.toString();
    this.encounterGraphService.getStaffAndPatientByLocation(locId)
      .subscribe((response: any) => {
        if (response.statusCode !== 200) {
          this.masterStaffs = [];
          this.masterStaffsForEncounter = [];
        } else {
          this.masterStaffs = response.data.staff || [];
          let updatedStaffs = [
            { 'id': -1, 'value': 'Provider Not Assigned' },
            ...this.masterStaffs,
          ]
          this.masterStaffsForEncounter = updatedStaffs;
        }
 
      })
  }
  getDataForHRABarChart(filterParamsForHRA: any) {
    // this.encounterGraphService.getBarChartDataForHRA(filterParamsForHRA).subscribe((response: ResponseModel) => {
    //   if (response != null && response.statusCode == 200) {
    //     this.barChartDataForHra = response.data || []
    //     if (this.barChartDataForHra && this.barChartDataForHra.length > 0) {
    //       this.viewHRABarGraph();
    //     } else {
    //       this.showGraphForHRA = false
    //     }
    //   } else if (response != null && response.statusCode == 204) {
    //     this.showGraphForHRA = false
    //   }
    //   else {
    //     this.barChartDataForHra = [];
    //     //this.showGraphForHRA = false
    //   }
    // })
  }
  getDataForRiskGraph(filterParams: any) {
    // let filters = {
    //   ...filterParams
    // }
    // // const AlertTypeIds = (this.filterAlerts.AlertTypeIds || []).join();
    // this.encounterGraphService.GetRiskDataForGraph(filters).subscribe((response: ResponseModel) => {
    //   if (response != null && response.statusCode == 200) {
    //     let riskData = response.data || [];
    //     this.RiskData = riskData;
    //     if (riskData && riskData.length > 0) {
    //       this.showRiskGraph(riskData);
    //     } else {
    //       this.showRiskChart = false;
    //     }
    //   }
    // })
  }

  onEncounterTimeInterval(event: any) {
    this.filterParamsForEncounter.encounterTimeIntervalId = event.value
    this.getDataForEncounterLineChart(this.filterParamsForEncounter);
  }
  onEncounterSelect(event: any) {
    let encounterIdArray = event.value
    this.filterParamsForEncounter.encounterTypeIds = encounterIdArray || [];
    this.getDataForEncounterLineChart(this.filterParamsForEncounter);
  }
  onEncounterNextAppSelect(event: any) {
    this.filterParamsForEncounter.nextAppointmentPresent = event.value
    this.getDataForEncounterLineChart(this.filterParamsForEncounter);
  }
  onEncounterNextAppRefersh() {
    this.filterParamsForEncounter.nextAppointmentPresent = null;
    this.getDataForEncounterLineChart(this.filterParamsForEncounter);
  }
  onEncounterCMSelect() {
    this.getDataForEncounterLineChart(this.filterParamsForEncounter);
  }
  onEncounterCMSelectOrDeselect(key: string = '') {
    if (key.toLowerCase() == 'selectall') {
      if (this.filterParamsForEncounter.CareManagerIds.length == this.masterStaffsForEncounter.length) {
        return;
      }
      this.filterParamsForEncounter.CareManagerIds = this.masterStaffsForEncounter.map(x => x.id);
    } else {
      if (this.filterParamsForEncounter && (this.filterParamsForEncounter.CareManagerIds || []).length == 0) {
        return;
      }
      this.filterParamsForEncounter.CareManagerIds = [];
    }
    this.getDataForEncounterLineChart(this.filterParamsForEncounter);
  }
  onEncounterTypeSelectOrDeselect(key: string = '') {
    if (key.toLowerCase() == 'selectall') {
      if (this.filterParamsForEncounter.encounterTypeIds.length == this.masterEncounterTypes.length) {
        return;
      }
      this.filterParamsForEncounter.encounterTypeIds = this.masterEncounterTypes.map(x => x.id);
    } else {
      if (this.filterParamsForEncounter && (this.filterParamsForEncounter.encounterTypeIds || []).length == 0) {
        return;
      }
      this.filterParamsForEncounter.encounterTypeIds = [];
    }
    this.getDataForEncounterLineChart(this.filterParamsForEncounter);
  }
  onResetEncounterTypeDropdown() {
    if (this.filterParamsForEncounter && this.filterParamsForEncounter.encounterTypeIds.length > 0) {
      this.filterParamsForEncounter.encounterTypeIds = [];
      this.getDataForEncounterLineChart(this.filterParamsForEncounter);
    }
  }

  getDataForEncounterLineChart(filterParamsForEncounter: any) {
    this.encounterGraphService.getLineChartDataForEncounters(filterParamsForEncounter).subscribe((response: ResponseModel) => {
      if (response != null && response.statusCode == 200) {
        this.lineChartDataForEncounters = response.data || []
        // this.viewAppointmentLineGraph();
        if (this.lineChartDataForEncounters && this.lineChartDataForEncounters.length > 0) {
          this.viewEncounterLineGraph();
        } else {
          this.showEncounterGraph = false
        }
      }
      else {
        this.lineChartDataForEncounters = [];
      }
    })
  }
  viewEncounterLineGraph() {
    this.showEncounterGraph = true;
    let EncounterArrayMonth = Array.from(new Set(this.lineChartDataForEncounters.map(x => x.xAxis))).map(xAxis => {
      let x = this.lineChartDataForEncounters.find(x => x.xAxis == xAxis)
      return {
        ...x
      }
    })
    let resultArrayEncounter = Array.from(new Set(this.lineChartDataForEncounters.map(x => x.encounterType))).map(encounterType => {
      return this.lineChartDataForEncounters.find(x => x.encounterType == encounterType).encounterType
    })
    let bgColors = resultArrayEncounter.map(encounterType => {
      return this.lineChartDataForEncounters.find(x => x.encounterType == encounterType).color
    })

    if ((bgColors || []).filter(x => x != null).length > 0) {
      this.lineChartColors_encounter = (bgColors || []).map(c => { return { backgroundColor: c, borderColor: c } });
    }
    this.lineChartLabels_encounters = []
    this.lineChartOptions_encounters = {
      elements:
      {
        point:
        {
          radius: 5,
          hitRadius: 5,
          hoverRadius: 7,
          hoverBorderWidth: 2
        }
      },
      scales: {
        yAxes: [{
          ticks: {
            min: 0,
            precision: 0,
          }
        }],
        xAxes: [
          {
            ticks: {
              fontSize: 10,
            }
          }
        ]
      }

    }
    if (EncounterArrayMonth.length > 0) {
      let sortedMonth = EncounterArrayMonth.sort((a, b) => { return new Date(a.yearNumber).getTime() - new Date(b.yearNumber).getTime() })
      this.lineChartLabels_encounters = sortedMonth.filter(x => (x.xAxis != null)).map(({ xAxis, yearNumber }) => xAxis);
    }
    if (resultArrayEncounter && resultArrayEncounter.length > 0) {
      let newChartEncounterArray = []
      for (let i = 0; i < resultArrayEncounter.length; i++) {
        newChartEncounterArray.push({
          label: resultArrayEncounter[i],
          data: this.lineChartDataForEncounters.filter(x => x.encounterType == resultArrayEncounter[i]).sort((a, b) => { return (a.monthNumber - b.monthNumber) }).map(({ encounterCount }) => parseInt(encounterCount)),
          fill: false,
        })
      }
      this.lineChartData_encounters = [...newChartEncounterArray]
    };
  }
  onEncounterChartClick({ event, active }) {
    if (active.length > 0) {
      const chart = active[0]._chart;
      const activePoints = chart.getElementAtEvent(event);
      if (activePoints.length > 0) {
        // get the internal index of slice in pie chart
        const label = chart.data.labels[activePoints[0]._index];
        let datasetLabel = chart.data.datasets[activePoints[0]._datasetIndex] && chart.data.datasets[activePoints[0]._datasetIndex].label;

        datasetLabel = (datasetLabel || '').split(':')[0].trim();

        let encounterId = (this.masterEncounterTypes || []).find(x => x.value == datasetLabel) && (this.masterEncounterTypes || []).find(x => x.value == datasetLabel).id;
        encounterId = encounterId > 0 ? this.commonService.encryptValue(encounterId, true) : null

        const programObj = (this.lineChartDataForEncounters || []).find(x => x.xAxis == label);
        const startDate = programObj && format(programObj.startDate, 'YYYY-MM-DD'),
          endDate = programObj && format(programObj.endDate, 'YYYY-MM-DD');
        //const startDate = null, endDate = null;

        let cmId, enrollId;
        if ((this.filterParamsForEncounter.CareManagerIds || []).length > 0) {
          cmId = this.filterParamsForEncounter.CareManagerIds.join(',');
          cmId = this.commonService.encryptValue(cmId, true);
        }
        if (this.filterParamsForEncounter.EnrollmentId > 0) {
          enrollId = this.commonService.encryptValue(this.filterParamsForEncounter.EnrollmentId, true);
        }

        this.router.navigate(['/web/encounter'], { queryParams: { id: encounterId, cmId, enrollId, startDate, endDate, nextApp: this.filterParamsForEncounter.nextAppointmentPresent } });
      }
    }
  }
}
