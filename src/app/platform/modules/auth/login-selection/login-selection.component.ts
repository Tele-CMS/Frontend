import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { first } from 'rxjs/operators';
import { TermsConditionModalComponent } from 'src/app/front/terms-conditions/terms-conditions.component';
import { CommonService } from '../../core/services';
import { AuthenticationService } from '../auth.service';

@Component({
  selector: 'app-login-selection',
  templateUrl: './login-selection.component.html',
  styleUrls: ['./login-selection.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class LoginSelectionComponent implements OnInit {
  loginForm: FormGroup;
  loading = false;
  submitted = false;
  returnUrl: string;
  subDomainInfo: any;
  errorMessage: string = null;
  ipAddress: string;
  isLogin:boolean=false;
  iSignUp:boolean=false;
  isPatientLogin:boolean=false;

  constructor(

    private router: Router,
    private route: ActivatedRoute,
    private authenticationService: AuthenticationService,
    private dialogModal: MatDialog
  ) {
    if (this.route.snapshot.url[0].path == "signup-selection") {
      this.iSignUp = true;
    } else if (this.route.snapshot.url[0].path == "login-selection") {
      this.isLogin = true;
    }
  }

  ngOnInit() {

  }

  reDirectTo(type:string){
    let url ='';
    if(this.isLogin){
      url = type === 'patient'? '/web/client-login' : '/web/login'
    }
    else if(this.iSignUp) {
      url = type === 'patient'? '/web/client-signup' : '/web/provider-signup'
    }
    this.redirect(url);
  }

  redirect(path) {
    this.router.navigate([path]);
  }

  changeSideImg(type) {
    if (type === 'patient')
      this.authenticationService.updateSideScreenImgSrc("../../../../../assets/login-patient.png");
    else if (type === 'provider')
      this.authenticationService.updateSideScreenImgSrc("../../../../../assets/login-doc.png");
  }
  opentermconditionmodal() {
    let dbModal;
    dbModal = this.dialogModal.open(TermsConditionModalComponent, {
      hasBackdrop: true,
      width:'70%'
    });
    dbModal.afterClosed().subscribe((result: string) => {
      if (result != null && result != "close") {
        
      }
    });
  }
}
