import { Injectable } from '@angular/core';
import { Subject }  from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class CommonService {
  public userDetails$ = new Subject<any>();
  constructor() {}

  parseJwt(token: string): any {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(function (c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join('')
    );
    return JSON.parse(jsonPayload);
  }

  public setUserDetail(token: any) {
    const { username } = this.parseJwt(token);
    const { emp_id } = this.parseJwt(token);
    this.userDetails$.next(username)
    localStorage.setItem("name", username)
    localStorage.setItem("emp_id", emp_id)
  }
}
