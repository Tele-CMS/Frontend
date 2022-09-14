export class VitalModel {
id?: number;
patientID: number;
bpDiastolic: number;
bpSystolic: number;
heightIn: number;
weightLbs: number;
heartRate: number;
pulse: number;
respiration: number;
bmi: number;
temperature: number;
vitalDate: Date;
totalRecords: number;
//Custom display keys
displayheight:string;
displayBP:string;
linkedEncounterId: any;
}
