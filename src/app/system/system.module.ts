import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard/dashboard.component';
import { NavbarComponent } from './navbar/navbar.component';
import { ExpensesComponent } from './expenses/expenses.component';
import { IncomeComponent } from './income/income.component';
import { LedgerComponent } from './ledger/ledger.component';
import { routes } from './system.routing';
import { RouterModule } from '@angular/router';
import {DatePipe} from '@angular/common';
import { NgxSpinnerModule } from "ngx-spinner";
import {AlertService} from '../_services/alert.service';
import {UsersService} from '../_services/users.service';
import {ReactiveFormsModule,FormsModule} from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ConfirmEqualValidatorDirective } from '../confirm-equal-validator.directive';
import { AuthGuardService } from '../_guards/authguard.service';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DataTablesModule } from 'angular-datatables';
import {Expired} from '../_helper/expired';
import { AccountStatService } from '../_services/account-stat.service';
import {MatTableModule} from '@angular/material';
import { StatementsComponent } from './statements/statements.component';
import { StatementsService } from '../_services/statements.service';
import { JwtInterceptor } from '../_guards/jwt.interceptor.service';
import { ErrorInterceptor } from '../_guards/error.interceptor';
@NgModule({
  declarations: [
    DashboardComponent,
    NavbarComponent,
    ExpensesComponent,
    IncomeComponent,
    LedgerComponent,
    ConfirmEqualValidatorDirective,
    StatementsComponent,
  ],
  imports: [
    CommonModule,
   // BrowserModule,
    NgbModule,
    NgxSpinnerModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatTableModule,
    DataTablesModule,
  
    RouterModule.forChild(routes)
  ],
  providers: [
    AlertService,
    UsersService,
    AuthGuardService,
    DatePipe,
    StatementsService,
    Expired,
    AccountStatService,
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
  ],
})
export class SystemModule { }
