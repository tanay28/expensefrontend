import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment} from '../../environments/environment'
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AccountStatService {

  constructor(private httpClient:HttpClient) { }

  getAccoutStat(currentUser,month,year){

    // let headers = new HttpHeaders({
    //   'Content-Type': 'application/json',
    //   'authorization': localStorage.getItem('token'),  
    // });
    // let options = { headers: headers };

    
    let datas = {
      email : currentUser.email,
      month : month,
      year  : year
    };
    
    return this.httpClient.post<any>(`${environment.apiUrl}/api/statement/accountStats`,datas)
      .pipe(map(data => {
        return data;
    }));
    }
}
