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
  style: string = "";
}

export class DashboardModel {
  organizationTotalClients: number;
  onlineUser: number;
  organizationTotalRevenu: any;
  totalAppointments: any;
  todayAppointments: any;
  appointmentNetRevenue: number;
  appointmentTotalRevenue:any;
  todayAppointmentsCount:any;
  totalAppointmentsCount:any;
  todaysAppointmentsAmount:any;
  previousMonthAppointmentsAmount:any;
  totalAppointmentsAmount:any;
}

export class ClientStatusChartModel {
  registeredDate: string;
  active: number;
  inactive: number;
  activeClients: number;
}
