import { Component, OnInit } from '@angular/core';
import { FormBuilder,FormGroup, Validators } from '@angular/forms';
import { UsersService } from '../_services/users.service';
import { EmailService } from '../_services/email.service';
import { Router } from '@angular/router';
import { NgxSpinnerService } from "ngx-spinner"; 
@Component({
  selector: 'app-forget-password',
  templateUrl: './forget-password.component.html',
  styleUrls: ['./forget-password.component.css']
})
export class ForgetPasswordComponent implements OnInit {

  frmPassRecovery : FormGroup
  submitted = false;
  userEmail : any;
  constructor( private fb : FormBuilder,private UsersService : UsersService,private emailS : EmailService,private router:Router,private SpinnerService: NgxSpinnerService) { }

  ngOnInit() {
    this.frmPassRecovery = this.fb.group({
      email : ["",Validators.required]
    });
  }

  get fval(){
    return this.frmPassRecovery.controls;
  }
  onSubmit(){
    
    this.submitted = true;
    if(this.frmPassRecovery.invalid){
      return;
    }
    this.SpinnerService.show();
    this.userEmail = this.fval.email.value;
    this.UsersService.validateUser(this.userEmail)
      .subscribe(res => {
        if(res == "exists"){
          localStorage.setItem("useremail",this.userEmail);
          localStorage.setItem('status','Please check your mail for password reset link. The link is valid for 10 minutes.');
          this.emailS.sendMail(this.userEmail)
            .subscribe(edata =>{
              console.log(edata);
              this.SpinnerService.hide();
              this.router.navigate(["/info"]);
            },eerr =>{
              console.log(eerr);
            });
        }else{
          localStorage.setItem('status','User not found');
          this.router.navigate(["/info"]);
        }
      },err =>{});
    
  }

}
