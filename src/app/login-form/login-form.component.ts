import { Component, OnInit } from '@angular/core';
import {FormBuilder,FormGroup, Validators} from '@angular/forms';
import { UsersService } from '../_services/users.service';
import { AlertService } from '../_services/alert.service';
import { Router } from '@angular/router';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.css']
})
export class LoginFormComponent implements OnInit {

  loginForm : FormGroup;
  submitted : boolean;
  authData : any;
  currentUser;
  returnUrl;
  status : string = "";
  constructor(private fb: FormBuilder,private userService:UsersService,private alertService : AlertService,private router: Router) { }

  ngOnInit() {

    
    //alert(getMAC());
    //-------- Reset all credentials ----------//
    // localStorage.removeItem('currentUser');
	  // localStorage.removeItem('token');
	  // localStorage.removeItem('status');
    // localStorage.clear();
    // this.router.navigate(['/']);
    //----------------- END ------------------//
    this.submitted = false;
    this.status = "";
    this.loginForm = this.fb.group({

      email    : ["",Validators.required],
      password : ["",Validators.required]
    });
  }

  get fval(){
    return this.loginForm.controls;
    
  }

  onSubmit(){
    this.submitted = true;
    
    
    if (this.loginForm.invalid) {
      return;
    }
    this.status = "";
    
    this.userService.login(this.fval.email.value,this.fval.password.value)
      .pipe(first())
      .subscribe(async data =>{
        //console.log(data);
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
        const token = localStorage.getItem('token');

        //console.log(this.currentUser);

        if(this.currentUser.role == 1){
          this.returnUrl = '/system/dashboard';
        }else{
          this.returnUrl = "";
          this.router.navigate([this.returnUrl]);
        }
        this.router.navigate([this.returnUrl]);
        
      },
      error =>{
        // console.log(error);
        // return;
        // this.status = "";
        this.status = error.error.message;
        // // console.log(error.error.status);
        // // console.log(error.error.code);
        // // console.log(error.error.message);
        return false;
    });
  }

}
