import { Injectable } from '@angular/core';
import { CommonService } from '../../../core/services';
import { Observable } from 'rxjs';
import { UserRoleModal } from './user-role.modal';
import { map } from 'rxjs/operators';
import { FilterModel } from '../../../core/modals/common-model';

@Injectable({
  providedIn: 'root'
})
export class UserRoleService {

  createURL = '/UserRole/SaveRole';
  deleteURL = '/UserRole/DeleteRole';
  getURL = '/UserRole/GetRoleById';
  getAllURL = 'UserRole/GetRoles';
  checkIfExistUrl= '/CheckIfRecordExists';

  constructor(private commonService: CommonService) { }

  validate(postData: any) {
    return this.commonService.post(this.checkIfExistUrl, postData);
  }
  create(modalData: UserRoleModal): Observable<UserRoleModal> {
    return this.commonService.post(this.createURL, modalData)
      .pipe(map((response: any) => {
        let data = response;
        return data;
      }))
  }
  delete(id: number) {
    return this.commonService.patch(`${this.deleteURL}?id=${id}`, {})
  }
  get(id: number): Observable<UserRoleModal> {
    let url = `${this.getURL}?id=${id}`;
    return this.commonService.getById(url, {})
      .pipe(map((response: any) => {
        let data = new UserRoleModal();
        if (response.statusCode >= 200 && response.statusCode < 300 && response.statusCode !== 204) {
          data = response.data;
        }
        return data;
      }))
  }
  getAll(filterModal: FilterModel) {
    let url = this.getAllURL + '?pageNumber=' + filterModal.pageNumber + '&pageSize=' + filterModal.pageSize + '&sortColumn=' + filterModal.sortColumn + '&sortOrder=' + filterModal.sortOrder + '&searchText=' + filterModal.searchText;
    return this.commonService.getAll(url, {});
  }

  getUserScreenActionPermissions(moduleName: string, screenName: string): any {
    return this.commonService.getUserScreenActionPermissions(moduleName, screenName);
}
}
