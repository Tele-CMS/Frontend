export class SymptomCheckerModel {
    id: string;
    value: string;
}
export class evidence {
    source: string;
    id: string;
    choice_id: string;
}
export enum observationEnum {
    emergency_ambulance = 'The reported symptoms are very serious and the patient may require emergency care. The patient should call an ambulance right now',
    emergency = 'The reported evidence appears serious and the patient should go to an emergency department. If the patient cannot get to the nearest emergency department, he/she should call an ambulance',
    consultation_24 = 'You should see a doctor within 24 hours. If the symptoms suddenly get worse, the patient should go to the nearest emergency department',
    consultation = 'You may require medical evaluation and may need to schedule an appointment with a doctor. If symptoms get worse, the patient should see a doctor immediately',
    self_care = 'A medical consultation is advised but not strictly required; the patient should observe their symptoms and consult a doctor if symptoms worsen within 24 hours'
}