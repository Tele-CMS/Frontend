import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of , throwError } from 'rxjs';
import { map, switchMap, tap } from "rxjs/operators";
import { Category, Section } from './onboarding.types';
import { CommonService } from '../../core/services/common.service';

@Injectable({
    providedIn: 'root'
})




export class OnboardingService
{
    // Private
    private _categories: BehaviorSubject<Category[] | null> = new BehaviorSubject(null);
    private _section: BehaviorSubject<Section | null> = new BehaviorSubject(null);
    private _sections: BehaviorSubject<Section[] | null> = new BehaviorSubject(null);

    /**
     * Constructor
     */
     constructor(private _httpClient: HttpClient)
     {
     }
    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Getter for categories
     */
    get categories$(): Observable<Category[]>
    {
        return this._categories.asObservable();
    }

    /**
     * Getter for sections
     */
    get sections$(): Observable<Section[]>
    {
        return this._sections.asObservable();
    }

    /**
     * Getter for section
     */
    get section$(): Observable<Section>
    {
        return this._section.asObservable();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Get categories
     */
    getCategories(): Observable<Category[]>
    {
        return;
    }

    /**
     * Get sections
     */
    getSections(): Observable<Section[]>
    {
        return;
    }

    /**
     * Get section by id
     */
    getSectionById(id: string): Observable<Section>
    {
        return;
    }
}
