import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";

@Component({
  selector: 'app-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.css']
})
export class InfoComponent implements OnInit {

  msg : any = "";
  constructor(private router: Router) { }

  ngOnInit() {
    this.msg = localStorage.getItem("status");
  }

  onClick(){
    localStorage.removeItem("status");
    this.msg = "";
    this.router.navigate(["/"]);
  }

}
