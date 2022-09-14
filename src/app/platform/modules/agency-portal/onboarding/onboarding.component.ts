import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';

@Component({
    selector       : 'onboarding',
    templateUrl    : './onboarding.component.html',
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class OnboardingComponent
{
    /**
     * Constructor
     */
    constructor()
    {
    }
}
