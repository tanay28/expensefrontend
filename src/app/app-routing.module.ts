import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginFormComponent } from './login-form/login-form.component';
import { RegistrationComponent } from './registration/registration.component';
import { ForgetPasswordComponent } from './forget-password/forget-password.component';
import { ResetpasswordComponent } from './resetpassword/resetpassword.component';
import { InfoComponent } from './info/info.component';

const routes: Routes = [

  {path:"", component:LoginFormComponent},
  {path:"registration", component: RegistrationComponent},
  {path:"forgetpassword", component: ForgetPasswordComponent},
  {path:"resetpassword",component:ResetpasswordComponent},
  {path:"info",component:InfoComponent},
  { path: 'system', loadChildren: () => import('./system/system.module').then(m => m.SystemModule) }];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
