import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { DatePipe } from '@angular/common';
import { Observable } from 'rxjs';
import { UsersService } from '../_services/users.service';
@Injectable()
export class Expired {

    token : any;
    status = true;
    constructor(private datePipe : DatePipe, private userService : UsersService){
        this.token = localStorage.getItem('token');
    }

    checkExpired(){
        
        let helper = new JwtHelperService()
        const expirationDate = this.datePipe.transform(helper.getTokenExpirationDate(this.token),'dd/MM/yyyy hh:mm:ss');
        //console.log('expire',expirationDate) ;
        this.status = helper.isTokenExpired(this.token);
        //return this.status;
        return false;
    }

    checkExpired_for_refresh(){
        let helper = new JwtHelperService()
        const expirationDate = this.datePipe.transform(helper.getTokenExpirationDate(this.token),'dd/MM/yyyy hh:mm:ss');
        //console.log('expire',expirationDate) ;
        this.status = helper.isTokenExpired(this.token);
        
        return this.status;

    }

}
