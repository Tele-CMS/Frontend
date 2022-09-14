import { Injectable } from "@angular/core";
import { CommonService } from "../../../core/services";

@Injectable({
    providedIn: 'root'
})

export class RolePermissionService {
    private getMasterDataByNameURL = 'api/MasterData/MasterDataByName';
    private getRolePermissionsURL='api/RolePermission/GetRolePermissions';
    private saveRolePermissionsURL='api/RolePermission/SaveRolePermissions';
    constructor(private commonService: CommonService) {
    }
    create(permissions:any)
    {
     return this.commonService.post(this.saveRolePermissionsURL,permissions)    
    }
    getMasterData(value:string='') {
        return this.commonService.post(this.getMasterDataByNameURL, {masterdata: value});
    }
    getRolePermissions(roleId:number=0)
    {
        let url=this.getRolePermissionsURL+'?roleId='+roleId;
        return this.commonService.getAll(url, {});
    }
}