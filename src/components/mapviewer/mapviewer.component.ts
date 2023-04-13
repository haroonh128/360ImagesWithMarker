import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { UUID } from 'angular2-uuid';
import { MapViewerService } from 'src/services/map-viewer.service';

@Component({
  selector: 'app-mapviewer',
  templateUrl: './mapviewer.component.html',
  styleUrls: ['./mapviewer.component.css'],
})
export class MapviewerComponent {
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

  zoom: number = 8;
  map: any;
  viewer: any = null;
  showModal: boolean = false;
  // initial center position for the map
  lat: number = 51.673858;
  lng: number = 7.815982;
  markers: marker[] = [
    {
      lat: 51.673858,
      lng: 7.815982,
      label: 'A',
      draggable: true,
      content: 'InfoWindow content',
      color: '#FFFFFF',
      iconUrl: 'http://maps.google.com/mapfiles/ms/micons/gas.png',
    },
    {
      lat: 51.373858,
      lng: 7.215982,
      label: 'B',
      draggable: false,
      content: 'InfoWindow content',
      color: 'blue',
      iconUrl: 'http://maps.google.com/mapfiles/ms/micons/dollar.png',
    },
    {
      lat: 51.723858,
      lng: 7.495982,
      label: 'C',
      draggable: true,
      content: 'InfoWindow content',
      color: 'red',
      iconUrl: 'http://maps.google.com/mapfiles/ms/micons/police.png',
    },
  ];
  clickedMarker(label: string, index: number) {
    console.log(`clicked the marker: ${label || index}`);
  }

  constructor(private mapSer: MapViewerService) {}

  mapClicked(event: any) {
    console.log('map clicked');
  }
  onMapReady(map: any) {
    var ownRef = this;
    var options = {
      mapTypeId: 'roadmap',
      mapTypeControl: true,
      mapTypeControlOptions: {
        style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
        position: google.maps.ControlPosition.TOP_LEFT,
      },
      zoomControl: true,
      scrollwheel: true,
      streetViewControl: false,
      disableDoubleClickZoom: true,
      fullscreenControl: false,
      maxZoom: 1000,
      minZoom: 1,
      draggableCursor: '',
      draggingCursor: 'crosshair',
    };
    map.options = options;
    var noPoi = [
      {
        featureType: 'poi',
        stylers: [{ visibility: 'off' }],
      },
    ];

    map.setOptions({ styles: noPoi, ...options });
    map.addListener('zoom_changed', () => {
      ownRef.zoom = map.getZoom();
    });
    this.map = map;
  }

  addMapImage = () => {
    this.form.controls.CreatedBy.setValue(Date.now().toString());

    this.mapSer.addMapPointer(this.form.getRawValue()).then(
      (res) => {
        console.log(res);
        //Adding hotspot/marker in the current image
        this.viewer.addHotSpot({
          pitch: this.form.controls.xAxis.value,
          yaw: this.form.controls.yAxis.value,
          text: this.form.controls.Name.value,
        });
        this.modalToggle();
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

  modalToggle = () => {
    this.showModal = !this.showModal;
  };
}

// just an interface for type safety.
interface marker {
  lat: number;
  lng: number;
  label: string;
  draggable: boolean;
  content: string;
  color: string;
  iconUrl: string;
}
