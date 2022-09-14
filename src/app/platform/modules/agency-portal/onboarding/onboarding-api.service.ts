import { Injectable } from '@angular/core';
import { CommonService } from '../../core/services/common.service';
import { CreateOrEditOnboardingDetailDto, CreateOrEditOnboardingHeaderDto } from './onboarding.types';

@Injectable({
  providedIn: 'root'
})



export class OnboardingApiService {

   //Header
   private getOnboardingHeaderForViewURL = 'OnboardingHeader/GetOnboardingHeaderForView';
   private getOnboardingHeaderForEditURL = 'OnboardingHeader/GetOnboardingHeaderForEdit';
   private createOrEditURL = 'OnboardingHeader/CreateOrEdit';
   private deleteURL = 'OnboardingHeader/Delete';
   private getAllByCategoryURL = 'OnboardingHeader/GetAllByCategory';
   private getAllWithoutPaginationURL = 'OnboardingHeader/GetAllWithoutPagination';


   //Details
   private getOnboardingDetailForViewURL = 'OnboardingDetail/GetOnboardingDetailForView';
   private getOnboardingDetailForEditURL = 'OnboardingDetail/getOnboardingDetailForEdit';
   private createOrEditDetailsURL = 'OnboardingDetail/CreateOrEdit';
   private deleteDetailsURL = 'OnboardingDetail/Delete';
   private getAllByHeaderIdURL = 'OnboardingDetail/GetAllByHeaderId';











   /**
    * Constructor
    */
   constructor(
       private commonService: CommonService)
   {
   }

   //Header
   getOnboardingHeaderForView(Id: number) {
     debugger
     let url = this.getOnboardingHeaderForViewURL + "?id=" + Id;
       return this.commonService.getById(url, {});
   }

   getOnboardingHeaderForEdit(Id: number) {
    let url = this.getOnboardingHeaderForEditURL + "?id=" + Id;
       return this.commonService.getById(url, {});
   }

   createOrEdit(body: CreateOrEditOnboardingHeaderDto) {
     debugger
       return this.commonService.post(this.createOrEditURL, body);
   }

   delete(Id: number) {
    let url = this.deleteURL + "?id=" + Id;
       return this.commonService.patch(url, {});
   }
   getAllByCategory(category: string) {
       return this.commonService.getById(this.getAllByCategoryURL + '/' + category, {});
   }

   getAllWithoutPagination() {
       return this.commonService.getAll(this.getAllWithoutPaginationURL,{});
   }

   //common
   getUserScreenActionPermissions(moduleName: string, screenName: string): any {
    return this.commonService.getUserScreenModulePermissions(moduleName, screenName);
}

   //Details
   getOnboardingDetailForView(Id: number) {
    let url = this.getOnboardingDetailForViewURL + "?id=" + Id;
       return this.commonService.getById(url, {});
   }

   getOnboardingDetailForEdit(Id: number) {
    let url = this.getOnboardingDetailForEditURL + "?id=" + Id;
       return this.commonService.getById(url , {});
   }

   createOrEditDetails(body: CreateOrEditOnboardingDetailDto) {
       return this.commonService.post(this.createOrEditDetailsURL, body);
   }

   deleteDetails(Id: number) {
    let url = this.deleteDetailsURL + "?id=" + Id;
       return this.commonService.patch(url, {});
   }

   getAllByHeaderId(Id: number) {
    let url = this.getAllByHeaderIdURL + "?id=" + Id;
       return this.commonService.getById(url, {});
   }
}
