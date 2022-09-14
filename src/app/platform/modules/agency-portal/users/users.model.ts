import { StaffExperience } from "./../../../../front/doctor-profile/doctor-profile.model";
export class UserModel {
  id: number;
  name: string = "";
  address: string = "";
  city: string = "";
  countryID: number;
  dateJoined: string = "";
  dob: string = "";
  doj: string = "";
  email: string = "";
  firstName: string = "";
  staffName: string = "";
  gender: number;
  isActive: boolean = false;
  isBlock: boolean = false;
  isDeleted: boolean = false;
  lastName: string = "";
  maritalStatus: number;
  middleName: string = "";
  npiNumber: string = "";
  organizationID: number;
  password: string = "";
  phoneNumber: string = "";
  photoPath: string = "";
  photoThumbnailPath: string = "";
  roleID: number;
  roleName: string = "";
  staffID: number;
  stateID: number;
  totalRecords: number;
  userID: number;
  userName: string = "";
  zip: string = "";
  aptNo: string = "";
  taxId: string = "";
  caqhid: string = "";
  language: string = "";
  degreeID: number;
  payrollGroupID: number;
  payRate: number;
  ftFpayRate: number;
  isRenderingProvider: boolean = false;
  isUrgentCare: boolean = false;
  latitude: string = "";
  longitude: string = "";
  apartmentNumber: string = "";
  employeeID: number;
  confirmPassword: string = "";
  staffLocationList: StaffLocation[] = null;
  staffTeamList: StaffTeam[] = null;
  staffTagsModel: StaffTags[] = null;
  staffSpecialityModel: StaffSpeciality[] = null;
  StaffCareCategoryModel: StaffCareCategoryModel[] = null;
  staffTaxonomyModel: StaffTaxonomy[] = null;
  staffServicesModels: StaffServices[] = null;
  locationIds: any = [];
  staffTeamKeys: any = [];
  staffTagsKeys: any = [];
  staffSpecialityKeys: any = [];
  staffCarecategoryKeys:any=[];
  staffTaxonomyKeys: any = [];
  servicesKeys: StaffServices[] = null;
  defaultLocation: number;
  photoBase64: string;
  aboutMe: string;
}
export class UserProfile {
  name: string;
  profileImage: string;
  gender: string;
  dob: string;
  address: string;
  phone: string;
}
export class StaffLocation {
  id: number;
  isDefault: boolean = false;
}
export class StaffTeam {
  id: number;
  staffid: number;
  staffteamid: number;
  isdeleted: boolean = false;
}
export class StaffTags {
  id: number;
  staffID: number;
  tagID: number;
  isDeleted: boolean = false;
}
export class StaffSpeciality {
  id: number;
  staffID: number;
  specialityID: number;
  isDeleted: boolean = false;
}

export class StaffCareCategoryModel{
  id: number;
  staffID: number;
  healthcarecategoryID: number;
  isDeleted: boolean = false;
}

export class StaffTaxonomy {
  id: number;
  staffID: number;
  taxonomyID: number;
  isDeleted: boolean = false;
}
export class StaffServices {
  id: number;
  staffID: number;
  serviceId: number;
  isDeleted: boolean = false;
}
export class StaffAssignedLocationModel {
  id: number;
  value: string;
  staffLocationId: number;
  locationName: string;
  staffId: number;
  isDefault: true;
}

export class StaffLeaveModel {
  id: number;
  staffId: number;
  staffName: string;
  leaveType: string;
  leaveTypeId: number;
  leaveReason: string;
  leaveReasonId: number;
  fromDate: string;
  toDate: string;
  description: string;
  leaveStatusId: number;
  leaveStatus: string;
}

export class StaffPayrollRateModel {
  id: number;
  staffId: number;
  appointmentTypeId: number;
  payRate: number;
  appointmentName: string;
  totalRecords: number;
}
export class UserDocumentModel {
  id: number;
  userId: number;
  documentTitle: string;
  url: string;
  documentTypeIdStaff: number;
  documentTypeNameStaff: string;
  expiration: Date;
  extenstion: string;
  otherDocumentType: string;
  createdDate: Date;
  key: string;
  isActive:boolean;
}
export class AddUserDocumentModel {
  base64: any[];
  documentTitle: string;
  documentTypeIdStaff: number;
  expiration: string;
  key: string; 
  otherDocumentType: string;
  userId: number;
  //isProviderEducationalDocument:boolean;
}

export class AddUserDocumentPatientModel {
  base64: any[];
  documentTitle: string;
  documentTypeId: number;
  expiration: string;
  key: string;
  otherDocumentType: string;
  userId: number;
}

export class StaffProfileModel {
  staffId: number;
  email: string;
  firstName: string;
  lastName: string;
  middleName: string;
  photoPath: string;
  photoThumbnailPath: string;
  npiNumber: string;
  taxId: string;
  doj: string;
  phoneNumber: string;
  staffFullAddress: string;
  gender: string;
  userId: number;
  degreeName: string;
  staffTags: StaffTagModel[] = [];
  staffLocations: StaffLocationModel[] = [];
  staffSpecialities: StaffProfileSpecialityModel[] = [];
  staffTaxonomies: StaffProfileTaxonomyModel[] = [];
  staffServices: StaffServicesModel[] = [];
}
export class StaffServicesModel {
  serviceName: string;
}
export class StaffLocationModel {
  isDefault: boolean;
  locationDescription: string;
  locationName: string;
  stateName: string;
  locationFullAddress: string;
}

export class StaffTagModel {
  tag: string;
  colorCode: string;
  colorName?: string;
  fontColorCode: string;
}
export class StaffProfileSpecialityModel {
  Speciality: string;
  SpecialityValue: string;
}
export class StaffProfileTaxonomyModel {
  Taxonomy: string;
  TaxonomyValue: string;
}
export class AddProviderEducationalDocumentModel {
  base64: any[];
  documentTitle: string;
  documentTypeIdStaff: number;
  expiration: string;
  key: string; 
  otherDocumentType: string;
  userId: number;
  isProviderEducationalDocument:boolean;
}

export class FileViewModel{
  blob: Blob;
  filetype: string;
  fileUrl: string;
}