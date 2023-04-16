import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment.development';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private http: HttpClient, private fireAuth: AngularFirestore) {}

  addUser = (data: any) => {
    return this.http.post(`${environment.dbLink}users.json`, { data });
  };

  getUsers = () => {
    return this.fireAuth.collection(`/Users`).snapshotChanges();
  };
}
