import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment.development';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private http: HttpClient, private fireAuth: AngularFireAuth) {}

  addUser = (data: any) => {
    return this.http.post(`${environment.firebase.apiKey}`, { data });
  };

  getUsers = () => {
    return this.http.get(`${environment.dbLink}Users.json`);
  };
}
