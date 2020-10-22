import { Component, OnInit } from '@angular/core';
import {FormBuilder,FormGroup, Validators} from '@angular/forms';
import { DatePipe } from '@angular/common';
import { UsersService } from '../../_services/users.service';
import { Router } from '@angular/router';
import {Expired} from '../../_helper/expired';
import { AccountStatService } from '../../_services/account-stat.service';
@Component({
  selector: 'app-income',
  templateUrl: './income.component.html',
  styleUrls: ['./income.component.css']
})
export class IncomeComponent implements OnInit {

  customflag : boolean;
  customflagErr : boolean;
  dataForm : FormGroup;
  submitted = false;
  year : any;
  month : any;
  currentStart : any;
  currentEnd : any;
  types: any = ['Transport', 'Fooding', 'Rent', 'Custom']
  returnUrl : string;
  currentUser: any;
  datedetails : any;
  monthYear : any;
  is_account_closed : any;
  constructor(private fb: FormBuilder, private datePipe : DatePipe,private userService:UsersService,private router : Router,private expired : Expired,private accountStat : AccountStatService) { }

  ngOnInit() {

    if(this.expired.checkExpired()){
      this.userService.logout();
      this.router.navigate(["/"]);
      return;
    }
    
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));

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
 
     //---------- Find current date of a month -----------//
     //this.datedetails = this.endOfMonth(new Date());
     var yyyy = this.datePipe.transform(new Date(),"yyyy");
     var mm = this.datePipe.transform(new Date(),"MM");
     var dd = this.datePipe.transform(new Date(),"dd");
     this.currentEnd = {
       year  : parseInt(yyyy),
       month : parseInt(mm),
       day   : parseInt(dd)
     };
     //-------------------- END ----------------------//

    this.month = this.datePipe.transform(new Date(),"MMMM");
    this.year = this.datePipe.transform(new Date(),"yyyy"); 
    var mon = this.datePipe.transform(new Date(),"MMMM");
    this.monthYear = mon+"-"+yyyy;
    this.dataForm = this.fb.group({
      source     : ["",Validators.required],
      amount     : ["",Validators.required],
      dp         : ["",Validators.required]
    });

     //------------- Get Account stats ---------------//
     this.accountStat.getAccoutStat(this.currentUser,mon,yyyy)
     .subscribe(dataA =>{
       this.is_account_closed = dataA.msg;
     },error => {});
     //-------------------- END ---------------------//
  }

  startOfMonth(date){
    return new Date(date.getFullYear(), date.getMonth(), 1);
  }

  endOfMonth(date){
    return new Date(date.getFullYear(), date.getMonth() + 1, 0);
  }
  get dval(){
    return this.dataForm.controls;
  }

  onSubmit(){
    this.submitted = true;

    var yr = this.dval.dp.value.year;
    var month = this.dval.dp.value.month;
    var day = this.dval.dp.value.day;
    
    var dt = new Date(`${yr}-${month}-${day}`);
    
    if (this.dataForm.invalid) {
      return;
    }
    let income = {};
    income = {
      source : this.dval.source.value,
      amount : this.dval.amount.value,
      user   : this.currentUser.email,
      month  : this.month,
      year   : this.year,
      dt_on  : this.datePipe.transform(dt,"yyyy-MM-dd"),
      date   : new Date()
    };
    this.userService.validateIncome( this.currentUser.email,this.month,this.year)
      .subscribe(data =>{
        if(data){
          this.userService.addIncome(income)
            .subscribe(datas =>{
              console.log(datas);
              localStorage.setItem('status','Saved successfully');
              this.router.navigate(['/system/dashboard']);
            },
            error => {

            });
        }else{
          localStorage.setItem('status','You have already added for this month. Please add your income next month');
          this.router.navigate(['/system/dashboard']);
        }
      },
      error =>{});
  }
}
