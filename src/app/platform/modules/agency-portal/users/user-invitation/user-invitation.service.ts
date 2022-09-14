import { Injectable } from '@angular/core';
import { CommonService } from '../../../core/services';
import { Observable } from 'rxjs';
import { FilterModel } from '../../../core/modals/common-model';

@Injectable({
  providedIn: 'root'
})
export class UserInvitationService {
  filterModel:FilterModel;
  private userInvitationListingUrl="UserInvitation/GetUserInvitations";
  private userInvitationByIdUrl="UserInvitation/GetUserInvitation/";
  private sendUrl="UserInvitation/SendInvitation";
  private deleteURL = "UserInvitation/DeleteInvitation/";
  constructor(
    private commonService:CommonService
  ) { 
    this.filterModel=new FilterModel();
  }
  getAllUserInvitedListing(filterModel):Observable<any> {
    return this.commonService.post(this.userInvitationListingUrl,filterModel);
  }
  getUserInvitationById(id: number):Observable<any> {
    return this.commonService.getById(this.userInvitationByIdUrl+ id,{});
  }
  setPaginatorModel(filterModel : any, pageNumber: number, pageSize: number, sortColumn: string, sortOrder: string, searchText: string) {
    this.filterModel.pageNumber = pageNumber;
    this.filterModel.pageSize = pageSize;
    this.filterModel.sortOrder = sortOrder;
    this.filterModel.sortColumn = sortColumn;
    this.filterModel.searchText = searchText;
    return filterModel;
  }
  send(data: any) {
    const webUrl = window.location.origin;
    data.WebUrl=`${webUrl}`;
    if (data.invitationId != undefined && data.invitationId > 0)
        return this.commonService.put(this.sendUrl + "/" + data.invitationId, data);
    else
        return this.commonService.post(this.sendUrl, data);
  }
  deleteInvitation(id: number) {
    return this.commonService.put(this.deleteURL  + id, {});
  }
  
}
