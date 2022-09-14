import { Injectable } from "@angular/core";
import { CommonService } from "../../core/services";
@Injectable({
    providedIn: 'root'
})

export class ChangePasswordService {
    private updateNewPasswordURL = 'user/UpdateUserPassword';
    constructor(private commonService: CommonService) {
    }
    updateNewPassword(data: any) {
        return this.commonService.patch(this.updateNewPasswordURL, data);
    }
}


