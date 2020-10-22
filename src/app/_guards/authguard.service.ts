import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { UsersService } from '../_services/users.service';
import { map, take } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
@Injectable()
export class AuthGuardService implements CanActivate {

  constructor(private userService: UsersService, private router: Router,private http:HttpClient) {}
  
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    
    //const expectedRole = route.data.expectedRole;
    const permission = route.data['permission'];
    //console.log('route => ',route);
    return this.userService.isLoggedIn
        .pipe(
            //take(1),
            map((isLoggedIn: boolean) => {
                if (!isLoggedIn) {
                    this.router.navigate(['/'], { queryParams: { returnUrl: state.url } });
                    return false;
                }
                //
                if (localStorage.getItem('currentUser')) {

                    let currentUser = JSON.parse(localStorage.getItem('currentUser'));

                    let is_auth = permission.only.includes(currentUser.role);

                    if (!is_auth) { this.router.navigate([permission.redirectTo]); }

                    if (is_auth) {
                        //console.log('Getting login data');
                        let loginId = localStorage.getItem('loginId'),
                        token = localStorage.getItem('token');
                        // this.http.post<any>(
                        //     `${environment.apiUrl}/user-log-service/api/ops-log-route`,
                        //     { loginId, route: state.url },
                        //     {
                        //         headers: new HttpHeaders({
                        //             'Content-type': 'application/json',
                        //             'Authorization': token
                        //         })
                        //     }
                        // ).toPromise();
                    }

                    // logged in so return true
                    return true;
                }
            })
        );


    //console.log(expectedRole);








    // not logged in so redirect to login page with the return url
    //this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
    //return false;
}
}