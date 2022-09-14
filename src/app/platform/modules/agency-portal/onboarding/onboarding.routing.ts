import { Route } from '@angular/router';
import { OnboardingComponent } from './onboarding.component';
import { OnboardingListComponent } from './list/list.component';
import { OnboardingDetailsComponent } from './details/details.component';
import { OnboardingCategoriesResolver, OnboardingSectionResolver, OnboardingSectionsResolver } from './onboarding.resolvers';

export const onboardingRoutes: Route[] = [
    {
        path     : '',
        component: OnboardingComponent,
        resolve  : {
            categories: OnboardingCategoriesResolver
        },
        children : [
            {
                path     : '',
                pathMatch: 'full',
                component: OnboardingListComponent,
                resolve  : {
                    sections: OnboardingSectionsResolver
                }
            },
            {
                path     : 'section',
                component: OnboardingDetailsComponent,
                 
            }
        ]
    }
];
