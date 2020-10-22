import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment} from '../../environments/environment'
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class StatementsService {

  constructor(private httpClient:HttpClient) { }

  getDataDateWise(currentUser,from,to) : any{

	
	let datas = {
		email : currentUser.email,
		from  : from,
		to    : to
	};
    
    return this.httpClient.post<any>(`${environment.apiUrl}/api/statement/getDatewise`,datas)
			.pipe(map(data => {
				return data;
			}));
  }

  getDataMonWise(currentUser,month,year) : any{

	let datas = {
	email : currentUser.email,
		month : month,
		year  : year
	};
	
	return this.httpClient.post<any>(`${environment.apiUrl}/api/statement/getMonthwise`,datas)
		.pipe(map(data => {
			return data;
	}));
  }

  getVisualDateWise(currentUser,from,to) : any{

	let datas = {
		email : currentUser.email,
		from  : from,
		to    : to
	};
	
	return this.httpClient.post<any>(`${environment.apiUrl}/api/statement/getVisualdataDatewise`,datas)
		.pipe(map(data => {
			return data;
	}));
  }

  
  closeAccount(currentUser,start,end,month,year){
	
	let datas = {
		email : currentUser.email,
		from  : start,
		to    : end,
		month : month,
		year  : year
	};
	
	return this.httpClient.post<any>(`${environment.apiUrl}/api/statement/closeAccount`,datas)
		.pipe(map(data => {
			return data;
	}));
  }
}
