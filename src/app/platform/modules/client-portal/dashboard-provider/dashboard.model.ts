export class EncounterModel {
  id: number;
  clientId: number;
  staffName: string;
  clientName: string;
  patientAppointmentId: number;
  day: string;
  dateOfService: string;
  status: string;
  totalRecords: number;
  isBillableEncounter: boolean;
  locationName: string;
  serviceType: string;
  billableEncounterColorCode: string;
}
export class AuthorizationModel {
  authorizationId: number;
  clientId: number;
  clientName: string;
  endDate: string;
  remainedUnits: string;
  totalRecords: number;
  warningColorCode: string;
  style: string = ''
}
export class DashboardModel {
  totalClients?: number = 0;
  totalUsers?: number = 0;
  totalAppointments?: number = 0;
  totalComplianceGaps?: number = 0;
  totalCareGaps?: number = 0;
  totalHRA?: number = 0;
}
export class ClientStatusChartModel {
  registeredDate: string;
  active: number;
  inactive: number;
  activeClients: number;
}
export class PatientDocumentModel {
  id: number;
  documentId: number;
  documentName: string;
  patientName: string;
  patientId: number;
  assignedBy: string;
  status: string;
  createdDate: Date;
  totalRecords: number;
}
export class PendingPatientAppointmentModel {
  patientAppointmentId:number;
  statusIdtatusId: number;
  appointmentType: string;
  fullName: string;
  statusName: string;
}