import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, Inject, Injector, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { MatTabGroup } from '@angular/material/tabs';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators'; 
import { Category, Section } from '../onboarding.types';
import { OnboardingService } from '../onboarding.service';
//import { OnboardingDetailsServiceProxy, OnboardingHeadersServiceProxy } from '@shared/service-proxies/service-proxies';
import { ActivatedRoute } from '@angular/router';
// import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AddHeaderModalComponent } from '../modals/add-header-modal/add-header-modal.component';
import { AddDetailsModalComponent } from '../modals/add-details-modal/add-details-modal.component';

//import { CommonService } from '../../core/services/common.service';
import { HeaderModel } from '../onboarding.model';
import { DomSanitizer } from '@angular/platform-browser';
import { NotifierService } from 'angular-notifier';
import { DialogService } from 'src/app/shared/layout/dialog/dialog.service';
import { MatDialog } from '@angular/material';
import { CommonService } from '../../../core/services/common.service';
import { OnboardingApiService } from '../onboarding-api.service';
////import { AppSessionService } from '../../../../../shared/common/session/app-session.service';
//import { AppComponentBase } from '../../../../../shared/common/app-component-base';

@Component({
    selector       : 'onboarding-details',
    templateUrl    : './details.component.html', 
    styleUrls : ['./details.component.css', './styles-overide.scss'],
    encapsulation  : ViewEncapsulation.Emulated,
})
export class OnboardingDetailsComponent implements OnInit, OnDestroy
{
    @ViewChild('sectionsteps') sectionsteps: MatTabGroup;
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
    categories: Category[];
    demoSectionContent = `
    <p class="lead">
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Accusamus aperiam lab et fugiat id magnam minus nemo quam
        voluptatem. Culpa deleniti explica nisi quod soluta.
    </p>
    <p>
        Alias animi labque, deserunt distinctio eum excepturi fuga iure labore magni molestias mollitia natus, officia pofro
        quis sunt temporibus veritatis voluptatem, voluptatum. Aut blanditiis esse et illum maxim, obcaecati possimus
        voluptate! Accusamus <em>adipisci</em> amet aperiam, assumenda consequuntur fugiat inventore iusto magnam molestias
        natus necessitatibus, nulla pariatur.
    </p>
    <p>
        Amet distinctio enim itaque minima minus nesciunt recusandae soluta voluptatibus:
    </p>
    <blockquote>
        <p>
            Ad aliquid amet asperiores lab distinctio doloremque <code>eaque</code>, exercitationem explicabo, minus mollitia
            natus necessitatibus odio omnis pofro rem.
        </p>
    </blockquote>
    <p>
        Alias architecto asperiores, dignissimos illum ipsam ipsum itaque, natus necessitatibus officiis, perferendis quae
        sed ullam veniam vitae voluptas! Magni, nisi, quis! A <code>accusamus</code> animi commodi, consectetur distinctio
        eaque, eos excepturi illum laboriosam maiores nam natus nulla officiis perspiciatis rem <em>reprehenderit</em> sed
        tenetur veritatis.
    </p>
    <p>
        Consectetur <code>dicta enim</code> error eveniet expedita, facere in itaque labore <em>natus</em> quasi? Ad consectetur
        eligendi facilis magni quae quis, quo temporibus voluptas voluptate voluptatem!
    </p>
    <p>
        Adipisci alias animi <code>debitis</code> eos et impedit maiores, modi nam nobis officia optio perspiciatis, rerum.
        Accusantium esse nostrum odit quis quo:
    </p>
    <pre><code>h1 a {{'{'}}
        display: block;
        width: 300px;
        height: 80px;
    {{'}'}}</code></pre>
    <p>
        Accusantium aut autem, lab deleniti eaque fugiat fugit id ipsa iste molestiae,
        <a>necessitatibus nemo quasi</a>
        .
    </p>
    <hr>
    <h2>
        Accusantium aspernatur autem enim
    </h2>
    <p>
        Blanditiis, fugit voluptate! Assumenda blanditiis consectetur, labque cupiditate ducimus eaque earum, fugiat illum
        ipsa, necessitatibus omnis quaerat reiciendis totam. Architecto, <strong>facere</strong> illum molestiae nihil nulla
        quibusdam quidem vel! Atque <em>blanditiis deserunt</em>.
    </p>
    <p>
        Debitis deserunt doloremque labore laboriosam magni minus odit:
    </p>
    <ol>
        <li>Asperiores dicta esse maiores nobis officiis.</li>
        <li>Accusamus aliquid debitis dolore illo ipsam molettiae possimus.</li>
        <li>Magnam mollitia pariatur perspiciatis quasi quidem tenetur voluptatem! Adipisci aspernatur assumenda dicta.</li>
    </ol>
    <p>
        Animi fugit incidunt iure magni maiores molestias.
    </p>
    <h3>
        Consequatur iusto soluta
    </h3>
    <p>
        Aliquid asperiores corporis — deserunt dolorum ducimus eius eligendi explicabo quaerat suscipit voluptas.
    </p>
    <p>
        Deserunt dolor eos et illum laborum magni molestiae mollitia:
    </p>
    <blockquote>
        <p>Autem beatae consectetur consequatur, facere, facilis fugiat id illo, impedit numquam optio quis sunt ducimus illo.</p>
    </blockquote>
    <p>
        Adipisci consequuntur doloribus facere in ipsam maxime molestias pofro quam:
    </p>
    <figure>
        <img
            src="assets/images/pages/help-center/image-1.jpg"
            alt="">
        <figcaption>
            Accusamus blanditiis labque delectus esse et eum excepturi, impedit ipsam iste maiores minima mollitia, nihil obcaecati
            placeat quaerat qui quidem sint unde!
        </figcaption>
    </figure>
    <p>
        A beatae lab deleniti explicabo id inventore magni nisi omnis placeat praesentium quibusdam:
    </p>
    <ul>
        <li>Dolorem eaque laboriosam omnis praesentium.</li>
        <li>Atque debitis delectus distinctio doloremque.</li>
        <li>Fuga illo impedit minima mollitia neque obcaecati.</li>
    </ul>
    <p>
        Consequ eius eum excepturi explicabo.
    </p>
    <h2>
        Adipisicing elit atque impedit?
    </h2>
    <h3>
        Atque distinctio doloremque ea qui quo, repellendus.
    </h3>
    <p>
        Delectus deserunt explicabo facilis numquam quasi! Laboriosam, magni, quisquam. Aut, blanditiis commodi distinctio, facere fuga
        hic itaque iure labore laborum maxime nemo neque provident quos recusandae sequi veritatis illum inventore iure qui rerum sapiente.
    </p>
    <h3>
        Accusamus iusto sint aperiam consectetur …
    </h3>
    <p>
        Aliquid assumenda ipsa nam odit pofro quaerat, quasi recusandae sint! Aut, esse explicabo facilis fugit illum iure magni
        necessitatibus odio quas.
    </p>
    <ul>
        <li>
            <p><strong>Dolore natus placeat rem atque dignissimos laboriosam.</strong></p>
            <p>
                Amet repudiandae voluptates architecto dignissimos repellendus voluptas dignissimos eveniet itaque maiores natus.
            </p>
            <p>
                Accusamus aliquam debitis delectus dolorem ducimus enim eos, exercitationem fugiat id iusto nostrum quae quos
                recusandae reiciendis rerum sequi temporibus veniam vero? Accusantium culpa, cupiditate ducimus eveniet id maiores modi
                mollitia nisi aliquid dolorum ducimus et illo in.
            </p>
        </li>
        <li>
            <p><strong>Ab amet deleniti dolor, et hic optio placeat.</strong></p>
            <p>
                Accusantium ad alias beatae, consequatur consequuntur eos error eveniet expedita fuga laborum libero maxime nulla pofro
                praesentium rem rerum saepe soluta ullam vero, voluptas? Architecto at debitis, doloribus harum iure libero natus odio
                optio soluta veritatis voluptate.
            </p>
        </li>
        <li>
            <p><strong>At aut consectetur nam necessitatibus neque nesciunt.</strong></p>
            <p>
                Aut dignissimos labore nobis nostrum optio! Dolor id minima velit voluptatibus. Aut consequuntur eum exercitationem
                fuga, harum id impedit molestiae natus neque numquam perspiciatis quam rem voluptatum.
            </p>
        </li>
    </ul>
    <p>
        Animi aperiam autem labque dolore enim ex expedita harum hic id impedit ipsa laborum modi mollitia non perspiciatis quae ratione.
    </p>
    <h2>
        Alias eos excepturi facilis fugit.
    </h2>
    <p>
        Alias asperiores, aspernatur corporis
        <a>delectus</a>
        est
        <a>facilis</a>
        inventore dolore
        ipsa nobis nostrum officia quia, veritatis vero! At dolore est nesciunt numquam quam. Ab animi <em>architecto</em> aut, dignissimos
        eos est eum explicabo.
    </p>
    <p>
        Adipisci autem consequuntur <code>labque cupiditate</code> dolor ducimus fuga neque nesciunt:
    </p>
    <pre><code>module.exports = {{'{'}}
        purge: [],
        theme: {{'{'}}
            extend: {{'{}'}},
        },
        variants: {{'{}'}},
        plugins: [],
    {{'}'}}</code></pre>
    <p>
        Aliquid aspernatur eius fugit hic iusto.
    </p>
    <h3>
        Dolorum ducimus expedita?
    </h3>
    <p>
        Culpa debitis explicabo maxime minus quaerat reprehenderit temporibus! Asperiores, cupiditate ducimus esse est expedita fuga hic
        ipsam necessitatibus placeat possimus? Amet animi aut consequuntur earum eveniet.
    </p>
    <ol>
        <li>
            <strong>Aspernatur at beatae corporis debitis.</strong>
            <ul>
                <li>
                    Aperiam assumenda commodi lab dicta eius, “fugit ipsam“ itaque iure molestiae nihil numquam, officia omnis quia
                    repellendus sapiente sed.
                </li>
                <li>
                    Nulla odio quod saepe accusantium, adipisci autem blanditiis lab doloribus.
                </li>
                <li>
                    Explicabo facilis iusto molestiae nisi nostrum obcaecati officia.
                </li>
            </ul>
        </li>
        <li>
            <strong>Nobis odio officiis optio quae quis quisquam quos rem.</strong>
            <ul>
                <li>Modi pariatur quod totam. Deserunt doloribus eveniet, expedita.</li>
                <li>Ad beatae dicta et fugit libero optio quaerat rem repellendus./</li>
                <li>Architecto atque consequuntur corporis id iste magni.</li>
            </ul>
        </li>
        <li>
            <strong>Deserunt non placeat unde veniam veritatis? Odio quod.</strong>
            <ul>
                <li>Inventore iure magni quod repellendus tempora. Magnam neque, quia. Adipisci amet.</li>
                <li>Consectetur adipisicing elit.</li>
                <li>labque eum expedita illo inventore iusto laboriosam nesciunt non, odio provident.</li>
            </ul>
        </li>
    </ol>
    <p>
        A aliquam architecto consequatur labque dicta doloremque <code>&lt;li&gt;</code> doloribus, ducimus earum, est <code>&lt;p&gt;</code>
        eveniet explicabo fuga fugit ipsum minima minus molestias nihil nisi non qui sunt vel voluptatibus? A dolorum illum nihil quidem.
    </p>
    <ul>
        <li>
            <p>
                <strong>Laboriosam nesciunt obcaecati optio qui.</strong>
            </p>
            <p>
                Doloremque magni molestias reprehenderit.
            </p>
            <ul>
                <li>Accusamus aperiam blanditiis <code>&lt;p&gt;</code> commodi</li>
                <li>Dolorum ea explicabo fugiat in ipsum</li>
            </ul>
        </li>
        <li>
            <p>
                <strong>Commodi dolor dolorem dolores eum expedita libero.</strong>
            </p>
            <p>
                Accusamus alias consectetur dolores et, excepturi fuga iusto possimus.
            </p>
            <ul>
                <li>
                    <p>
                        Accusantium ad alias atque aut autem consequuntur deserunt dignissimos eaque iure <code>&lt;p&gt;</code> maxime.
                    </p>
                    <p>
                        Dolorum in nisi numquam omnis quam sapiente sit vero.
                    </p>
                </li>
                <li>
                    <p>
                        Adipisci lab in nisi odit soluta sunt vitae commodi excepturi.
                    </p>
                </li>
            </ul>
        </li>
        <li>
            <p>
                Assumenda deserunt distinctio dolor iste mollitia nihil non?
            </p>
        </li>
    </ul>
    <p>
        Consectetur adipisicing elit dicta dolor iste.
    </p>
    <h2>
        Consectetur ea natus officia omnis reprehenderit.
    </h2>
    <p>
        Distinctio impedit quaerat sed! Accusamus
        <a>aliquam aspernatur enim expedita explicabo</a>
        . Libero molestiae
        odio quasi unde ut? Ab exercitationem id numquam odio quisquam!
    </p>
    <p>
        Explicabo facilis nemo quidem natus tempore:
    </p>
    <table class="table table-striped table-bordered">
        <thead>
            <tr>
                <th>Wrestler</th>
                <th>Origin</th>
                <th>Finisher</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>Bret “The Hitman” Hart</td>
                <td>Calgary, AB</td>
                <td>Sharpshooter</td>
            </tr>
            <tr>
                <td>Stone Cold Steve Austin</td>
                <td>Austin, TX</td>
                <td>Stone Cold Stunner</td>
            </tr>
            <tr>
                <td>Randy Savage</td>
                <td>Sarasota, FL</td>
                <td>Elbow Drop</td>
            </tr>
            <tr>
                <td>Vader</td>
                <td>Boulder, CO</td>
                <td>Vader Bomb</td>
            </tr>
            <tr>
                <td>Razor Ramon</td>
                <td>Chuluota, FL</td>
                <td>Razor’s Edge</td>
            </tr>
        </tbody>
    </table>
    <p>
        A aliquid autem lab doloremque, ea earum eum fuga fugit illo ipsa minus natus nisi <code>&lt;span&gt;</code> obcaecati pariatur
        perferendis pofro <code>suscipit tempore</code>.
    </p>
    <h3>
        Ad alias atque culpa <code>illum</code> earum optio
    </h3>
    <p>
        Architecto consequatur eveniet illo in iure laborum minus omnis quibusdam sequi temporibus? Ab aliquid <em>“atque dolores molestiae
        nemo perferendis”</em> reprehenderit saepe.
    </p>
    <p>
        Accusantium aliquid eligendi est fuga natus, <code>quos</code> vel? Adipisci aperiam asperiores aspernatur consectetur cupiditate
        <a><code>@distinctio/doloribus</code></a>
        et exercitationem expedita, facere facilis illum, impedit inventore
        ipsa iure iusto magnam, magni minus nesciunt non officia possimus quod reiciendis.
    </p>
    <h4>
        Cupiditate explicabo <code>hic</code> maiores
    </h4>
    <p>
        Aliquam amet consequuntur distinctio <code>ea</code> est <code>excepturi</code> facere illum maiores nisi nobis non odit officiis
        quisquam, similique tempora temporibus, tenetur ullam <code>voluptates</code> adipisci aperiam deleniti <code>doloremque</code>
        ducimus <code>eos</code>.
    </p>
    <p>
        Ducimus qui quo tempora. lab enim explicabo <code>hic</code> inventore qui soluta voluptates voluptatum? Asperiores consectetur
        delectus dolorem fugiat ipsa pariatur, quas <code>quos</code> repellendus <em>repudiandae</em> sunt aut blanditiis.
    </p>
    <h3>
        Asperiores aspernatur autem error praesentium quidem.
    </h3>
    <h4>
        Ad blanditiis commodi, doloribus id iste <code>repudiandae</code> vero vitae.
    </h4>
    <p>
        Atque consectetur lab debitis enim est et, facere fugit impedit, possimus quaerat quibusdam.
    </p>
    <p>
        Dolorem nihil placeat quibusdam veniam? Amet architecto at consequatur eligendi eveniet excepturi hic illo impedit in iste magni maxime
        modi nisi nulla odio placeat quidem, quos rem repellat similique suscipit voluptate voluptates nobis omnis quo repellendus.
    </p>
    <p>
        Assumenda, eum, minima! Autem consectetur fugiat iste sit! Nobis omnis quo repellendus.
    </p>
    `;
     demoSectionSteps = [
        {
            order   : 0,
            title   : 'Introduction',
            subtitle: 'Introducing the library and how it works',
            content : `<h2 class="text-2xl sm:text-3xl">Introduction</h1> ${this.demoSectionContent}`
        },
        {
            order   : 1,
            title   : 'Get the sample code',
            subtitle: 'Where to find the sample code and how to access it',
            content : `<h2 class="text-2xl sm:text-3xl">Get the sample code</h1> ${this.demoSectionContent}`
        },
        {
            order   : 2,
            title   : 'Create a Firebase project and Set up your app',
            subtitle: 'How to create a basic Firebase project and how to run it locally',
            content : `<h2 class="text-2xl sm:text-3xl">Create a Firebase project and Set up your app</h1> ${this.demoSectionContent}`
        },
        {
            order   : 3,
            title   : 'Install the Firebase Command Line Interface',
            subtitle: 'Setting up the Firebase CLI to access command line tools',
            content : `<h2 class="text-2xl sm:text-3xl">Install the Firebase Command Line Interface</h1> ${this.demoSectionContent}`
        },
        {
            order   : 4,
            title   : 'Deploy and run the web app',
            subtitle: 'How to build, push and run the project remotely',
            content : `<h2 class="text-2xl sm:text-3xl">Deploy and run the web app</h1> ${this.demoSectionContent}`
        },
        {
            order   : 5,
            title   : 'The Functions Directory',
            subtitle: 'Introducing the Functions and Functions Directory',
            content : `<h2 class="text-2xl sm:text-3xl">The Functions Directory</h1> ${this.demoSectionContent}`
        },
        {
            order   : 6,
            title   : 'Import the Cloud Functions and Firebase Admin modules',
            subtitle: 'Create your first Function and run it to administer your app',
            content : `<h2 class="text-2xl sm:text-3xl">Import the Cloud Functions and Firebase Admin modules</h1> ${this.demoSectionContent}`
        },
        {
            order   : 7,
            title   : 'Welcome New Users',
            subtitle: 'How to create a welcome message for the new users',
            content : `<h2 class="text-2xl sm:text-3xl">Welcome New Users</h1> ${this.demoSectionContent}`
        },
        {
            order   : 8,
            title   : 'Images moderation',
            subtitle: 'How to moderate images; crop, resize, optimize',
            content : `<h2 class="text-2xl sm:text-3xl">Images moderation</h1> ${this.demoSectionContent}`
        },
        {
            order   : 9,
            title   : 'New Message Notifications',
            subtitle: 'How to create and push a notification to a user',
            content : `<h2 class="text-2xl sm:text-3xl">New Message Notifications</h1> ${this.demoSectionContent}`
        },
        {
            order   : 10,
            title   : 'Congratulations!',
            subtitle: 'Nice work, you have created your first application',
            content : `<h2 class="text-2xl sm:text-3xl">Congratulations!</h1> ${this.demoSectionContent}`
        }
    ];
    section = {
        id         : '694e4e5f-f25f-470b-bd0e-26b1d4f64028',
        title      : 'Basics of Angularrr',
        slug       : 'basics-of-angular',
        image      : 'assets/images/cards/01-320x200.jpg',
        description: 'Introductory section for Angular and framework basics',
        category   : 'web',
        duration   : 30,
        totalSteps : 11,
        updatedAt  : 'Jun 28, 2021',
        featured   : true,
        progress   : {
            currentStep: 3,
            completed  : 2
        },
        steps : this.demoSectionSteps
    };
    sectionDetails = {  
        activeStatus: false,
        category: '',
        duration: 0,
        header: '',
        headerDescription: '',
        headerImage: '',
        headerVideo: '',
        userId: 0,
        id: 0,
        isImage: 0,
        organizationId: 0,
        tenantId: 0,
        totalSteps: 0, 
    };
    sectionsSteps:any = [];
    currentStep: number = 0;
    drawerMode: 'over' | 'side' = 'side';
    drawerOpened: boolean = true;
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    sectionId: any;
    IsAdmin: boolean=false;
    html: string = '<p><strong>content</strong> <em>Italic <u>underline</u></em></p><blockquote>test</blockquote><ol><li>dsfsdf</li><li>sdgfsdf</li><li>sdg</li></ol><p><a href="https://youtu.be/RuMjnkx6y44" rel="noopener noreferrer" target="_blank">Text</a></p><p><img src="https://imgsv.imaging.nikon.com/lineup/dslr/df/img/sample/img_01.jpg" alt="Test Image"></p><p><br></p><iframe class="ql-video" frameborder="0" allowfullscreen="true" src="https://www.youtube.com/embed/YdPtdgjKS4g?showinfo=0"></iframe><p><span class="ql-cursor">﻿</span></p>';
    //html: string = '';
    url: string ='';
    safeurl: any;

    IsDeletePermission: boolean;
    IsEditHeaderPermission: boolean;
    IsEditDetailPermission: boolean;
    IsAddPermission: boolean;
    /**
     * Constructor
     */
    constructor(
        injector: Injector,
        @Inject(DOCUMENT) private _document: Document,
        private _onboardingService: OnboardingService,
        private _changeDetectorRef: ChangeDetectorRef,
        private _elementRef: ElementRef, 
        private _activatedRoute: ActivatedRoute,
     //   private modalService: NgbModal,
        private _commonService: CommonService,
        private sanitizer: DomSanitizer,
       // private _app:  AppSessionService ,
        private notifier: NotifierService,
        private dialogService: DialogService,
        private dialogModal: MatDialog,
        private _service: OnboardingApiService,
    )
    {
      //  super(injector);
        this._activatedRoute.queryParams.subscribe(params => {  
            this.sectionId = params.id == undefined ? null : this._commonService.encryptValue(params.id,false), false; 
            //console.log("this.sectionid ",this.sectionId); 
            this.handleGetHeaderById();
        });
        //this.url = 'https://www.youtube.com/embed/rO9tJ13_sWk';
        this.safeurl = this.sanitizer.bypassSecurityTrustHtml(this.html);
       // console.log('this.safeurl', this.safeurl);
        //this.html = '';
       // console.log('this.html',this.html);
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
        // this.IsEditHeaderPermission = this.isGranted('Pages.OnboardingHeaders.Edit');
        // this.IsEditDetailPermission = this.isGranted('Pages.OnboardingDetails.Edit');
        // this.IsAddPermission = this.isGranted('Pages.OnboardingDetails.Create');
        // this.IsDeletePermission = this.isGranted('Pages.OnboardingDetails.Delete');

        this.handleGetSectionById();
        // Get the categories
        this._onboardingService.categories$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((categories: Category[]) => {

                // Get the categories
                this.categories = categories;

                // Mark for check
                this._changeDetectorRef.markForCheck();
            });

        // Get the section
         
        
    }


    getHtml(html:any) { 
        return this.sanitizer.bypassSecurityTrustHtml(html);
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
    handleGetSectionById() {
      //  this.spinnerService.show();
        this._service.getAllByHeaderId(this.sectionId).subscribe((response) =>{
            this.sectionsSteps = response;
            console.log("all details",response)
            this.sectionsSteps.forEach((value) => {
                value.description = this.sanitizer.bypassSecurityTrustHtml(value.description);
              //  console.log('value.description', value.description);
            });

         //   this.spinnerService.hide();
            this._changeDetectorRef.detectChanges()
           // console.log("section ",response)
        })
    }
    VideoURL: any;
    handleGetHeaderById() {
       
     //   this.spinnerService.show();
        this._service.getOnboardingHeaderForView(this.sectionId).subscribe((response) => {
            this.sectionDetails = response;
            console.log("section details",this.sectionDetails)
            this._changeDetectorRef.detectChanges()
            if (this.sectionDetails.isImage == 2) {
                this.VideoURL = this.sanitizer.bypassSecurityTrustResourceUrl(this.sectionDetails.headerVideo);
            }
            // console.log("header ",this.sectionDetails)
       //     this.spinnerService.hide();
        });
    }
    /**
     * Go to given step
     *
     * @param step
     */
    goToStep(step: number): void
    {
        // Set the current step
        this.currentStep = step;

        // Go to the step
        this.sectionsteps.selectedIndex = this.currentStep;

        // Mark for check
        this._changeDetectorRef.markForCheck();
    }

    /**
     * Go to previous step
     */
    goToPreviousStep(): void
    {
        // Return if we already on the first step
        if ( this.currentStep === 0 )
        {
            return;
        }

        // Go to step
        this.goToStep(this.currentStep - 1);

        // Scroll the current step selector from sidenav into view
        this._scrollCurrentStepElementIntoView();
    }

    /**
     * Go to next step
     */
    goToNextStep(): void
    {
        // Return if we already on the last step
        if ( this.currentStep === this.sectionDetails.totalSteps - 1 || (this.sectionDetails.totalSteps - 1) < 0)
        {
            return;
        }

        // Go to step
        this.goToStep(this.currentStep + 1);

        // Scroll the current step selector from sidenav into view
        this._scrollCurrentStepElementIntoView();
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

    // -----------------------------------------------------------------------------------------------------
    // @ Private methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Scrolls the current step element from
     * sidenav into the view. This only happens when
     * previous/next buttons pressed as we don't want
     * to change the scroll position of the sidebar
     * when the user actually clicks around the sidebar.
     *
     * @private
     */
    private _scrollCurrentStepElementIntoView(): void
    {
        // Wrap everything into setTimeout so we can make sure that the 'current-step' class points to correct element
        setTimeout(() => {

            // Get the current step element and scroll it into view
            const currentStepElement = this._document.getElementsByClassName('current-step')[0];
            if ( currentStepElement )
            {
                currentStepElement.scrollIntoView({
                    behavior: 'smooth',
                    block   : 'start'
                });
            }
        });
    }



    openHeaderModal() {

        const modalRef = this.dialogModal.open(AddHeaderModalComponent, 
            {
                hasBackdrop: true,
      width: '50%'
            });
         modalRef.componentInstance.Headerid = this.sectionId;
    }

    openHeaderDetailsModal(detailid: any) {
        //console.log('detailid', detailid)
       
        const modalRef = this.dialogModal.open(AddDetailsModalComponent, 
            {
                hasBackdrop: true,
      width: '70%'
            });
         modalRef.componentInstance.Headerid = this.sectionId;
         modalRef.componentInstance.Detailid = detailid;
    }

    AddHeaderDetailsModal() {
       
        const modalRef = this.dialogModal.open(AddDetailsModalComponent, 
            {
                hasBackdrop: true,
      width: '70%'
            });
        modalRef.componentInstance.Headerid = this.sectionId;
        modalRef.componentInstance.Detailid = 0;
    }

    DeleteHeaderDetails(detailid: any) {

        this.dialogService.confirm(`Are you sure you want to delete this module from Onboarding?`).subscribe((result: any) => {
            if (result == true) {
                if (detailid > 0) {
                   // this.spinnerService.show();
              this._service.deleteDetails(detailid).subscribe((response: any) => {
               // if (response.statusCode == 200) {
                  this.notifier.notify('success'," Successfully Deleted")
              //    this.spinnerService.hide();
                               window.location.reload();
              //  } else {
               //   this.notifier.notify('error', response.message)
           //     }
              });
            }
        }
          })
        // this.message.confirm("This Module details will be deleted from Onboarding.", this.l('AreYouSure'), (isConfirmed) => {
        //     if (isConfirmed) {
        //         if (detailid > 0) {
        //             this.spinnerService.show();
        //         this._onboardingDetailsServiceProxy.delete(detailid).subscribe((response: any) => {
        //             // console.log("response ", response);
        //             this.notify.success(('Successfully Deleted'));
        //             this.spinnerService.hide();
        //             window.location.reload();
        //         });
        //         }
        //     }
        // });
    }

    getUserPermissions() {
        const actionPermissions = this._service.getUserScreenActionPermissions('ONBOARDING_MODULE', '');
       
        if(actionPermissions != null && actionPermissions != undefined)
        {
              this.IsEditHeaderPermission = true;
        this.IsEditDetailPermission = true;
        this.IsAddPermission = true;
        this.IsDeletePermission = true;
        }
        else
        {
            this.IsEditHeaderPermission = false;
            this.IsEditDetailPermission = false;
            this.IsAddPermission = false;
            this.IsDeletePermission = false;
        }
    
      }
}
