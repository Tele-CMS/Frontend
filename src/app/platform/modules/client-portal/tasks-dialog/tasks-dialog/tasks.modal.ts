export class TaskModal {
    id: number = 0;
    assignedBy: string;
    assignedDate: string;
    dueDate: string;
    assignedPatientId: number;
    assignedPatientName: string;
    assignedStaffId: number;
    carePlan: string;
    description: string;
    patientRisk: string;
    priorityId: number;
    masterTaskTypeId: number;
    taskType: number;
    priorityLevel: number;
    patientId: number;
    associatedCareGapId: number;
    patientTaskStatus: boolean;
    patientTaskUpdatedDate: string;
    assignedCareManagerId: number;
    careManagerTaskStatus: boolean;
    overallTaskStatus: boolean;
    key:string
    statusId:number
}