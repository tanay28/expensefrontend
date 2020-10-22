import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment} from '../../environments/environment'
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

const httpOptions = {
  headers: new HttpHeaders({ 
    'Access-Control-Allow-Origin':'*'
  })
};

@Injectable({
  providedIn: 'root'
})
export class EmailService {

  constructor(private httpClient:HttpClient) { }

  sendMail(email : any) {

    return this.httpClient.post<any>(`${environment.apiUrl}/api/forgotpasswordmail/sent`,{email:email},httpOptions)
    .pipe(map(data => {
        return data;
    }));
  }

  validatelink(email){
    return this.httpClient.post<any>(`${environment.apiUrl}/api/auth/validate`,{email:email})
    .pipe(map(data => {
        return data;
    }));
  }
}
