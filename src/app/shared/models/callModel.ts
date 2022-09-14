export class CallInitModel {
  CallStatus: number = 0;
  AppointmentId: number = 0;
}
export enum CallStatus {
  NoCall = 0,
  Started = 1,
  Picked = 2,
  Declined = 3,
  Over = 4,
}

export class UrgentCareProviderActionInitModel { 
  AppointmentId: number = 0;
}
