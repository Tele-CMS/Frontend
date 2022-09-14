import { Injectable } from '@angular/core';
import { CommonService } from '../../../core/services';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class UserTimeSheetService {

    constructor(private commonService: CommonService) { }


    getMasterData(masterData: any): Observable<any> {
        return this.commonService.post('api/MasterData/MasterDataByName', masterData);
    }
}
