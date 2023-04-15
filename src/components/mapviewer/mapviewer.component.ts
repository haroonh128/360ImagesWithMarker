import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { UUID } from 'angular2-uuid';
import { ImageViewerService } from 'src/services/image-viewer.service';
import { MapViewerService } from 'src/services/map-viewer.service';

@Component({
  selector: 'app-mapviewer',
  templateUrl: './mapviewer.component.html',
  styleUrls: ['./mapviewer.component.css'],
})
export class MapviewerComponent implements OnInit {
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

  zoom: number = 0;
  map: any;
  viewer: any = null;
  showModal: boolean = false;
  // initial center position for the map
  lat: number = 0;
  lng: number = 0;
  imagesList: any = [];
  selectedMarker: any = null;
  clickedMarker(label: string, index: number) {
    console.log(`clicked the marker: ${label || index}`);
  }

  constructor(private mapSer: MapViewerService, private imageServ: ImageViewerService) { }
  ngOnInit(): void {
    this.getImages();
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
    map.addListener("click", (event: any) => {
      console.log(event.latLng.toJSON());
    });
    this.map = map;
  }

  getImages = () => {
    this.imageServ.getImages().subscribe({
      next: (res: any) => {
        console.log(res);
        this.imagesList = res.map((a: any) => {
          const data = a.payload.doc.data();
          // data.Id = a.payload.doc.id;
          return data;
        });
        if (this.imagesList.length > 0) {
          this.addImageMarkers()
        }
      },
      error: (err) => {
        console.error(err);
      },
      complete: () => {
      }
    });
  };
  addImageMarkers = () => {
    var scope = this;
    this.imagesList.map((point: any) => {
      const icon = {
        url: '../../assets/360marker.png', // url
        scaledSize: new google.maps.Size(28, 28), // scaled size
        origin: new google.maps.Point(0, 0), // origin
        anchor: new google.maps.Point(0, 0) // anchor
      };
      var marker = new google.maps.Marker({
        title: point.Title,
        icon: icon,
        map: this.map,
        position: new google.maps.LatLng(
          51.673858, 7.815982
        ),
      });
      marker.setCursor('pointer');
      google.maps.event.addListener(marker, 'click', function (e) {
        //Open image in panellum
        scope.selectedMarker = marker;
      });
      marker.setMap(this.map);
    })
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
      complete() { },
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
