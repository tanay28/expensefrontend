import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from "../../environments/environment";
import { Observable, BehaviorSubject } from "rxjs";
import { map } from "rxjs/operators";
import { JwtHelperService } from "@auth0/angular-jwt";
import { JsonPipe } from "@angular/common";
@Injectable({
  providedIn: "root",
})
export class UsersService {
  private loggedIn = new BehaviorSubject<boolean>(false); // {1}
  private roleId = new BehaviorSubject<number>(0);
  currentUser;
  token: any;
  user_role_id;
  isExpired: false;
  constructor(private httpClient: HttpClient) {}

  //------------------- User management ------------------------//
  register(data: any) {
    return this.httpClient
      .post<any>(`${environment.apiUrl}/api/registration/users`, data)
      .pipe(
        map((data) => {
          return data;
        })
      );
  }

  resetpass(data: any) {
    return this.httpClient
      .post<any>(`${environment.apiUrl}/api/auth/reset`, data)
      .pipe(
        map((data) => {
          return data;
        })
      );
  }

  validateUser(data: any) {
    return this.httpClient
      .post<any>(`${environment.apiUrl}/api/registration/Validateuser`, {
        email: data,
      })
      .pipe(
        map((data) => {
          return data;
        })
      );
  }

  login(username: string, password: string): any {
    return this.httpClient
      .post<any>(`${environment.apiUrl}/api/auth/login`, {
        username: username,
        password: password,
      })
      .pipe(
        map(async (user) => {
          // login successful if there's a jwt token in the response
          if (user && user.token) {
            //console.log(user.token)

            const helper = new JwtHelperService();

            const decodedToken = helper.decodeToken(user.token);
            const decodedRefreshedToken = helper.decodeToken(user.refreshtoken);

            //console.log(decodedToken);

            // Other functions
            const expirationDate = helper.getTokenExpirationDate(user.token);
            const isExpired = helper.isTokenExpired(user.token);

            // console.log('expirationDate',expirationDate);
            // console.log('isExpired',isExpired);

            localStorage.setItem("currentUser", JSON.stringify(decodedToken));
            localStorage.setItem("token", user.token);
            localStorage.setItem("refreshtoken", user.refreshtoken);

            this.loggedIn.next(true);

            // store user details and jwt token in local storage to keep user logged in between page refreshes
          }
          return user;
        })
      );
  }

  refreshToken() {
    let data = {
      token: localStorage.getItem("refreshtoken"),
    };
    return this.httpClient
      .post<any>(`${environment.apiUrl}/api/auth/refreshToken`, data)
      .pipe(
        map((data) => {
          if (data.auth == true) {
            return data;
          }
        })
      );
  }
  sentToken() {
    let token = localStorage.getItem("token");
    return token;
  }

  get isLoggedIn() {
    this.currentUser = JSON.parse(localStorage.getItem("currentUser"));

    if (this.currentUser) {
      this.user_role_id = this.currentUser.role;
      if (this.user_role_id > 0) {
        this.loggedIn.next(true);
      }
    }
    return this.loggedIn.asObservable(); // {2}
  }

  // isLoggedInt(){
  // 	return !!this.sentToken();
  // }

  logout() {
    localStorage.removeItem("currentUser");
    localStorage.removeItem("token");
    localStorage.removeItem("refreshtoken");
    localStorage.removeItem("status");
    localStorage.clear();
    this.loggedIn.next(false);
  }

  //------------------------ END -------------------------//

  //-------------- API for Expenses CRUD -----------------//

  addData(data: any): any {
    return this.httpClient
      .post<any>(`${environment.apiUrl}/api/crud/add`, data)
      .pipe(
        map((data) => {
          return data;
        })
      );
  }

  viewData(currentUser: any, first, last): any {
    let datas = {
      email: currentUser.email,
      first: first,
      last: last,
    };

    return this.httpClient
      .post<any>(`${environment.apiUrl}/api/crud/view`, datas)
      .pipe(
        map((data) => {
          return data;
        })
      );
  }

  removeData(id, currentUser, amount, month, year, name): any {
    return this.httpClient
      .post<any>(`${environment.apiUrl}/api/crud/remove`, {
        id: id,
        user: currentUser.email,
        amount: amount,
        month: month,
        year: year,
        name: name,
      })
      .pipe(
        map((data) => {
          return data;
        })
      );
  }

  //-------------------- END ---------------------------//

  //-------------- API for Income CRUD ---------------//

  validateIncome(user, month, year) {
    return this.httpClient
      .post<any>(`${environment.apiUrl}/api/income/validate`, {
        user: user,
        month: month,
        year: year,
      })
      .pipe(
        map((data) => {
          return data;
        })
      );
  }
  addIncome(data: any): any {
    return this.httpClient
      .post<any>(`${environment.apiUrl}/api/income/add`, data)
      .pipe(
        map((data) => {
          return data;
        })
      );
  }

  viewIncome(currentUser: any, first, last): any {
    let datas = {
      email: currentUser.email,
      first: first,
      last: last,
    };

    return this.httpClient
      .post<any>(`${environment.apiUrl}/api/income/view`, datas)
      .pipe(
        map((data) => {
          return data;
        })
      );
  }

  removeIncome(id, currentUser): any {
    return this.httpClient
      .post<any>(`${environment.apiUrl}/api/income/remove`, {
        id: id,
        user: currentUser.email,
      })
      .pipe(
        map((data) => {
          return data;
        })
      );
  }

  //---------------------- END -----------------------//

  //-------------- Ledger details API ---------------//
  getLedger(user, from, to) {
    return this.httpClient
      .post<any>(`${environment.apiUrl}/api/ledger/view`, {
        user: user,
        from,
        to,
      })
      .pipe(
        map((data) => {
          return data;
        })
      );
  }
  //--------------------- END ----------------------//

  //--------------- Export To Expense CSV -----------------//
  exportToCSV(currentUser) {
    return this.httpClient
      .post<any>(`${environment.apiUrl}/api/export/tocsv`, {
        email: currentUser.email,
      })
      .pipe(
        map((data) => {
          return data;
        })
      );
  }

  //------------------------ END ------------------------//

  //---------------- Change password ----------------//
  changePassword(currentUser, data) {
    let datas = {
      email: currentUser.email,
      oldp: data.oldp,
      newp: data.newp,
    };

    return this.httpClient
      .post<any>(`${environment.apiUrl}/api/v1/changepassword`, datas)
      .pipe(
        map((data) => {
          return data;
        })
      );
  }
  //---------------------- END ----------------------//

  //------------------- Misc --------------------//
  getType(currentUser) {
    let datas = {
      email: currentUser.email,
    };

    return this.httpClient
      .post<any>(`${environment.apiUrl}/api/crud/getType`, datas)
      .pipe(
        map((data) => {
          return data;
        })
      );
  }
  //-------------------- END -------------------//
}
