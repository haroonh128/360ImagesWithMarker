import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private http: HttpClient) {}

  addUser = (data: any) => {
    return this.http.post(
      `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${environment.webApiKey}`,
      { ...data, returnSecurityToken: true }
    );
  };

  getUsers = () => {
    return this.http.get(`${environment.dbLink}Users.json`);
  };

  logIn = (data: any) => {
    return this.http.get(`${environment.dbLink}Users.json`, {
      params: new HttpParams()
        .set('orderBy', '"Email"')
        .set('equalTo', `"${data.Email}"`)
        .set('equalTo', `"${data.Password}"`),
    });
  };
}
