import { Injectable } from "@angular/core";
import { CommonService } from "../../core/services";
import { isatty } from "tty";
@Injectable({
    providedIn: 'root'
})

export class ClientListingService {
    private getPatientsURL = 'Patients/GetPatients';
    private getMasterDataByNameURL = 'api/MasterData/MasterDataByName';
    constructor(private commonService: CommonService) {
    }
    getPatients(searchKey:string,locationId:number,isActive:boolean)
    {
        let url=this.getPatientsURL+"?LocationIDs="+locationId+"&searchKey="+searchKey+(isActive==undefined?'':"&isActive="+isActive);
        return this.commonService.getAll(url,{}, false);
    }

    getMasterData(value: string = '') {
        return this.commonService.post(this.getMasterDataByNameURL, { masterdata: value });
    }
}