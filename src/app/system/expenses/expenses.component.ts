import { Component, OnInit } from '@angular/core';
import {FormBuilder,FormGroup, Validators} from '@angular/forms';
import { DatePipe } from '@angular/common';
import { UsersService } from '../../_services/users.service';
import { Router } from '@angular/router';
import {Expired} from '../../_helper/expired';
import { AccountStatService } from '../../_services/account-stat.service';
@Component({
  selector: 'app-expenses',
  templateUrl: './expenses.component.html',
  styleUrls: ['./expenses.component.css']
})
export class ExpensesComponent implements OnInit {

  customflag : boolean;
  customflagErr : boolean;
  dataForm : FormGroup;
  submitted = false;
  currentStart : any;
  currentEnd : any;
  types: any = ['Transport', 'Fooding', 'Rent', 'Custom']
  returnUrl : string;
  currentUser: any;
  datedetails : any;
  monthYear : any;
  year : any;
  month : any;
  is_account_closed : any;
  constructor(private fb: FormBuilder, private datePipe : DatePipe,private userService:UsersService,private router : Router,private expired : Expired,private accountStat : AccountStatService) { }

  ngOnInit() {

    if(this.expired.checkExpired()){
      this.userService.logout();
      this.router.navigate(["/"]);
      return;
    }
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    //------------ Get Type ------------//
    this.userService.getType(this.currentUser)
      .subscribe(datas =>{
       
        if(datas.code == 200 && datas.data.length>0){
          //this.types = ['Custom'];
          //this.types = datas.data;
          this.types = [...datas.data,'Custom'];

          console.log('types',this.types);

        }else{
          this.types = ['Transport', 'Fooding', 'Rent', 'Custom'];
        }
      },err =>{});
    //-------------- END -------------//
    
    
    
    //---------- Find start date of a month -----------//
    this.datedetails = this.startOfMonth(new Date());
    var yyyy = this.datePipe.transform(this.datedetails,"yyyy");
    var mm = this.datePipe.transform(this.datedetails,"MM");
    var dd = this.datePipe.transform(this.datedetails,"dd");
    this.currentStart = {
      year  : parseInt(yyyy),
      month : parseInt(mm),
      day   : parseInt(dd)
    };
    //---------------------- END ---------------------//

    //---------- Find last date of a month -----------//
    //this.datedetails = this.endOfMonth(new Date());
    var yyyy = this.datePipe.transform(new Date(),"yyyy");
    var mm = this.datePipe.transform(new Date(),"MM");
    var dd = this.datePipe.transform(new Date(),"dd");

    this.month = this.datePipe.transform(new Date(),"MMMM");
    this.year = this.datePipe.transform(new Date(),"yyyy"); 
    var mon = this.datePipe.transform(new Date(),"MMMM");
    this.monthYear = mon+"-"+yyyy;
    this.currentEnd = {
      year  : parseInt(yyyy),
      month : parseInt(mm),
      day   : parseInt(dd)
    };
    //-------------------- END ----------------------//

    //------------- Get Account stats ---------------//
    this.accountStat.getAccoutStat(this.currentUser,mon,yyyy)
    .subscribe(dataA =>{
      this.is_account_closed = dataA.msg;
    },error => {});
    //-------------------- END ---------------------//

    this.customflag = false;
    this.customflagErr = false;
    this.dataForm = this.fb.group({
      name       : ["",Validators.required],
      type       : ["",Validators.required],
      customtype : [""],
      amount     : ["",Validators.required],
      dp         : ["",Validators.required],
      place      : ["",Validators.required]
    });
  }
  endOfMonth(date){
    return new Date(date.getFullYear(), date.getMonth() + 1, 0);
  }
  Onchange(value){
    if(value.toLowerCase() == "custom"){
      this.customflag = true;
    }else{
      this.customflag = false;
    }
  }
  startOfMonth(date){
    return new Date(date.getFullYear(), date.getMonth(), 1);
  }
  get dval(){
    return this.dataForm.controls;
  }
  onSubmit(){
    this.submitted = true;

    // console.log(this.dval);
    // console.log(this.dval.name.status);
    // return;
    var yr = this.dval.dp.value.year;
    var month = this.dval.dp.value.month;
    var day = this.dval.dp.value.day;
    
    var dt = new Date(`${yr}-${month}-${day}`);
    
    if (this.dataForm.invalid) {
      return;
    }else if(this.customflag == true && this.dval.customtype.value == ""){
      this.customflagErr = true;
      return;
    }
    let data = {};
    if(!this.customflag){
      data = {
        name   : this.dval.name.value,
        type   : this.dval.type.value,
        amount : this.dval.amount.value,
        dt_on  : this.datePipe.transform(dt,"yyyy-MM-dd"),
        place  : this.dval.place.value,
        user   : this.currentUser.email,
        month  : this.month,
        year   : this.year
      };
    }else{
      data = {
        name   : this.dval.name.value,
        type   : this.dval.customtype.value,
        amount : this.dval.amount.value,
        dt_on  : this.datePipe.transform(dt,"yyyy-MM-dd"),
        place  : this.dval.place.value,
        user   : this.currentUser.email,
        month  : this.month,
        year   : this.year
      };
    }


    this.userService.addData(data)
      .subscribe(async data =>{
        if(Object.keys(data).length){
          this.returnUrl = "/system/dashboard";
          localStorage.setItem('status','Saved successfully');
        }else{
          this.returnUrl = "/system/dashboard";
          localStorage.setItem('status','Something went wrong');
        }
        this.router.navigate([this.returnUrl]);
      });

  }
}
