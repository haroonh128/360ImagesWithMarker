import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { UUID } from 'angular2-uuid';
import { MapViewerService } from 'src/services/map-viewer.service';
import { AngularFireStorage } from '@angular/fire/compat/storage';

@Component({
  selector: 'app-map-images',
  templateUrl: './map-images.component.html',
  styleUrls: ['./map-images.component.css'],
})
export class MapImagesComponent implements OnInit {
  imgList: any = [];

  form = new FormGroup({
    Name: new FormControl('', [Validators.required]),
    Description: new FormControl('', [Validators.required]),
    lat: new FormControl('', [Validators.required]),
    long: new FormControl('', [Validators.required]),
    IsDeleted: new FormControl(false),
    CreatedBy: new FormControl(''),
    ModifiedBy: new FormControl(''),
    userId: new FormControl(''),
    url: new FormControl('', [Validators.required]),
  });

  image: any;

  constructor(
    private mapSer: MapViewerService,
    private store: AngularFireStorage
  ) {}

  ngOnInit(): void {
    this.getMapImage();
  }

  addMapImage = () => {
    this.form.controls.CreatedBy.setValue(Date.now().toString());
    this.form.controls.userId.setValue(localStorage.getItem('uid'));
    this.uploadFile();
    this.mapSer.addMapPointer(this.form.getRawValue()).then(
      (res) => {
        console.log(res);
      },
      (err) => {
        console.error(err);
      }
    );
  };

  delMapImage = (id: any) => {
    this.mapSer.deleteMapPointer(id).then(
      (res) => {
        console.log(res);
        this.getMapImage();
      },
      (err) => {
        console.error(err);
      }
    );
  };

  getMapImage = () => {
    this.mapSer.getMapPointers().subscribe({
      next: (res: any) => {
        this.imgList = res.map((a: any) => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return { id, ...data };
        });
      },

      error: (err: any) => {
        console.log(err);
      },
      complete: () => {},
    });
  };

  uploadFile = async () => {
    let result = await this.store.upload(`${this.image.name}`, this.image);
    const url = await result.ref.getDownloadURL();
  };

  get f() {
    return this.form.controls;
  }

  onFileChanged = (event: any) => {
    this.image = event.target.files[0];
    let imgName = this.image.name.toString();
    this.form.controls.url.setValue(imgName);
  };
}
