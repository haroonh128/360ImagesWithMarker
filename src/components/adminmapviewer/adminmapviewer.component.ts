import { Component, OnInit } from '@angular/core';
import { UUID } from 'angular2-uuid';
import { FormControl, FormGroup } from '@angular/forms';
import { ImageViewerService } from 'src/services/image-viewer.service';
import { MapViewerService } from 'src/services/map-viewer.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-adminmapviewer',
  templateUrl: './adminmapviewer.component.html',
  styleUrls: ['./adminmapviewer.component.css']
})
export class AdminmapviewerComponent implements OnInit {
  form = new FormGroup({
    Id: new FormControl(UUID.UUID()),
    Name: new FormControl(''),
    Description: new FormControl(''),
    ImageId: new FormControl(''),
    Lattitude: new FormControl(''),
    Longitude: new FormControl(''),
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
  constructor(private mapSer: MapViewerService, private imageServ: ImageViewerService,
    private toastr: ToastrService,) { }
  ngOnInit(): void {
    this.getImages();
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
          this.addImagesToMap()
        }
      },
      error: (err) => {
        console.error(err);
      },
      complete: () => {
      }
    });
  };

  addImage(){
    this.imageServ.addImage(this.form.getRawValue()).then(
      (res) => {
        console.log(res);
        this.modalToggle();
      },
      (err) => {
        console.error(err);
      }
    );
  }

  onMapReady(map: any) {
    var ownRef = this;
    var options = {
      mapTypeId: 'roadmap',
      mapTypeControl: true,
      mapTypeControlOptions: {
        style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
        position: google.maps.ControlPosition.BOTTOM_LEFT,
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
    const myLatlng = { lat: -25.363, lng: 131.044 };

    let infoWindow = new google.maps.InfoWindow({
      content: "Click the map to get Lat/Lng!",
      position: myLatlng,
    });
    this.map.addListener("click", (event: any) => {
      console.log(event.latLng.toJSON());
      infoWindow.close();
      infoWindow = new google.maps.InfoWindow({
        position: event.latLng,
      });
      infoWindow.setContent(
        JSON.stringify(event.latLng.toJSON(), null, 2)
      );
      infoWindow.open(map);
    });
    this.map.controls[google.maps.ControlPosition.RIGHT_CENTER].push(document.getElementById('addImage'));
  }
  addImagesToMap = () => {
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
