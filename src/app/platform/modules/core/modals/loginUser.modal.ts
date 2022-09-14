import { NotificationsModel } from "../../../../shared/models";

export interface LoginUser {
  access_token: string;
  appConfigurations?: Array<any>;
  data: any;
  expires_in: number;
  firstTimeLogin: boolean;
  notifications?: NotificationsModel;
  passwordExpiryStatus?: any;
  statusCode: number;
  userLocations?: Array<any>;
  userPermission?: any;
  patientData?: any;
}

export class ProfileSetupModel {
  isProfileSetup: number = 0;
  basicProfile: number = 0;
  staffAvailability: number = 0;
  staffExperiences: number = 0;
  staffQualifications: number = 0;
  staffAwards: number = 0;
  staffTaxonomies: number = 0;
  staffLocation: number = 0;
  staffServices: number = 0;
  staffSpecialities: number = 0;
}

export class LoggedInUserModel{
  roleId:number;
  staffId:number;
  userType: string;
}
