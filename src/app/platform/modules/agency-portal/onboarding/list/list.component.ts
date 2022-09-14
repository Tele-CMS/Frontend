import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Injector, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSelectChange } from '@angular/material/select';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { BehaviorSubject, combineLatest, Subject } from 'rxjs'; 
import { OnboardingService } from '../onboarding.service';
import { Category, Section } from '../onboarding.types';
import { takeUntil } from 'rxjs/operators';
import { AddHeaderModalComponent } from '../modals/add-header-modal/add-header-modal.component';
import { DomSanitizer } from '@angular/platform-browser';
import { NotifierService } from 'angular-notifier';
import { DialogService } from 'src/app/shared/layout/dialog/dialog.service';
import { CommonService } from '../../../core/services/common.service';
import { MatDialog } from '@angular/material';
import { OnboardingApiService } from '../onboarding-api.service';

@Component({
    selector       : 'onboarding-list',
    templateUrl    : './list.component.html',
    styleUrls : ['./list.component.css'],
    encapsulation  : ViewEncapsulation.Emulated,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class OnboardingListComponent  implements OnInit, OnDestroy
{
    page:number = 1;
    itemsPerPage:number = 8;
    
    onBoardingCategories = [
        {
            id   : '9a67dff7-3c38-4052-a335-0cef93438ff6',
            title: 'Web',
            slug : 'web'
        },
        {
            id   : 'a89672f5-e00d-4be4-9194-cb9d29f82165',
            title: 'Firebase',
            slug : 'firebase'
        },
        {
            id   : '02f42092-bb23-4552-9ddb-cfdcc235d48f',
            title: 'Cloud',
            slug : 'cloud'
        },
        {
            id   : '5648a630-979f-4403-8c41-fc9790dea8cd',
            title: 'Android',
            slug : 'android'
        }
    ];
    onBoardingModules:any = [];
    filteredOnBoardingModules:any = [];
    categorySlug:string = '';
    categories: Category[];
    sections: Section[];
    filteredSections: Section[];
    filters: {
        categorySlug$: BehaviorSubject<string>;
        query$: BehaviorSubject<string>;
        hideCompleted$: BehaviorSubject<boolean>;
    } = {
        categorySlug$ : new BehaviorSubject('all'),
        query$        : new BehaviorSubject(''),
        hideCompleted$: new BehaviorSubject(false)
    };
    IsAdmin: boolean = false;
    IsDeletePermission: boolean;
    IsAddPermission: boolean;
   
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    /**
     * Constructor
     */
    constructor(
        injector: Injector,
        private _activatedRoute: ActivatedRoute,
        private _changeDetectorRef: ChangeDetectorRef,
        private _router: Router,
        private _onboardingService: OnboardingService,
        private _commonService: CommonService,
        private modalService: MatDialog,
        private sanitizer: DomSanitizer,
        private notifier: NotifierService,
        private dialogService: DialogService,
        private _service: OnboardingApiService,

    )
    {
      //  super(injector);
       // this.pageRoute = this._router.url;
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void
    {
        this.getUserPermissions();
        // this.IsAddPermission = this.isGranted('Pages.OnboardingHeaders.Create');
        // this.IsDeletePermission = this.isGranted('Pages.OnboardingHeaders.Delete');
        this.handleGetAllHeaders()  
        // Get the categories 

        // Filter the sections
        combineLatest([this.filters.categorySlug$, this.filters.query$, this.filters.hideCompleted$])
            .subscribe(([categorySlug, query, hideCompleted]) => {

                // Reset the filtered sections
                this.filteredOnBoardingModules = this.onBoardingModules;

                // Filter by category
                if ( categorySlug !== 'all' )
                {
                    this.filteredOnBoardingModules = this.filteredOnBoardingModules.filter(section => section.category === categorySlug);
                }

                // Filter by search query
                if ( query !== '' )
                {
                    this.filteredOnBoardingModules = this.filteredOnBoardingModules.filter(section => section.header.toLowerCase().includes(query.toLowerCase())
                        || section.headerDescription.toLowerCase().includes(query.toLowerCase())
                        || section.category.toLowerCase().includes(query.toLowerCase()));
                }

                // Filter by completed
                // if ( hideCompleted )
                // {
                //     this.filteredOnBoardingModules = this.filteredOnBoardingModules.filter(section => section.progress.completed === 0);
                // }
            });
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void
    {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------
    handleGetAllHeaders() {
      //  this.spinnerService.show();
        this._service.getAllWithoutPagination().subscribe((response) =>{
          
            this.filteredOnBoardingModules = this.onBoardingModules = response;
            console.log("all header",this.filteredOnBoardingModules)
            this.filteredOnBoardingModules.forEach((value, index) => {
                value.headerVideo = this.sanitizer.bypassSecurityTrustResourceUrl(value.headerVideo);
            });
        //    this.spinnerService.hide();
            this._changeDetectorRef.detectChanges();
        })
    }

    handleAllByCategory(category: string) {
      //  this.spinnerService.show();
        this._service.getAllByCategory(category).subscribe((response) =>{
            this.onBoardingModules = response;
      //      this.spinnerService.hide();
            this._changeDetectorRef.detectChanges();
        })
    }

    /**
     * Filter by search query
     *
     * @param query
     */
    filterByQuery(query: string): void
    {
        this.filters.query$.next(query)
        this.page = 1;
        this._changeDetectorRef.detectChanges()
    }

    /**
     * Filter by category
     *
     * @param change
     */
    filterByCategory(change: any): void
    {   
        this.filters.categorySlug$.next(change.target.value);
        this.page = 1;
    }

    /**
     * Show/hide completed sections
     *
     * @param change
     */
    toggleCompleted(change: MatSlideToggleChange): void
    {
        this.filters.hideCompleted$.next(change.checked);
    }

    /**
     * Track by function for ngFor loops
     *
     * @param index
     * @param item
     */
    trackByFn(index: number, item: any): any
    {
        return item.id || index;
    }

    handleOnboardingRedirection(sectionId:number){
        var encryptedId = this._commonService.encryptValue(sectionId,true);
        // this._router.navigate(['/web/onboarding/section/'],{queryParams : {id:encryptedId}});

        if( this.IsAddPermission)
        this._router.navigate(['/web/onboarding/section/'],{queryParams : {id:encryptedId}});
else
        this._router.navigate(['/web/client/onboarding/section/'],{queryParams : {id:encryptedId}});
    }

    //DeleteHeader(detailid: any) {
    //    // console.log('deleteid', detailid);
     
    //}

    DeleteHeader(detailid: any) {
      /*  if (!this.disableSubmitForAdmin) {*/
        this.dialogService.confirm(`Are you sure you want to delete this module from Onboarding?`).subscribe((result: any) => {
            if (result == true) {
                if (detailid > 0) {
                //    this.spinnerService.show();
              this._service.delete(detailid).subscribe((response: any) => {
              //  if (response.statusCode == 200) {
                  this.notifier.notify('success',"Successfully Deleted")
             //     this.spinnerService.hide();
                               window.location.reload();
              //  } else {
              //    this.notifier.notify('error', response.message)
              //  }
              });
            }
        }
          })
            // this.message.confirm("This Module will be deleted from Onboarding.", this.l('AreYouSure'), (isConfirmed) => {
            //     if (isConfirmed) {
            //         if (detailid > 0) {
            //             this.spinnerService.show();
            //             this._onboardingHeadersServiceProxy.delete(detailid).subscribe((response: any) => {
            //                 // console.log("response ", response);
            //                 window.location.reload();
            //                 this.spinnerService.hide();
            //                 this.notify.success(('Successfully Deleted'));
            //             });
            //         }
            //     }
            // });
       /* }*/
    }

    addHeaderModal() {

        const modalRef = this.modalService.open(AddHeaderModalComponent,   {
            hasBackdrop: true,
            width: '50%'
        });
        modalRef.componentInstance.Headerid = 0;
    }

    getUserPermissions() {
        const actionPermissions = this._service.getUserScreenActionPermissions('ONBOARDING_MODULE', '');
       
        if(actionPermissions != null && actionPermissions != undefined)
        {
               this.IsAddPermission = true;
         this.IsDeletePermission = true;
        }
        else
        {
            this.IsAddPermission = false;
            this.IsDeletePermission = false;
        }
        // const { PAYER_LIST_ADD, PAYER_LIST_UPDATE, PAYER_LIST_DELETE } = actionPermissions;
        // if (!PAYER_LIST_UPDATE) {
        //   let spliceIndex = this.actionButtons.findIndex(obj => obj.key == 'edit');
        //   this.actionButtons.splice(spliceIndex, 1)
        // }
        // if (!PAYER_LIST_DELETE) {
        //   let spliceIndex = this.actionButtons.findIndex(obj => obj.key == 'delete');
        //   this.actionButtons.splice(spliceIndex, 1)
        // }
    
        // this.addPermission = PAYER_LIST_ADD || false;
    
      }
  
}
