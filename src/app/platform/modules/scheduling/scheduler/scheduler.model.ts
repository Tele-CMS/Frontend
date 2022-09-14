import { ClientProfileModel } from "../../agency-portal/clients/client-profile.model";

export class AppointmentModel {
    'patientAppointmentId': number = 0;
    'appointmentTypeID': number = null;
    'appointmentStaffs': AppointmentStaff[];
    'patientID': number = null;
    'patientName': string = '';
    'serviceLocationID': number = null;
    'officeAddressID': number = null;
    'patientAddressID': number = null;
    'customAddressID': number = null;
    'customAddress': string = '';
    'latitude': number = 0;
    'longitude': number = 0;
    'startDateTime': Date = new Date();
    'endDateTime': Date = new Date();
    'notes': string = '';
    'isTelehealthAppointment': boolean = false;
    'isRecurrence': boolean = false;
    'isClientRequired': boolean = false;
    'isBillableAppointment': boolean = false;
    'isBillable': boolean = false;
    'offset': number = 0;
    'timezone': string = '';
    'isExcludedFromMileage': boolean = false;
    'isDirectService': boolean = false;
    'mileage': number = null;
    'driveTime': string = '';
    // some extra keys ...
    'patientEncounterId': number = 0;
    'parentAppointmentId': number = null;
    'claimId': number = null;
    'cancelTypeId': number = null;
    'statusName': string = '';
    'mode': string = '';
    'type': string = '';
     'PatientInfoDetails':ClientProfileModel = null;
     'patientInfoDetails':ClientProfileModel = null;
     'patientPhotoThumbnailPath':string = '';
}

export class AppointmentStaff {
    'staffId'?: number = 0;
    'isDeleted'?: boolean = false;
    'staffName'?: string = '';
}

export class RecurrenceAppointmentModel {
    'startDateTime': Date = new Date();
    'endDateTime': Date = new Date();
    'startDate': string = '';
    'startTime': string = '';
    'endTime': string = '';
    'message': string = '';
}

export class CancelAppointmentModel {
    'cancelTypeId': number = null;
    'cancelReason': string = '';
    'ids': number[];
}

