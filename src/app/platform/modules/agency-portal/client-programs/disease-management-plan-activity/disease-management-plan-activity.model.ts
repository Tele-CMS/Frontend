export class PatientQuestionnaireAggregatedResponse {
  questionnaire: string;
  diseaseManagmentProgram: string;
  qScore: number;
  risk: string;
}
export class PatientDiseaseManagementProgramActivity {
  diseaseManagementPlanPatientActivityId: number;
  diseaseManagementProgramActivityId?: number;
  diseaseManageProgramId?: number;
  descriptions?: string;
  activityType?: string;
  frequency?: number;
  frequencyValue?: number;
  frequencyDescription?: string;
  value?: number;
  patientEnrollmentNeeded?: boolean;
  assignActivityToPatient?: boolean;
  sign: number;
  goalResultValue: string;
  activityUnitTypeId: number;
  patientDiseaseManagementProgramActivityNotifications?: PatientDiseaseManagementProgramActivityNotification[]
}
export class PatientDiseaseManagementProgramActivityNotification {
  diseaseManagmentPlanPatientActivityNotificationId?: number;
  diseaseManagmentPlanPatientActivityId?: number;
  diseaseManagementProgramActivityId: number;
  Message?: string;
  notificationFrequency?: string;
  notificationTypeId?: number;
  notificationFrequencyValue?: number;
  isDeleted?: boolean = false;
  sign?: string = null;
}
export class DailyDiaryModel {
  id: number;
  diseaseManagementPlanPatientActivityId: number;
  value: string;
  loggedDate: string;
  totalRecords: number;
}