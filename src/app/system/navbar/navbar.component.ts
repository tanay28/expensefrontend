import { Component, OnInit } from '@angular/core';
import { UsersService } from '../../_services/users.service';
import {FormBuilder,FormGroup, Validators} from '@angular/forms';
import { Router } from '@angular/router';
import {Expired} from '../../_helper/expired';
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  currentUser : any;
  name : string = "";
  email : string = "";
  formP : FormGroup;
  submitted = false;
  err : boolean = false;
  success : boolean = false;
  msg : string = "";
  constructor(private userService: UsersService,private router: Router,private expired : Expired,private fb: FormBuilder) { }

  ngOnInit() {
    this.submitted = false;
    this.err = false;
    this.success = false;
    this.msg = "";
    if(this.expired.checkExpired()){
      this.userService.logout();
      this.router.navigate(["/"]);
      return;
    }
    
    this.formP = this.fb.group({
      old     : ["",Validators.required],
      new     : ["",Validators.required],
      confirm : ["",Validators.required] 
    });
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.name = this.currentUser.name.toUpperCase();
    this.email = this.currentUser.email;

    //alert(this.name);
  }
  Onclick(){
    this.userService.logout();
    this.router.navigate(['/']);
  }
  get dval(){
    return this.formP.controls;
  }

  OnSubmit(){
    this.submitted = true;
    this.err = false;
    this.success = false;
    this.msg = "";

    if(this.dval.new.value != this.dval.confirm.value){
      this.err = true;
      this.msg = "Mismatch password..!!";
      return;
    }

    let obj = {
      oldp : this.dval.old.value,
      newp : this.dval.new.value,
    }
    console.log(obj);
    this.userService.changePassword(this.currentUser,obj)
      .subscribe(datas => {
        if(datas.status!='error'){
          this.success = true;
          this.msg = datas.msg;
          this.router.navigate(['/system/dashboard']);
          this.submitted = false;
          this.formP.reset();
        }else{
          this.err = true;
          this.msg = datas.msg;
        }
        
      }, err => {});
  }

  onReset(){
    this.success = false;
    this.msg = "";
    this.err = false;
    this.submitted = false;
    this.formP.reset();
  }
}
