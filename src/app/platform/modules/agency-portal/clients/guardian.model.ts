export class GuardianModel
{
    id: number=null;
    patientID: number;
    guardianFirstName: string="";
    guardianLastName: string="";
    guardianMiddleName: string="";
    guardianHomePhone: string="";
    guardianEmail: string="";
    relationshipID: number=null;
    isGuarantor: boolean=false;
    isActive: boolean=false;
    totalRecords: number=null;
    relationshipName:string=''
}