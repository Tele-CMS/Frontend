export interface Category
{
    id?: string;
    title?: string;
    slug?: string;
}

export interface Section
{
    id?: string;
    title?: string;
    slug?: string;
    image?: string;
    video?: string;
    description?: string;
    category?: string;
    duration?: number;
    steps?: {
        order?: number;
        title?: string;
        subtitle?: string;
        content?: string;
    }[];
    totalSteps?: number;
    updatedAt?: number;
    featured?: boolean;
    progress?: {
        currentStep?: number;
        completed?: number;
    };
}

export class CreateOrEditOnboardingHeaderDto {
    header!: string | undefined;
    headerDescription!: string | undefined;
    headerImage!: string | undefined;
    headerVideo!: string | undefined;
    activeStatus!: boolean;
    organizationId!: number | undefined;
    tenantId!: number | undefined;
    category!: string | undefined;
    userId!: number | undefined;
    id!: number | undefined;
  }
  export class CreateOrEditOnboardingDetailDto {
    title!: string | undefined;
    shortDescription!: string | undefined;
    description!: string | undefined;
    organizationId!: number | undefined;
    tenantId!: number | undefined;
    onboardingHeaderId!: number | undefined;
    id!: number | undefined;
  }