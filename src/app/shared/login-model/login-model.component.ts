import { Component, OnInit, ViewEncapsulation, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";

@Component({
  selector: "app-login-model",
  templateUrl: "./login-model.component.html",
  styleUrls: ["./login-model.component.css"],
  encapsulation: ViewEncapsulation.None
})
export class LoginModelComponent implements OnInit {
  // profileTabs: any = ["Agency", "Client"];
  //profileTabs: any = ["Provider", "Client"];           //Agencyremove
  profileTabs: any = ["Client"];
  selectedIndex: number = 0;
  
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogModalRef: MatDialogRef<LoginModelComponent>
  ) {
    dialogModalRef.disableClose = true;
    if (this.data != null && this.data != "" && this.data != undefined)
      if (
        this.data.selectedIndex != null &&
        this.data.selectedIndex != "" &&
        this.data.selectedIndex != undefined
      )
        this.selectedIndex = this.data.selectedIndex;
  }

  ngOnInit() {}
  loadComponent(eventType: any): any {
    this.selectedIndex = eventType.index;
  }
  closeDialog(action: any): void {
    this.dialogModalRef.close(action);
  }
}
