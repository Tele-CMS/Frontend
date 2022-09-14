import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SoapComponent } from '../agency-portal/encounter/soap/soap.component';
import { VideoCallComponent } from '../agency-portal/encounter/video-call/video-call.component'; 
import { VitalsComponent } from '../client-portal/vitals/vitals.component';
import { SchedulerComponent } from '../scheduling/scheduler/scheduler.component';
import { AssessmentAppointmentComponent } from './assessment-appointment/assessment-appointment.component';
import { CheckInCallComponent } from './check-in/check-in-call.component';
import { MedicationListComponent } from './medication/medication-list/medication-list.component';
import { MedicationModalComponent } from './medication/medication-modal/medication-modal.component';
import { PatientDocumentsComponent } from './patient-documents/patient-documents.component';
import { VitalsListComponent } from './vitals-list/vitals-list.component';
import { WaitingRoomContainerComponent } from './waiting-room-container.component';

const routes: Routes = [
  {
    path: '',
    component: WaitingRoomContainerComponent,
    children:[
        {
            path:"reshedule/:id",
            component:SchedulerComponent
        },
        {
            path:"assessment/:id",
            component:AssessmentAppointmentComponent
        },
        {
            path:"documents/:id",
            component:PatientDocumentsComponent
        },
        {
            path:"vitalslist/:id",
            component:VitalsListComponent
        },
        {
            path:"medication/:id",
            component:MedicationListComponent
        },
        {
          path:"check-in/:id",
          component:CheckInCallComponent
      },
      {
        path: "check-in-soap/:id",
        component: SoapComponent
      },
      {
        path: "check-in-call/:id",
        component: CheckInCallComponent
      },
      {
        path: "check-in-video-call/:id",
        component: VideoCallComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WaitingRoomRoutingModule { }
