import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpUserEvent, HttpInterceptor,HttpResponse,HttpErrorResponse,HttpSentEvent,HttpHeaderResponse,HttpProgressEvent,HttpEvent } from '@angular/common/http';
import { catchError, filter, switchMap, take } from 'rxjs/operators';
import { Observable, throwError, BehaviorSubject} from 'rxjs';
import { UsersService } from '../_services/users.service';
import { environment } from 'src/environments/environment';
import { Expired } from '../_helper/expired';
import { Router } from '@angular/router';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
    
    private is_refreshing = false;
    private refreshtokensubject : BehaviorSubject<any> = new BehaviorSubject<any>(null);

    constructor(private authService: UsersService,private expired : Expired,private router : Router) { 
      //this.is_refreshing = false;
    }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpSentEvent | HttpEvent<any> |HttpHeaderResponse | HttpProgressEvent | HttpResponse<any> | HttpUserEvent<any>> {

        if (this.authService.sentToken()) {
          request = this.addToken(request, this.authService.sentToken());
        }
    
        return next.handle(request).pipe(catchError((error, caught ) => {
            if (error instanceof HttpErrorResponse && error.status === 401) {
              return this.handle401Error(request, next);
              // console.log('gotta',error);
            } else {
              this.authService.logout();
              this.router.navigate(["/"]);
              return;
              //console.log('gotta');
              //return throwError(error);
            }
          })
        );
       
       
        // if(!this.expired.checkExpired_for_refresh()){
        //   request = this.addToken(request, this.authService.sentToken());
        // }else{
        //   console.log('newtoken',localStorage.getItem('newtoken'));
        //   if(localStorage.getItem('newtoken') == null){
        //     this.authService.refreshToken().subscribe(async datas => {
        //       console.log('datas',datas);
        //       localStorage.setItem('newtoken',datas.token);
        //       request = this.addToken(request,datas.token);
        //     },err => {});
        //   }
        // }
        //return next.handle(request);
      }

    private addToken(request: HttpRequest<any>, token: string) {
        return request.clone({
          setHeaders: {
            'authorization': `Bearer ${token}`
          }
        });
    }

    private handle401Error(request : HttpRequest<any>,next: HttpHandler) {
        if(!this.is_refreshing){
            this.is_refreshing = true;
            this.refreshtokensubject.next(null);
        
            return this.authService.refreshToken().pipe(
              switchMap((token: any) => {
                this.is_refreshing = false;
                this.refreshtokensubject.next(token.token);
                localStorage.removeItem('token');
                localStorage.setItem('token',token.token);
                return next.handle(this.addToken(request, token.token));
              }));
        }else{
            return this.refreshtokensubject.pipe(
              filter(token => token != null),
              take(1),
              switchMap(jwt => {
                return next.handle(this.addToken(request, jwt));
            }));
        }
    }
}