export interface HeaderModel {  
    activeStatus: boolean
    category: string
    duration: number
    header: string;
    headerDescription: string;
    headerImage: string;
    headerVideo: string;
    userId: number;
    id: number;
    isImage: number;
    organizationId: number;
    tenantId: number;
    totalSteps: number; 
}

export interface SectionModel{
    title: string;
    shortDescription: string;
    description: string;
    organizationId: number;
    tenantId: number;
    order: number;
    onboardingHeaderId: number;
    id: number;
}