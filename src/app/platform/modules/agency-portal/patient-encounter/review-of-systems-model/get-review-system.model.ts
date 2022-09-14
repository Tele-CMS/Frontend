export class GetReviewSystemModel{
    emp_id: number = null;
    encounter_id: number = null;
}

export class SaveReviewSysterModel{
    patient_id: number = null;
    encounter_id: number = null;
    user_id: number = null;
    system_review: any = [];
}