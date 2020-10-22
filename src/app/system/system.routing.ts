import { NgModule } from '@angular/core';
import { Routes,RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AuthGuardService } from '../_guards/authguard.service';
import { ExpensesComponent } from './expenses/expenses.component';
import { IncomeComponent } from './income/income.component';
import { LedgerComponent } from './ledger/ledger.component'; 
import { StatementsComponent } from './statements/statements.component';

export const routes: Routes = [
    {
        path:"dashboard", 
        component: DashboardComponent, 
        canActivate: [AuthGuardService],
        data: {
            permission:{
                only:[1],
                redirectTo: 'login'
            }
        }
    },
    {
        path:"addexpense", 
        component: ExpensesComponent, 
        canActivate: [AuthGuardService],
        data: {
            permission:{
                only:[1],
                redirectTo: 'login'
            }
        }
    },
    {
        path:"addincome", 
        component: IncomeComponent, 
        canActivate: [AuthGuardService],
        data: {
            permission:{
                only:[1],
                redirectTo: 'login'
            }
        }
    },
    {
        path:"viewledger", 
        component: LedgerComponent, 
        canActivate: [AuthGuardService],
        data: {
			permission: {
                only: [1],
				redirectTo: 'login'
            }
        }
    
    },
    {
        path:"statement", 
        component: StatementsComponent, 
        canActivate: [AuthGuardService],
        data: {
			permission: {
                only: [1],
				redirectTo: 'login'
            }
        }
    
    },
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class SystemRouting { }

