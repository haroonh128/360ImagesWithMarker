import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root',
})
export class MapViewerService {
  constructor(private afs: AngularFirestore) {}

  addMapPointer = (data: any) => {
    return this.afs.collection('/MapViewer').add(data);
  };

  deleteMapPointer = (id?: string) => {
    return this.afs.doc(`/MapViewer/${id}`).delete();
  };

  getMapPointers = () => {
    return this.afs.collection(`/MapViewer`).snapshotChanges();
  };

  addMap = (data: any) => {
    return this.afs.collection('/MapViewer').add(data);
  };

  deleteMap = (id?: string) => {
    return this.afs.doc(`/MapViewer/${id}`).delete();
  };

  getMap = () => {
    return this.afs.collection('/MapViewer').snapshotChanges();
  };
}
