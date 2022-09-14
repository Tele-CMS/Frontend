export class SetReminderModal {
   webRootUrl: string;
    sessionId: number;
    appointmentId: number;
    staffId: number;
    cancelationRules : CancelationRule[] =[];
  }

  export class CancelationRule {
    hour: number;
    reminderDateTime: string;
}