import { Component, OnInit } from '@angular/core';
import {FormBuilder,FormGroup, Validators} from '@angular/forms';
import { ConfirmEqualValidatorDirective } from '../confirm-equal-validator.directive';
import { UsersService } from '../_services/users.service';
import { AlertService } from '../_services/alert.service';
import { first } from 'rxjs/operators';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {

  registrtionFrm : FormGroup;
  submitted = false;
  error: any;
  userData : any;
  userExists = false; 
  constructor(private fb: FormBuilder,private userService:UsersService,private alertService : AlertService,private router: Router) { }

  ngOnInit() {

    this.registrtionFrm = this.fb.group({
      firstname  : ['',Validators.required],
      lastname   : ['',Validators.required],
      email      : ['',[Validators.required,Validators.email]],
      password   : ['',[Validators.required,Validators.minLength(6)]],
      repassword : ['',[Validators.required,Validators.minLength(6)]],
    });
  }
  get fval(){
    return this.registrtionFrm.controls;
    
  }
  onBlur(event){
    this.userExists = false;
    var email = event.target.value;
   
    this.userService.validateUser(email)
      .subscribe(data =>{
        if(data == 'exists'){
          this.userExists = true;
        }
      })
  }
  onSubmit(){

    this.submitted = true;
    if (this.registrtionFrm.invalid) {
      return;
    }

    if(this.userExists == true){
      return
    }
    
    //console.log(this.registrtionFrm.value);

    this.userData = {
      firstname : this.fval.firstname.value,
      lastname  : this.fval.lastname.value,
      email     : this.fval.email.value,
      password  : this.fval.password.value
    };
    this.userService.register(this.userData)
      .pipe(first())
      .subscribe(
          data => {

            this.alertService.success('Registration successful', true);
            this.router.navigate(['/']);
          },
          error => {
              this.error = error;
              this.alertService.error(error);
          });
    
  }

}
