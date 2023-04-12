import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root',
})
export class ImageViewerService {
  constructor(private afs: AngularFirestore) {}

  addImgPointer = (data: any) => {
    return this.afs.collection('/ImageViewer').add(data);
  };

  deleteImgPointer = (id?: string) => {
    return this.afs.doc(`/ImageViewer/${id}`).delete();
  };

  getImagePointers = () => {
    return this.afs.collection('/ImageViewer').snapshotChanges();
  };

  addImage = (data: any) => {
    return this.afs.collection('/Images').add(data);
  };

  deleteImage = (id?: string) => {
    return this.afs.doc(`/Images/${id}`).delete();
  };

  getImages = () => {
    return this.afs.collection('/Images').snapshotChanges();
  };

}
