import { Component, OnInit,NgZone } from '@angular/core';
import {FormBuilder,FormGroup, Validators} from '@angular/forms';
import { DatePipe } from '@angular/common';
import { StatementsService } from '../../_services/statements.service';
import { UsersService } from '../../_services/users.service'; 
import { Router } from '@angular/router';
import { NgxSpinnerService } from "ngx-spinner"; 
import { map, count } from 'rxjs/operators';
import {Expired} from '../../_helper/expired';
import { AccountStatService } from '../../_services/account-stat.service';
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";

am4core.useTheme(am4themes_animated);

@Component({
  selector: 'app-statements',
  templateUrl: './statements.component.html',
  styleUrls: ['./statements.component.css']
})
export class StatementsComponent implements OnInit {

  msg : string = "";
  submitted =false;
  months : any;
  years : number[] = [];
  dataForm : FormGroup;
  datedataForm : FormGroup;
  datedataFormv : FormGroup;
  datas : any = "";
  type : string = "";
  datedetails : any;
  currentEnd: any;
  start : any;
  end : any;
  monthYear : any;
  currentUser : any;
  month : any;
  total_income : number;
  total_expense : number;
  no_data : boolean = false;
  no_data_st : boolean = false;
  datewisev : boolean = false;
  private pchart : am4charts.PieChart;
  private lchart : am4charts.XYChart;
  pieData : any;
  lineData : any;
  lineData_inc : any;
  pieData_catag : any;
  is_account_closed : any;
  from_date : any;
  to_date : any;
  acc_month : any;
  acc_year : any;
  
  constructor(private fb: FormBuilder, private datePipe : DatePipe,private statementService:StatementsService,private router : Router,private SpinnerService: NgxSpinnerService,private expired : Expired, private userService : UsersService , private zone: NgZone, private accountStat : AccountStatService) { }

  ngOnInit() {
    this.no_data = false;
    this.datewisev = false;
    this.no_data_st = false;
    this.pieData = "";
    this.lineData = "";
    this.lineData_inc = "";
    this.pieData_catag = "";

    if(this.expired.checkExpired()){
      this.userService.logout();
      this.router.navigate(["/"]);
      return;
    }
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));

  
    this.SpinnerService.show();
    this.statementService.getVisualDateWise(this.currentUser,"","")
        .subscribe(async datass => {
          this.no_data = false;
          if(datass != 'No data found'){
            this.no_data = false;
            if(datass.line.length>0){
              datass.line.forEach((element : any,key:any) =>{
                const dt = new Date(element._id);
                datass.line[key]._id = this.datePipe.transform(dt,"yyyy-MM-dd");
              });
              this.lineData = datass.line;
            }
            if(datass.line_i.length>0) {
              datass.line_i.forEach((ele:any,key:any) =>{
                const dti = new Date(ele._id);
                datass.line_i[key]._id = this.datePipe.transform(dti,"yyyy-MM-dd");
              })
              this.lineData_inc = datass.line_i;
            }
            this.pieData = datass.pie;
            this.pieData_catag = datass.pie_cat;
          }else{
            this.no_data = true;
          }
        },error => {

      });
    this.total_income = 0;
    this.total_expense = 0;

    this.month = this.datePipe.transform(new Date(),"MMMM");
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
    
    this.end = this.datePipe.transform(new Date(yyyy+"-"+mm+"-"+dd),"yyyy-MM-dd");
    //-------------------- END ----------------------//

   var yyyy = this.datePipe.transform(new Date(),"yyyy");
   var mm = this.datePipe.transform(new Date(),"MM");
   var dd = this.datePipe.transform(new Date(),"dd");
   var mon = this.datePipe.transform(new Date(),"MMMM");
   this.monthYear = mon+"-"+yyyy;
    
  //------------- Get Account stats ---------------//
  this.accountStat.getAccoutStat(this.currentUser,mon,yyyy)
      .subscribe(dataA =>{
        this.is_account_closed = dataA.msg;
      },error => {});
 
  //-------------------- END ---------------------//

   this.currentEnd = {
      year  : parseInt(yyyy),
      month : parseInt(mm),
      day   : parseInt(dd)
    };


    this.months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December"
    ];

    let yy = parseInt(this.datePipe.transform(new Date(),"yyyy"));
   
    for(let i=yy-10;i<=yy;i++){
      this.years.push(i);
    }

    this.dataForm = this.fb.group({
      month : ["",Validators.required],
      year  : ["",Validators.required],
    });

    this.datedataForm = this.fb.group({
      dpf : ["",Validators.required],
      dpt  : ["",Validators.required],
    });

    this.datedataFormv = this.fb.group({
      dpf : ["",Validators.required],
      dpt  : ["",Validators.required],
    });

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

  get ddval(){
    return this.datedataForm.controls;
  }

  get vdval(){
    return this.datedataFormv.controls;
  }

  onSubmit(){

    this.submitted = true;
    this.no_data = false;
    this.total_income = 0;
    this.total_expense = 0;
    this.SpinnerService.show();
    
    if(this.type != "dates"){
      
      let month = this.dval.month.value;
      let year = this.dval.year.value;

      this.acc_month = month;
      this.acc_year = year;

      this.statementService.getDataMonWise(this.currentUser,month,year)
        .subscribe(async datass => {
          this.no_data_st = false;
          //console.log(datass);
          
            if(datass != 'No data found'){
              this.datas = JSON.parse(JSON.stringify(datass));
              
              this.datas.inc.forEach(element => {
                this.total_income += element.amount
              });
  
              this.datas.exp.forEach(element => {
                this.total_expense += element.amount
              });
              this.SpinnerService.hide();
            }else{
              this.no_data_st = true;
              this.SpinnerService.hide();
            }
         
          
          this.SpinnerService.hide();
          setTimeout(() =>{
            if(datass!="No data found"){
              window.scroll({
                top      : document.body.querySelector('#container').scrollHeight,
                left     : 0,
                behavior : 'smooth'
              });
            }
          },200);
        },error => {});
      
    }else{
      let dt; 
      dt = this.ddval.dpf.value;
      let from = this.datePipe.transform(new Date(dt.year+"-"+dt.month+"-"+dt.day),"yyyy-MM-dd");
      dt = this.ddval.dpt.value;
      let to = this.datePipe.transform(dt.year+"-"+dt.month+"-"+dt.day,"yyyy-MM-dd");
      
      this.from_date = from;
      this.to_date = to;

      this.statementService.getDataDateWise(this.currentUser,from,to)
        .subscribe(datass => {
          //console.log(datass);
          this.no_data_st = false;
          if(datass != 'No data found'){
            
            this.datas = JSON.parse(JSON.stringify(datass));
          
            this.datas.inc.forEach(element => {
              this.total_income += element.amount
            });

            this.datas.exp.forEach(element => {
              this.total_expense += element.amount
            });

            setTimeout(() =>{
              if(this.datas!=""){
                window.scroll({
                  top      : document.body.querySelector('#container').scrollHeight,
                  left     : 0,
                  behavior : 'smooth'
                });
              }
            },200);
            
          }else{
            this.no_data_st = true;
            this.SpinnerService.hide();
          }
          this.SpinnerService.hide();
          setTimeout(() =>{
            if(datass!="No data found"){
              window.scroll({
                top      : document.body.querySelector('#container').scrollHeight,
                left     : 0,
                behavior : 'smooth'
              });
            }
          },200);
        },errors =>{
          console.log(errors);
        });
    }
  }

  onChange(event){
    this.type = "";
    this.datas = "";
    this.submitted = false;
    this.type = event.target.value;
  }

  chart_exp_vs_inc(){
    
    let chart = am4core.create("chartdiv_exp_vs_inc", am4charts.PieChart);
    chart.hiddenState.properties.opacity = 0;
    this.pchart = chart;
    
    
    this.pchart.data = this.pieData;
    
    let series = this.pchart.series.push(new am4charts.PieSeries());
    series.dataFields.value = "value";
    series.dataFields.radiusValue = "value";
    series.dataFields.category = "type";
    series.slices.template.cornerRadius = 6;
    series.colors.step = 3;
    series.hiddenState.properties.endAngle = -90;
    this.pchart.legend = new am4charts.Legend();
  }

  chart_exp_catagwise(){
    
    let chart = am4core.create("chartdiv_exp_catag", am4charts.XYChart);
    //chart.hiddenState.properties.opacity = 0;
    //this.pchart = chart;
    
    
    chart.data = this.pieData_catag ;
    
    // let series = this.pchart.series.push(new am4charts.PieSeries());
    // series.dataFields.value = "total";
    // series.dataFields.radiusValue = "total";
    // series.dataFields.category = "_id";
    // series.slices.template.cornerRadius = 6;
    // series.colors.step = 3;
    // series.hiddenState.properties.endAngle = -90;
    // this.pchart.legend = new am4charts.Legend();

    let categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = "_id";
    categoryAxis.renderer.labels.template.rotation = 270;
    categoryAxis.renderer.labels.template.hideOversized = false;
    categoryAxis.renderer.minGridDistance = 10;
    categoryAxis.renderer.labels.template.horizontalCenter = "right";
    categoryAxis.renderer.labels.template.verticalCenter = "middle";
    categoryAxis.tooltip.label.rotation = 270;
    categoryAxis.tooltip.label.horizontalCenter = "right";
    categoryAxis.tooltip.label.verticalCenter = "middle";

    let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.title.text = "Total";
    valueAxis.title.fontWeight = "bold";

    // Create series
    let series = chart.series.push(new am4charts.ColumnSeries());
    series.dataFields.valueY = "total";
    series.dataFields.categoryX = "_id";
    series.name = "total";
    series.tooltipText = "{categoryX}: Rs.[bold]{valueY}[/]";
    series.columns.template.fillOpacity = .8;

    let columnTemplate = series.columns.template;
    columnTemplate.strokeWidth = 2;
    columnTemplate.strokeOpacity = 1;
    columnTemplate.stroke = am4core.color("#FFFFFF");

    columnTemplate.adapter.add("fill", function(fill, target) {
      return chart.colors.getIndex(target.dataItem.index);
    })

    columnTemplate.adapter.add("stroke", function(stroke, target) {
      return chart.colors.getIndex(target.dataItem.index);
    })

    chart.cursor = new am4charts.XYCursor();
    chart.cursor.lineX.strokeOpacity = 0;
    chart.cursor.lineY.strokeOpacity = 0;

  }

  chart_exp_growth(){
    let chart = am4core.create("chartdiv_growth_exp", am4charts.XYChart);
    //chart.paddingRight = 20;
    chart.dateFormatter.inputDateFormat = "yyyy-MM-dd";
    this.lchart = chart;
    
    // Add data
    this.lchart.data = this.lineData;
   
   // Create axes
    let dateAxis = this.lchart.xAxes.push(new am4charts.CategoryAxis());
    
    dateAxis.renderer.grid.template.location = 0;
    dateAxis.renderer.axisFills.template.disabled = true;
    dateAxis.renderer.ticks.template.disabled = true;

    dateAxis.dataFields.category = "_id";
    dateAxis.renderer.minGridDistance = 50;
    dateAxis.renderer.grid.template.location = 0.5;
    dateAxis.startLocation = 0.5;
    dateAxis.endLocation = 0.5;
    dateAxis.renderer.labels.template.rotation = 60;

    // Create value axis
    let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.tooltip.disabled = true;
    valueAxis.renderer.minWidth = 35;
    valueAxis.renderer.axisFills.template.disabled = true;
    valueAxis.renderer.ticks.template.disabled = true;
    //valueAxis.baseValue = 0;

    // Create series
    let series =  this.lchart.series.push(new am4charts.LineSeries());
    series.dataFields.valueY = "amount";
    series.dataFields.categoryX = "_id";
    series.stroke = am4core.color("#ff0000"); // red
    series.strokeWidth = 2;
    series.tensionX = 0.77;
    series.fillOpacity = 0.5;
    series.fill = am4core.color("#ff0000"); // red;
    series.tooltipText = "Rs. {valueY}";

    // bullet is added because we add tooltip to a bullet for it to change color
    let bullet = series.bullets.push(new am4charts.Bullet());
    bullet.tooltipText = "{valueY}";
    bullet.fill = am4core.color("#ff0000"); // red
    
    let range = valueAxis.createSeriesRange(series);
    range.value = 0;
    range.endValue = 0;
    range.contents.stroke = am4core.color("#ff0000");
    range.contents.fill = range.contents.stroke;

    // Add scrollbar
    let scrollbarX = new am4charts.XYChartScrollbar();
    scrollbarX.series.push(series);
    this.lchart.scrollbarX = scrollbarX;

    this.lchart.cursor = new am4charts.XYCursor();

  }

  chart_inc_growth(){
    let chart = am4core.create("chartdiv_growth_inc", am4charts.XYChart);
    //chart.paddingRight = 20;
    this.lchart = chart;
    //this.lchart.dateFormatter.inputDateFormat = "yyyy-MM-dd";
    // Add data
    this.lchart.data = this.lineData_inc;
    // chart.data = [{
    //   "dt_on": "2012-07-27",
    //   "value": 13
    // }];

   // Create axes
    let categoryAxis = this.lchart.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = "_id";
    categoryAxis.renderer.minGridDistance = 50;
    categoryAxis.renderer.grid.template.location = 0.5;
    categoryAxis.startLocation = 0.5;
    categoryAxis.endLocation = 0.5;
    categoryAxis.renderer.labels.template.rotation = 60;
    // categoryAxis.dateFormatter = new am4core.DateFormatter();
    //categoryAxis.dateFormatter.dateFormat = "MM-dd";

    // Create value axis
    let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.baseValue = 0;

    // Create series
    let series =  this.lchart.series.push(new am4charts.LineSeries());
    series.dataFields.valueY = "amount";
    series.dataFields.categoryX = "_id";
    series.strokeWidth = 2;
    series.fillOpacity = 0.5;
    series.tensionX = 0.77;
    
    // bullet is added because we add tooltip to a bullet for it to change color
    let bullet = series.bullets.push(new am4charts.Bullet());
    bullet.tooltipText = "Rs. {valueY}";

    
    let range = valueAxis.createSeriesRange(series);
    range.value = 0;
    range.endValue = 0;
    range.contents.stroke = am4core.color("#FF0000");
    range.contents.fill = range.contents.stroke;
    
    // Add scrollbar
    let scrollbarX = new am4charts.XYChartScrollbar();
    scrollbarX.series.push(series);
    this.lchart.scrollbarX = scrollbarX;

    this.lchart.cursor = new am4charts.XYCursor();

  }
  ngAfterViewInit(){
    
    setTimeout(() => {
      this.zone.runOutsideAngular(() => {
        
        if(this.lineData.length>0){
          this.chart_exp_growth();
        }

        if(this.lineData_inc.length>0){
          this.chart_inc_growth();
        }
        
        if(this.pieData.length>0){
          this.chart_exp_vs_inc();
        }

        if(this.pieData_catag.length>0){
          this.chart_exp_catagwise();
        }
      })
      this.SpinnerService.hide();
    },2000);
    
  }

  ngOnDestroy() {
    this.zone.runOutsideAngular(() => {
      if (this.pchart) {
        this.pchart.dispose();
      }
      if (this.lchart) {
        this.lchart.dispose();
      }
      // this.pchart.dispose();
      // this.lchart.dispose();
    });
  }

  onVisualChange(event){
    
    this.datewisev = false;
    this.no_data = false;
    if(event.target.value == "datewise"){
      this.datewisev = true;
    
    }else{
      this.datewisev = false;
      this.submitted = false;
      this.datedataFormv.reset();
      this.SpinnerService.show();
      this.statementService.getVisualDateWise(this.currentUser,"","")
        .subscribe(async datass => {
          console.log(datass);
          //return;
          if(datass){
            if(datass.line.length>0){
              datass.line.forEach((ele:any,key:any) =>{
                const dt = new Date(ele._id);
                datass.line[key]._id = this.datePipe.transform(dt,"yyyy-MM-dd");
              });
              this.lineData = datass.line;
            }
            if(datass.line_i.length>0){
              datass.line_i.forEach((ele:any,key:any) =>{
                const dt = new Date(ele._id);
                datass.line_i[key]._id = this.datePipe.transform(dt,"yyyy-MM-dd");
              });
              this.lineData_inc = datass.line_i;
            }
            this.pieData = datass.pie;
            this.pieData_catag = datass.pie_cat;
          }
        },error => {
          
      });
      this.ngAfterViewInit();

    }
  }

  onSubmitVusual(){
    this.submitted = true;
    this.no_data =false;
    if(this.datedataFormv.invalid){
      return false;
    }
    let dt;
    dt = this.vdval.dpf.value;
    let from = this.datePipe.transform(new Date(dt.year+"-"+dt.month+"-"+dt.day),"yyyy-MM-dd");
    dt = this.vdval.dpt.value;
    let to = this.datePipe.transform(dt.year+"-"+dt.month+"-"+dt.day,"yyyy-MM-dd");

    this.SpinnerService.show();
      this.statementService.getVisualDateWise(this.currentUser,from,to)
        .subscribe(async datass => {
          console.log(datass);
          //return;
          if(datass){
            if(datass.line.length>0){
              datass.line.forEach((ele:any,key:any) =>{
                const dt = new Date(ele._id);
                datass.line[key]._id = this.datePipe.transform(dt,"yyyy-MM-dd");
              });
              this.lineData = datass.line;
            }
            if(datass.line_i.length>0){
              datass.line_i.forEach((ele:any,key:any) =>{
                const dt = new Date(ele._id);
                datass.line_i[key]._id = this.datePipe.transform(dt,"yyyy-MM-dd");
              });
              this.lineData_inc = datass.line_i;
            }
            this.pieData = datass.pie;
            this.pieData_catag = datass.pie_cat;
          }
        },error => {
          //this.SpinnerService.hide();
      });
      this.ngAfterViewInit();
      //this.SpinnerService.hide();

  }

  closeAcc(){

    // alert(this.type);
    // alert(this.from_date);
    // alert(this.to_date);
    // alert(this.acc_month);
    // alert(this.acc_year);
    // return;

    // if(this.type != 'dates'){
      
    // }

    if(confirm("Are you sure..?")){
      var month = this.datePipe.transform(new Date(),"MMMM");
      var year = this.datePipe.transform(new Date(),"yyyy");

      this.statementService.closeAccount(this.currentUser,this.start,this.end,month,year)
        .subscribe(datas => {
          if(datas.status == 'success'){
            console.log(datas.data);
            this.router.navigate(['/system/dashboard']);
            alert('Account closed successfully for the current month.');
          }else{
            alert('Something went wrong..!! Please contact admin.');
          }
        },error => {});
    }
  }
}
