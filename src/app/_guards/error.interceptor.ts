import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, filter, switchMap, take } from 'rxjs/operators';

import { UsersService} from '../_services/users.service';


@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

    private is_refreshing = false;
    private refreshtokensubject : BehaviorSubject<any> = new BehaviorSubject<any>(Request);
    constructor(private authenticationService: UsersService) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        
        return next.handle(request).pipe(catchError(err => {
            if (err.status === 401) {
                // auto logout if 401 response returned from api
                this.authenticationService.logout();
                //this.handle401Error(request,next)
                location.reload(true);
            }

            const error = err.error.message || err.statusText;
            return throwError(error);
        }))
    }

    handle401Error(request : HttpRequest<any>,next: HttpHandler){
        if(!this.is_refreshing){
            this.is_refreshing = true;
            this.refreshtokensubject.next(null);
            
            return this.authenticationService.refreshToken()
                .subscribe(data => {
                    this.is_refreshing = true;
                    this.refreshtokensubject.next(data.token);
                    return next.handle(this.addToken(request,data.token));
                },error =>{});
        }else{
            return this.refreshtokensubject.pipe(
                filter(token => token!=null),
                take(1),
                switchMap(jwt =>{
                    return next.handle(this.addToken(request,jwt));
            }))
        }
    }

    private addToken(request: HttpRequest<any>, token: string) {
        return request.clone({
          setHeaders: {
            'Authorization': `Bearer ${token}`
          }
        });
    }
}