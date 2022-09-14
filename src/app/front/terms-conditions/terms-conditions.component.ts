
import { AfterViewInit, Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { MatDialogRef } from "@angular/material";
import { HomeHeaderComponent } from "src/app/front/home-header/home-header.component";

@Component({
  //providers: [HomeHeaderComponent],
  selector: "app-terms-conditions",
  templateUrl: "./terms-conditions.component.html",
  styleUrls: ["./terms-conditions.component.css"],
  encapsulation: ViewEncapsulation.None
})
export class TermsConditionModalComponent implements OnInit{
   
    constructor(private dialogModalRef: MatDialogRef<TermsConditionModalComponent>){

    }
    ngOnInit() {}

    closeDialog(action: any): void {
        this.dialogModalRef.close(action);
      }
}
