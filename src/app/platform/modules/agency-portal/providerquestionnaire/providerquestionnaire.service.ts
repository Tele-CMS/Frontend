import { Injectable } from "@angular/core";
import { CommonService } from "../../core/services";
import { FilterModel } from "../../core/modals/common-model";
import { ActivityCodeModifierUpdateModel, PayerActivityServiceCodeModel, PayerModel, PayerServiceCodeWithModifierModel } from "../payers/payers.model";
import { SwapOrderModel } from "./providerquestionnaire.model";
import { Observable } from "rxjs";
//import { PayerModel, PayerServiceCodeModel, PayerServiceCodeModifierModel, PayerServiceCodeWithModifierModel, PayerActivityServiceCodeModel, ActivityCodeModifierUpdateModel } from "./payers.model";

@Injectable({
    providedIn: 'root'
})

export class ProviderquestionnaireService {
    
    private getMasterDataURL = 'api/MasterData/MasterDataByName';
    private getQuestionnaireControlsByTypeURL = 'Questionnaire/getQuestionnaireControlsByType/';
    private saveProviderQuestionnaireControlURL = 'Questionnaire/SaveProviderQuestionnaireControl/';
    private updateProviderQuestionnaireControlURL = 'Questionnaire/UpdateProviderQuestionnaireControl/';
    private deleteProviderQuestionnaireControlURL = 'Questionnaire/DeleteQuestionnaireControl/';
    private getProvidersQuestionnaireControlsByTypeURL = 'Questionnaire/GetProvidersQuestionnaireControlsByType/';
    private swapQuestionOrderURL = 'Questionnaire/ChangeQuestionnareOrder/';
    private setActiveInactiveURL = 'Questionnaire/SetActiveInactiveControl/';
    
    constructor(private commonService: CommonService) {

    }

    getMasterData(value) {
        return this.commonService.post(this.getMasterDataURL, { masterdata: value });
    }

    getQuestionnaireControlsByType(id:number){
        return this.commonService.get(this.getQuestionnaireControlsByTypeURL+id);
    }

    getProvidersQuestionnaireControlsByType(id:number){
        return this.commonService.get(this.getProvidersQuestionnaireControlsByTypeURL+id);
    }

    saveProviderQuestionnaireControl(model){
        return this.commonService.post(this.saveProviderQuestionnaireControlURL, model);
    }

    updateProviderQuestionnaireControl(model){
        return this.commonService.post(this.updateProviderQuestionnaireControlURL, model);
    }

    swapQuestionOrder(model:SwapOrderModel[]) :Observable<any> {
        return this.commonService.post(this.swapQuestionOrderURL,model);
    }

    deleteProviderQuestionnaireControl(id){
        return this.commonService.delete(this.deleteProviderQuestionnaireControlURL+id);
    }

    setActiveInactiveControl(id,isActive:boolean) :Observable<any>  {
        return this.commonService.get(this.setActiveInactiveURL+id+"/"+isActive);
    }

}