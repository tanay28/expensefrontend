import { Component, OnInit } from '@angular/core';
import {FormBuilder,FormGroup, Validators} from '@angular/forms';
import { DatePipe } from '@angular/common';
import { UsersService } from '../../_services/users.service';
import { Router } from '@angular/router';
import { NgxSpinnerService } from "ngx-spinner"; 
import * as XLS from 'xlsx'; 
import {Expired} from '../../_helper/expired';

@Component({
  selector: 'app-ledger',
  templateUrl: './ledger.component.html',
  styleUrls: ['./ledger.component.css']
})
export class LedgerComponent implements OnInit {

  fileName= 'ExcelSheet.xlsx';
  dataForm : FormGroup;
  submitted = false;
  year : any;
  month : any;
  msg : string = "";
  returnUrl : string;
  currentUser: any;
  currentEnd : any;
  dateSpec : boolean;
  ledgerData : any;
  monthYear : any;
  datedetails : any;
  start : any;
  end : any;
  dtOptions: DataTables.Settings = {};
  constructor( private fb: FormBuilder, private datePipe : DatePipe,private userService:UsersService,private router : Router,private SpinnerService: NgxSpinnerService,private expired : Expired) { }

  ngOnInit() {

    if(this.expired.checkExpired()){
      this.userService.logout();
      this.router.navigate(["/"]);
      return;
    }
    
    this.dtOptions = {
      pagingType: 'full_numbers'
    };
    this.SpinnerService.show(); 
     //---------- Find start date of a month -----------//
     this.datedetails = this.startOfMonth(new Date());
     var yyyy = this.datePipe.transform(this.datedetails,"yyyy");
     var mm = this.datePipe.transform(this.datedetails,"MM");
     var dd = this.datePipe.transform(this.datedetails,"dd");
     
     this.start = this.datePipe.transform(new Date(yyyy+"-"+mm+"-"+dd),"yyyy-MM-dd");
     //---------------------- END ---------------------//

     //---------- Find last date of a month -----------//
     this.datedetails = this.endOfMonth(new Date());
     var yyyy = this.datePipe.transform(this.datedetails,"yyyy");
     var mm = this.datePipe.transform(this.datedetails,"MM");
     var dd = this.datePipe.transform(this.datedetails,"dd");
     
     this.end = this.datePipe.transform(new Date(yyyy+"-"+mm+"-"+dd),"yyyy-MM-dd")
     //-------------------- END ----------------------//

    var yyyy = this.datePipe.transform(new Date(),"yyyy");
    var mm = this.datePipe.transform(new Date(),"MM");
    var dd = this.datePipe.transform(new Date(),"dd");
    var mon = this.datePipe.transform(new Date(),"MMMM");
    this.monthYear = mon+"-"+yyyy;
    this.currentEnd = {
       year  : parseInt(yyyy),
       month : parseInt(mm),
       day   : parseInt(dd)
     };
     

    this.dateSpec = false;
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.month = this.datePipe.transform(new Date(),"MMMM");

    this.dataForm = this.fb.group({
      dpf     : ["",Validators.required],
      dpt     : ["",Validators.required],
    });
    
    this.userService.getLedger(this.currentUser.email,this.start,this.end)
      .subscribe(datas =>{
        if(datas!="No data found"){
          this.ledgerData = datas;
          this.SpinnerService.hide();
        }else{
          this.ledgerData = false;
          this.SpinnerService.hide();
        }
      },error => {});
  }

  Oncurrent(){
    this.dateSpec = false;
    this.SpinnerService.show();
    this.userService.getLedger(this.currentUser.email,this.start,this.end)
      .subscribe(datas =>{
        if(datas!="No data found"){
          this.ledgerData = datas;
          this.SpinnerService.hide();
        }else{
          this.ledgerData = false;
          this.SpinnerService.hide();
        }
      },error => {});
  }

  startOfMonth(date){
    return new Date(date.getFullYear(), date.getMonth(), 1);
  }

  endOfMonth(date){
    return new Date(date.getFullYear(), date.getMonth() + 1, 0);
  }

  dateSpecific(){
    this.dateSpec = true;
  }
  get dval(){
    return this.dataForm.controls;
  }

  onSubmit(){
    this.submitted = true;
    if (this.dataForm.invalid) {
      return;
    }
    let dt; 
    dt = this.dval.dpf.value;
    let from = this.datePipe.transform(new Date(dt.year+"-"+dt.month+"-"+dt.day),"yyyy-MM-dd");
    dt = this.dval.dpt.value;
    let to = this.datePipe.transform(dt.year+"-"+dt.month+"-"+dt.day,"yyyy-MM-dd");
    this.SpinnerService.show();
    this.userService.getLedger(this.currentUser.email,from,to)
      .subscribe(datas =>{
        if(datas!="No data found"){
          this.ledgerData = datas;
          this.SpinnerService.hide();
        }else{
          this.ledgerData = false;
          this.SpinnerService.hide();
        }
      },error => {});
  }

  exportexcel(){
      
    let element = document.getElementById('excel-table'); 
    const ws: XLS.WorkSheet =XLS.utils.table_to_sheet(element);


    const wb: XLS.WorkBook = XLS.utils.book_new();
    XLS.utils.book_append_sheet(wb, ws, 'Sheet1');

    /* save to file */
    XLS.writeFile(wb, this.fileName);
			
  }


}
