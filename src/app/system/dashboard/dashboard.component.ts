import { Component, OnInit } from '@angular/core';
import { UsersService } from '../../_services/users.service';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { NgxSpinnerService } from "ngx-spinner";
import {Expired} from '../../_helper/expired';
import * as XLS from 'xlsx'
import { AccountStatService } from '../../_services/account-stat.service';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})


export class DashboardComponent implements OnInit {
  
  EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
  EXCEL_EXTENSION = '.xls';
  
  datas : any;
  income : any;
  msg : string = '';
  flag : number;
  Incomeflag : number;
  currentUser : any;
  monthYear : any;
  incomeNum : number;
  totexpense : number = 0;
  is_account_closed : any
  constructor(private userService : UsersService,private datePipe : DatePipe,private router: Router,private SpinnerService: NgxSpinnerService,private expired : Expired,private accountStat : AccountStatService) { }

  ngOnInit() {

    if(this.expired.checkExpired()){
      this.userService.logout();
      this.router.navigate(["/"]);
      return;
    }

    let dt = new Date();

    // let firstDay = this.datePipe.transform(new Date(dt.getFullYear(), dt.getMonth(), 1),"yyyy-MM-dd HH:mm:ss"); 
    // let lastDay = this.datePipe.transform(new Date(dt.getFullYear(), dt.getMonth() + 1, 0),"yyyy-MM-dd HH:mm:ss"); 

    let firstDay = this.datePipe.transform(new Date(dt.getFullYear(), dt.getMonth(), 1),"yyyy-MM-dd"); 
    let lastDay = this.datePipe.transform(new Date(dt.getFullYear(), dt.getMonth() + 1, 0),"yyyy-MM-dd");

    this.totexpense = 0;
    this.incomeNum = 0;
    var mm = this.datePipe.transform(new Date(),"MMMM");
    var yyyy = this.datePipe.transform(new Date(),"yyyy");
    this.monthYear = mm+"-"+yyyy;
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.flag = 0;
    this.msg = localStorage.hasOwnProperty('status') ? localStorage.getItem('status') : '';
    this.SpinnerService.show();
    
    this.userService.viewData(this.currentUser,firstDay,lastDay)
      .subscribe(data =>{

        if(data == "No data found"){
          this.flag = 1;
          this.SpinnerService.hide(); 
        }else{
          this.datas = data;
          this.flag = 0;
          data.forEach(element => {
            this.totexpense += element.amount
          });
          this.SpinnerService.hide(); 
        }
      },
      error =>{
        //console.log(error);
      });
    this.userService.viewIncome(this.currentUser,firstDay,lastDay)
      .subscribe(datass =>{
        if(datass == "No data found"){
          this.Incomeflag = 1;
        }else{
          this.income = datass;
          datass.forEach(element => {
            this.incomeNum += element.amount;
          });
          this.Incomeflag = 0;
        }
      },
      error =>{
        //console.log(error);
      });
    setTimeout(()=>{
      this.msg = '';
      localStorage.removeItem('status');
      
    }, 2000);

    //------------- Get Account stats ---------------//
    this.accountStat.getAccoutStat(this.currentUser,mm,yyyy)
      .subscribe(dataA =>{
        this.is_account_closed = dataA.msg;
      },error => {});
    //-------------------- END ---------------------//
  }

  OnRemove(id,amount,name){
  
    if(confirm("Are you sure?")) {
      var month = this.datePipe.transform(new Date(),"MMMM");
      var year = this.datePipe.transform(new Date(),"yyyy"); 
      this.userService.removeData(id,this.currentUser,amount,month,year,name).subscribe(async data =>{
        if(data == "deleted"){
          localStorage.setItem('status','Deleted successfully')
          alert('Deleted successfully');
        }else{
          localStorage.setItem('status','Something went wrong')
        }
      });
     
    }else{
      return;
    }
    setTimeout(()=>{
      this.ngOnInit();
    }, 1000);
  }

  export(){
    this.userService.exportToCSV(this.currentUser)
      .subscribe(res => {
        const worksheet: XLS.WorkSheet = XLS.utils.json_to_sheet(res);
        const workbook: XLS.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
      
        XLS.utils.book_append_sheet(workbook, worksheet, 'data1');
        XLS.writeFile(workbook, 'expenses.xls');
        alert('Downloaded.');
      }, err =>{
        //console.log('err',err);
      });
  }

}
