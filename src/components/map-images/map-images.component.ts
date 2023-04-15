import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { UUID } from 'angular2-uuid';
import { MapViewerService } from 'src/services/map-viewer.service';

@Component({
  selector: 'app-map-images',
  templateUrl: './map-images.component.html',
  styleUrls: ['./map-images.component.css'],
})
export class MapImagesComponent {
  form = new FormGroup({
    Id: new FormControl(UUID.UUID()),
    Name: new FormControl(''),
    Description: new FormControl(''),
    ImageId: new FormControl(''),
    xAxis: new FormControl(''),
    yAxis: new FormControl(''),
    IsDeleted: new FormControl(false),
    CreatedBy: new FormControl(''),
    ModifiedBy: new FormControl(''),
    url: new FormControl(''),
  });

  constructor(private mapSer: MapViewerService) {}

  addMapImage = () => {
    this.form.controls.CreatedBy.setValue(Date.now().toString());

    this.mapSer.addMapPointer(this.form.getRawValue()).then(
      (res) => {
        console.log(res);
      },
      (err) => {
        console.error(err);
      }
    );
  };

  delMapImage = () => {
    this.mapSer.deleteMapPointer(this.form.controls.Id.value?.toString()).then(
      (res) => {
        console.log(res);
      },
      (err) => {
        console.error(err);
      }
    );
  };

  getMapImage = () => {
    this.mapSer.getMap().subscribe({
      next(value) {
        console.log(value);
      },
      error(err) {
        console.log(err);
      },
      complete() {},
    });
  };
}
