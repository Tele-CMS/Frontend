import {
    Component,
    Inject,
} from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { CancelationRule } from "src/app/platform/modules/agency-portal/Payments/payment.models";

@Component({
    selector: "app-provider-fee-settings",
    templateUrl: "./provider-fee-settings.component.html",
    styleUrls: ["./provider-fee-settings.component.css"],
})
export class ProviderFeeSettingsComponent {

    constructor(
        public dialogPopup: MatDialogRef<ProviderFeeSettingsComponent>,
        @Inject(MAT_DIALOG_DATA) public data: CancelationRule[],
    ) {

    }

    onClose(){
        this.dialogPopup.close();
    }

}
