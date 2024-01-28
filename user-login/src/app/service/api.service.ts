import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = 'http://127.0.0.1:8000/api/v1/user';

  constructor(private http: HttpClient) { }

  login(user: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, user);
  }

  signup(user: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/signup`, { user });
  }

  // getUserDetails(): Observable<any> {
  //   const token = localStorage.getItem("token")
  //   const headers = new HttpHeaders({
  //     'Authorization': `Bearer ${token}`
  //   });
  //   return this.http.get<any>(`${this.apiUrl}/file/get`, { headers });
  // }

  getFiles(): Observable<any> {
    const token = localStorage.getItem("token")
    const headers = new HttpHeaders({
      'Authorization': `Token ${token}`
    });
    return this.http.get<any>(`${this.apiUrl}/file/get`, { headers });
  }

  uploadFile(file: any, code: any, userId: any): Observable<any> {
    const formData = new FormData();

    formData.append('file', file);
    formData.append('unique_code', code)
    formData.append('user', userId)

    const token = localStorage.getItem("token")
    const headers = new HttpHeaders({
      'Authorization': `Token ${token}`
    });

    return this.http.post(`${this.apiUrl}/file/upload`, formData, { headers });
  }

  getProfile(): Observable<any> {
    const token = localStorage.getItem("token")
    const headers = new HttpHeaders({
      'Authorization': `Token ${token}`
    });
    return this.http.get(`${this.apiUrl}/profile`, { headers });
  }

  removeFile(fileId: number): Observable<any> {
    const token = localStorage.getItem("token")
    const headers = new HttpHeaders({
      'Authorization': `Token ${token}`
    });

    return this.http.delete(`${this.apiUrl}/file/remove/${fileId}`, { headers });

  }

  viewAndDownloadFile(uniqueCode: any): Observable<any> {
    const token = localStorage.getItem("token");
    const headers = new HttpHeaders({
      'Authorization': `Token ${token}`
    });

    const options = {
      headers: headers,
      responseType: 'blob' as 'json',
    };

    return this.http.get(`${this.apiUrl}/file/download/${uniqueCode}`, options);
  }

}
