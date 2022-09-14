import { Injectable } from '@angular/core';
import { CommonService } from '../../../core/services';
import { AsyncValidator } from '@angular/forms';
import { Observable } from 'rxjs';
import { OrganizationModel } from './agency-detail.Model';
import { map } from 'rxjs/operators';

@Injectable()
export class AgencyDetailService {
  getAgencyDataURL = '/api/Organization/GetOrganizationDetailsById';

  constructor(private commonService: CommonService) { }

      get(id: number): Observable<OrganizationModel> {
        let url = `${this.getAgencyDataURL}/${id}`;
        return this.commonService.getById(url, {})
            .pipe(map((response: any) => {
                let data = new OrganizationModel();
                if (response.statusCode >= 200 && response.statusCode < 300 && response.statusCode !== 204) {
                    data = response.data;
                }
                return data;
            }))
    }
}
