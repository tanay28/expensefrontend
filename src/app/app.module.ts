import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {ReactiveFormsModule,FormsModule} from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ConfirmEqualValidatorDirective } from './confirm-equal-validator.directive';
import { LoginFormComponent } from './login-form/login-form.component';
import { RegistrationComponent } from './registration/registration.component';
import { ForgetPasswordComponent } from './forget-password/forget-password.component';
import {AlertService} from './_services/alert.service';
import {UsersService} from './_services/users.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AuthGuardService } from './_guards/authguard.service';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import {DatePipe} from '@angular/common';

import { NgxSpinnerModule } from "ngx-spinner";
import { EmailService } from './_services/email.service';
import { ResetpasswordComponent } from './resetpassword/resetpassword.component';
import { InfoComponent } from './info/info.component';
import { StatementsService } from './_services/statements.service';


    @NgModule({
  declarations: [
    AppComponent,
    LoginFormComponent,
    RegistrationComponent,
    ForgetPasswordComponent,
    ResetpasswordComponent,
    InfoComponent,
    
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    NgbModule,
    NgxSpinnerModule,
    BrowserAnimationsModule
  ],
  providers: [
    AlertService,
    UsersService,
    AuthGuardService,
    DatePipe,
    EmailService,
    StatementsService,
    
  ],
  bootstrap: [AppComponent]
})
export class AppModule { 

  
}
