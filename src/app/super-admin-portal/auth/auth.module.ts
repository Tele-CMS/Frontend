import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthComponent } from './auth/auth.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AuthRoutingModule } from './auth.routing';
import { AuthenticationService } from './auth.service';
import { MatButtonModule, MatInputModule } from '@angular/material';
import { LoginComponent } from './login/login.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    AuthRoutingModule,
    MatButtonModule,
    MatInputModule
  ],
  declarations: [
    AuthComponent,
    LoginComponent,
    ForgotPasswordComponent
  ],
  providers: [
    AuthenticationService
  ]
})
export class AuthModule { }
