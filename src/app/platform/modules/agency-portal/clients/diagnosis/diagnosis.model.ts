export class DiagnosisModel {
  id: number;
  icdid: number;
  patientID: number;
  diagnosisDate: Date;
  isActive: boolean = true;
  isPrimary: boolean;
  resolveDate: string;
  isDeleted: boolean;
  diagnosis: string;
  linkedEncounterId : any;
  code: any;
}


export class PatientEncounterNotesModel {
  id: number;
  StaffId: number;
  patientID: number;
  AppointmentID: number;
  encounterNotes: string;
}
