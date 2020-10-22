import { Component, OnInit } from '@angular/core';
import { FormBuilder,FormGroup, Validators } from '@angular/forms';
import { UsersService } from '../_services/users.service';
import { EmailService } from '../_services/email.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-resetpassword',
  templateUrl: './resetpassword.component.html',
  styleUrls: ['./resetpassword.component.css']
})
export class ResetpasswordComponent implements OnInit {

  frmPassRecovery : FormGroup
  submitted = false;

  constructor(private fb : FormBuilder,private UsersService : UsersService,private router:Router, private emailS : EmailService) { }

  ngOnInit() {
    
    let email = localStorage.getItem("useremail");
    this.emailS.validatelink(email)
      .subscribe(res => {
        console.log(res);
        if(!res){
          localStorage.setItem("status","Sorry...!! Link expired.");
          this.router.navigate(["/info"]);
          return;
        }
      },err => {})

    this.frmPassRecovery = this.fb.group({
      newpass : ["",Validators.required],
      conpass : ["",Validators.required]
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

    if(this.fval.newpass.value != this.fval.conpass.value){
      localStorage.setItem('status','Mismatch password');
      return;
    }

    let newpass = this.fval.newpass.value;
    //let conpass = this.fval.conpass.value;
    let email = localStorage.getItem("useremail");

    let obj = {
      email : email,
      pass  : newpass
    };

    this.UsersService.resetpass(obj)
      .subscribe(res => {
        if(res){
          localStorage.setItem("status","Password reset successful.");
          this.router.navigate(["/info"]);
        }
      },err => {});
  }

}
