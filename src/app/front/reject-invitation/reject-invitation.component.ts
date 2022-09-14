import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { ResponseModel } from "src/app/platform/modules/core/modals/common-model";
import { NotifierService } from "angular-notifier";
import { RegisterService } from "src/app/front/register/register.service";
import { ActivatedRoute } from "@angular/router";
import { UserModel } from "src/app/platform/modules/agency-portal/users/users.model";
import { SubDomainService } from "src/app/subDomain.service";

@Component({
  selector: 'app-reject-invitation',
  templateUrl: './reject-invitation.component.html',
  styleUrls: ['./reject-invitation.component.css']
})
export class RejectInvitationComponent implements OnInit {
  submitted: boolean;
  userForm: FormGroup;
  invitationId: string = "";
  userModel: UserModel;
  logoUrl: string = null;
  isTokenValid: boolean = true;
  Message: any;
  constructor(private notifier: NotifierService,
    private registerService: RegisterService,
    private activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder,
    private subDomainService: SubDomainService) { }

  ngOnInit() {
    this.Message = {
      title: "Oops",
      message: "Either token isn't legitimate or lapsed or patient previously rejected or registred with this token id, it would be ideal if you contact organization for additional help.",
      imgSrc: "../assets/img/user-register-icon.png"
    }
    this.activatedRoute.queryParams.subscribe(params => {
      if (params["token"] != undefined && params["token"] != null && params["token"] != "")
        this.invitationId = params["token"];
    });
    this.userForm = this.formBuilder.group({
      invitationId: this.invitationId,
      remarks: ["", [Validators.required]]
    });
    if (this.invitationId != "") {
      this.registerService.checkTokenAccessibility(this.invitationId).subscribe(res => {
        if (res.statusCode != 200) {
          this.isTokenValid = false;
        }
        else {
          this.userModel = res.data;
          this.userForm.patchValue(this.userModel);
          this.isTokenValid = true;
        }
      });
    }
    else
      {
        this.Message = {
          title: "Oops",
          message: "Bad redirection, please check your email or contact administartion for further assistance",
          imgSrc: "../assets/img/user-register-icon.png"
        }
        this.isTokenValid = false;
      }
    this.subDomainService.getSubDomainInfo().subscribe(domainInfo => {
      if (domainInfo)
        this.logoUrl = 'data:image/png;base64,' + domainInfo.organization.logoBase64;
    });
  }
  get formControls() { return this.userForm.controls; }
  onSubmit() {
    if (!this.userForm.invalid) {
      this.submitted = true;
      this.registerService.rejectInvitation(this.userForm.value).subscribe((response: ResponseModel) => {
        this.submitted = false;
        if (response != null) {
          if (response.statusCode == 200) {
            this.isTokenValid = false;
            this.Message = {
              title: "Success!",
              message: "Thank you, Your request has been successfully submitted.",
              imgSrc: "../assets/img/user-success-icon.png"
            }
          }
          else {
            this.notifier.notify('error', response.message);
          }
        } else {
          this.notifier.notify('error', response.message)
        }
      });
    }
  }
}
