export class MedicationModel {
    id: number;
    patientId: number;
    medicine: string;
    dose: string;
    strength: string;
    startDate: Date;
    endDate: Date;
    frequencyID:number;
    linkedEncounterId: number;
}
export class FilterModel {
    pageNumber: number = 1;
    pageSize: number = 5;
    sortColumn: string = "";
    sortOrder: string = "";
    searchText: string = "";
  }
