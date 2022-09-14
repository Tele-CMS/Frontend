import { Injectable } from "@angular/core";
import { CommonService } from "../../core/services";
import { FilterModel } from "../../core/modals/common-model";
import { ActivityCodeModifierUpdateModel, PayerActivityServiceCodeModel, PayerModel, PayerServiceCodeWithModifierModel } from "../payers/payers.model";
//import { PayerModel, PayerServiceCodeModel, PayerServiceCodeModifierModel, PayerServiceCodeWithModifierModel, PayerActivityServiceCodeModel, ActivityCodeModifierUpdateModel } from "./payers.model";

@Injectable({
    providedIn: 'root'
})

export class KeywordService {
    // private getPayersListURL = 'Payers/GetPayerList';
    // private getPayerByIdURL = 'Payers/GetPayerDataById';
    // private getMasterDataByNameURL = 'api/MasterData/MasterDataByName';
    // private savePayerURL = "Payers/SavePayerData";
    // private deletePayerURL = 'Payers/DeletePayerData';

    // //Payer Service Codes URL
    // private getPayerServiceCodesURL = "api/PayerServiceCodes/PayerOrMasterServiceCodes";
    // private savePayerServiceCodesURL = "api/PayerServiceCodes/SavePayerServiceCodes";
    // private deletePayerServiceCodesURL = "api/PayerServiceCodes/DeletePayerServiceCodes";
    // private getPayerServiceCodeByIdURL = "api/PayerServiceCodes/GetPayerServiceCodeById";
    // private savePayerServiceCodeURL = "api/PayerServiceCodes/SavePayerServiceCode";
    // private getUnMappedCodesForPayerURL = "api/PayerServiceCodes/GetMasterServiceCodeEx";
    // private getMasterServiceCodeByIdURL = "api/MasterServiceCodes/GetMasterServiceCodeById";

    // //Payer Activities
    // private getPayerActivitiesURL = "PayersActivity/GetActivities";
    // private getPayerActivityServiceCodesURL = "PayersActivity/GetPayerActivityServiceCodes";
    // private getMasterActivitiesForPayerURL = "PayersActivity/GetMasterActivitiesForPayer";
    // private getExcludedServiceCodesForActivityURL = "PayersActivity/GetExcludedServiceCodesFromActivity";
    // private getActivityServiceCodeDetailByIdURL = "PayersActivity/GetPayerActivityServiceCodeDetailsById";
    // private updatePayerActivityModifiersURL = "PayersActivity/UpdatePayerActivityModifiers";
    // private savePayerActivityCodeURL = "PayersActivity/SavePayerActivityCode";
    // private deletePayerActivityCodeURL = "PayersActivity/DeletePayerActivityCode"

    constructor(private commonService: CommonService) {
    }

    // savePayer(payerModel: PayerModel) {
    //     return this.commonService.post(this.savePayerURL, payerModel);
    // }
    // getPayersList(filterModel: FilterModel) {
    //     let url = this.getPayersListURL + "?pageNumber=" + filterModel.pageNumber + "&pageSize=" + filterModel.pageSize + "&sortColumn=" + filterModel.sortColumn + "&sortOrder=" + filterModel.sortOrder + "&searchText=" + filterModel.searchText;
    //     return this.commonService.getAll(url, {});
    // }

    // getMasterData(value: string = '') {
    //     return this.commonService.post(this.getMasterDataByNameURL, { masterdata: value });
    // }
    // getPayerById(Id: number) {
    //     return this.commonService.getById(this.getPayerByIdURL + "/" + Id, {});
    // }

    // deletePayer(Id: number) {
    //     return this.commonService.patch(this.deletePayerURL + '/' + Id, {});
    // }

    // //Payer Service Codes method
    // getPayerServiceCodes(payerId: number, filterModel: FilterModel) {
    //     let url = this.getPayerServiceCodesURL + "?pageNumber=" + filterModel.pageNumber + "&pageSize=" + filterModel.pageSize + "&PayerId=" + payerId + "&sortColumn=" + filterModel.sortColumn + "&sortOrder=" + filterModel.sortOrder + "&SearchText=" + filterModel.searchText;
    //     return this.commonService.getAll(url, {});
    // }

    // savePayerServiceCodes(data: Array<PayerServiceCodeWithModifierModel>) {
    //     return this.commonService.post(this.savePayerServiceCodesURL, data);
    // }

    // deletePayerServiceCodes(id: number) {
    //     return this.commonService.patch(this.deletePayerServiceCodesURL + "?payerServiceCodeId=" + id, {});
    // }
    // getPayerServiceCodeById(id: number) {
    //     return this.commonService.getById(this.getPayerServiceCodeByIdURL + "?payerServiceCodeId=" + id, {});
    // }
    // savePayerServiceCode(payerServiceCode: PayerServiceCodeWithModifierModel) {
    //     return this.commonService.post(this.savePayerServiceCodeURL, payerServiceCode);
    // }

    // getUnMappedCodesForPayer(payerId: number) {
    //     return this.commonService.getById(this.getUnMappedCodesForPayerURL + "?PayerId" + payerId, {});
    // }
    // getMasterServiceCodeById(serviceCodeId: number) {
    //     return this.commonService.getById(this.getMasterServiceCodeByIdURL + "?serviceCodeId=" + serviceCodeId, {});
    // }

    // //Payer Activity Methods
    // getPayerActivites(payerId: number, filterModel: FilterModel) {
    //     let url = this.getPayerActivitiesURL + "?pageNumber=" + filterModel.pageNumber + "&pageSize=" + filterModel.pageSize + "&payerId=" + payerId + "&sortColumn=" + filterModel.sortColumn + "&sortOrder=" + filterModel.sortOrder + "&SearchText=" + filterModel.searchText;
    //     return this.commonService.getAll(url, {});
    // }

    // getPayerActivityServiceCodes(payerId: number, activityId: number, filterModel: FilterModel) {
    //     let url = this.getPayerActivityServiceCodesURL + "?pageNumber=" + filterModel.pageNumber + "&pageSize=" + filterModel.pageSize + "&PayerId=" + payerId + "&ActivityId=" + activityId + "&sortColumn=" + filterModel.sortColumn + "&sortOrder=" + filterModel.sortOrder + "&SearchText=" + filterModel.searchText;
    //     return this.commonService.getAll(url, {});
    // }

    // getMasterActivitiesForPayer(payerId: number) {
    //     return this.commonService.getById(this.getMasterActivitiesForPayerURL + "?PayerId=" + payerId, {});
    // }

    // getExcludedServiceCodesForActivity(payerId: number, activityId: number) {
    //     let url = this.getExcludedServiceCodesForActivityURL + "?PayerId=" + payerId + "&ActivityId=" + activityId;
    //     return this.commonService.getAll(url, {});
    // }
    // getActivityServiceCodeDetailById(payerAppointmentTypeId: number, payerServiceCodeId: number) {
    //     let url = this.getActivityServiceCodeDetailByIdURL + "?payerAppointmentTypeId=" + payerAppointmentTypeId + "&payerServiceCodeId=" + payerServiceCodeId;
    //     return this.commonService.getAll(url, {});
    // }
    // deletePayerActivityCode(id: number) {
    //     return this.commonService.patch(this.deletePayerActivityCodeURL + "?id=" + id, {});
    // }
    // savePayerActivityCode(payerServiceCodeModel: PayerActivityServiceCodeModel) {
    //     return this.commonService.post(this.savePayerActivityCodeURL, payerServiceCodeModel);
    // }
    // updatePayerActivityModifiers(modifierUpdateModel: ActivityCodeModifierUpdateModel) {
    //     return this.commonService.patch(this.updatePayerActivityModifiersURL, modifierUpdateModel);
    // }

    // getUserScreenActionPermissions(moduleName: string, screenName: string): any {
    //     return this.commonService.getUserScreenActionPermissions(moduleName, screenName);
    // }
}