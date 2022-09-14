export class StaffAward {
  id: string;
  awardType: string;
  description: string;
  awardDate: string;
  isDeleted: boolean;
}

export class StaffExperience {
  id: string = "";
  organizationName: string = "";
  startDate: string;
  endDate: string;
  totalExperience: string = "0";
  isDeleted: boolean = false;
}

export class StaffQualification {
  id: string;
  course: string;
  university: string;
  startDate: string;
  endDate: string;
  isDeleted: boolean;
}
