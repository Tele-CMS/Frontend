export class ImmunizationModel {
    id: number;
    patientID: number;
    orderBy: number;
    vfcid: number;
    administeredDate: Date;
    immunization: number;
    amountAdministered: number;
    manufactureID: number;
    expireDate: Date;
    vaccineLotNumber: string;
    administrationSiteID: number;
    routeOfAdministrationID: number;
    administeredBy: number;
    immunityStatusID: number;
    rejectedImmunization: boolean;
    rejectionReasonID:number;
    rejectionReasonNote: string;
    isDeleted: boolean;
    vaccineName: string;
    routeOfAdministration: string;
    administrationSite: string;
    conceptName: string;
    linkedEncounterId: number;
}
