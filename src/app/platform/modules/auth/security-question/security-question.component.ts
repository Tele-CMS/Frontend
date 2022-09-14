import { Component, OnInit, OnDestroy } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Subscription } from "rxjs";
import { ActivatedRoute, Router } from "@angular/router";
import { AuthenticationService } from "../auth.service";
import { CommonService } from "../../core/services";
import { environment } from "src/environments/environment";

@Component({
  selector: "app-security-question",
  templateUrl: "./security-question.component.html",
  styleUrls: ["./security-question.component.css"]
})
export class SecurityQuestionComponent implements OnInit, OnDestroy {
  private subscription: Subscription;
  securityQuestionForm: FormGroup;
  securityQuestionOptionsForm: FormGroup;
  loading = false;
  submitted = false;
  errorMessage: string;
  returnUrl: string;
  firstTimeLogin: boolean;
  securityQuestions: Array<object>;
  securityQuestionOptions: Array<object>;
  authData: any;
  ipAddress: string;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthenticationService,
    private commonService: CommonService // private securityQuestionService: SecurityQuestionService, // private alertService: AlertService
  ) {
    this.createForm();
    this.errorMessage = null;
  }
  createForm() {
    // this.securityQuestionForm = this.formBuilder.group({
    //   question: ''
    // });
  }
  createOptionsForm() {
    // this.securityQuestionOptionsForm = this.formBuilder.group({
    //   question: '',
    //   answer: ''
    // });
  }
  ngOnInit() {
    this.commonService.sytemInfo.subscribe(obj => {
      this.ipAddress = obj.ipAddress;
    });

    this.subscription = this.commonService.loginSecurity.subscribe(
      (user: any) => {
        if (
          user.loginResponse &&
          !user.loginResponse.access_token &&
          user.loginResponse.data
        ) {
          if (user.loginResponse.firstTimeLogin) {
            this.securityQuestions = user.loginResponse.data;
            this.firstTimeLogin = true;
            this.authData = user.authData;

            const questionsForm = {};
            (this.securityQuestions || []).forEach((obj: any) => {
              questionsForm[`question${obj.id}`] = ["", Validators.required];
            });
            this.securityQuestionForm = this.formBuilder.group({
              ...questionsForm
            });
          } else {
            this.securityQuestionOptions = user.loginResponse.data;
            this.firstTimeLogin = false;
            this.authData = user.authData;
            this.securityQuestionOptionsForm = this.formBuilder.group({
              question: ["", Validators.required],
              answer: ["", Validators.required]
            });
          }
        } else {
          this.router.navigate(["/web"]);
        }
      }
    );
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.securityQuestionForm;
  }
  get g() {
    return this.securityQuestionOptionsForm;
  }
  onSubmitQuestionAnswer() {
    this.submitted = true;
    this.errorMessage = null;
    // stop here if form is invalid
    if (this.securityQuestionOptionsForm.invalid) {
      return;
    }
    this.loading = true;

    const postData = {
      userName: this.authData.username,
      password: this.authData.password,
      QuestionID: this.g.value.question,
      Answer: this.g.value.answer,
      ipaddress: this.ipAddress,
      macaddress: "ec:aa:a0:2d:dc:67"
    };
    this.authService.checkQuestionAnswer(postData).subscribe(
      data => {
        this.submitted = false;
        if (data.statusCode == 0 && data.access_token)
          this.router.navigate(["/web"]);
        else this.errorMessage = data.message;
      },
      error => {
        this.loading = false;
      }
    );
  }
  onSubmit() {
    this.submitted = true;
    // stop here if form is invalid
    if (this.securityQuestionForm.invalid) {
      return;
    }
    this.loading = true;
    const questionsDataArray = (Object.keys(this.f.value) || []).map(key => {
      return {
        Id: 0,
        QuestionID: key.replace("question", ""),
        Answer: this.f.value[key]
      };
    });

    const postData = {
      userName: this.authData.username,
      password: this.authData.password,
      SecurityQuestionList: questionsDataArray,
      ipaddress: this.ipAddress,
      macaddress: "ec:aa:a0:2d:dc:67"
    };
    this.authService.saveSecurityQuestion(postData).subscribe(
      data => {
        this.router.navigate(["/web"]);
      },
      error => {
        this.loading = false;
      }
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
