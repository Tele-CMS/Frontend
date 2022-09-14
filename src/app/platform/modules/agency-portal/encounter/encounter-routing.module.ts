import { ThankYouComponent } from "./thank-you/thank-you.component";
import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { SoapComponent } from "./soap/soap.component";
// import { NonBillableSoapComponent } from "./NoteTab/non-billable-soap/non-billable-soap.component";
import { VideoCallComponent } from "./video-call/video-call.component";
import { NoteTabComponent } from "./NoteTab/note-tab.component";

const routes: Routes = [
  {
    path: "soap",
    component: SoapComponent
  },
  {
    path: "non-billable-soap",
    component: NoteTabComponent
  },
  {
    path: "video-call",
    component: VideoCallComponent
  },
  {
    path: "thank-you",
    component: ThankYouComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EncounterRoutingModule {}
