import { Component, OnInit } from '@angular/core';
import { UUID } from 'angular2-uuid';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ImageViewerService } from 'src/services/image-viewer.service';
import { MapViewerService } from 'src/services/map-viewer.service';
import { ToastrService } from 'ngx-toastr';
import { AngularFireStorage } from '@angular/fire/compat/storage';

@Component({
  selector: 'app-adminmapviewer',
  templateUrl: './adminmapviewer.component.html',
  styleUrls: ['./adminmapviewer.component.css']
})
export class AdminmapviewerComponent implements OnInit {

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


  zoom: number = 2;
  map: any;
  viewer: any = null;
  showModal: boolean = false;
  // initial center position for the map
  lat: number = 0;
  lng: number = 0;
  imagesList: any = [];
  selectedMarker: any = null;
  constructor(private mapSer: MapViewerService, 
    private imageServ: ImageViewerService,
    private toastr: ToastrService,
    private store: AngularFireStorage) { }
  ngOnInit(): void {
    this.getMapImages();
  }

  getMapImages = () => {
    this.mapSer.getMapPointers ().subscribe({
      next: (res: any) => {
        this.imagesList = res.map((a: any) => {
          const data = a.payload.doc.data();
          data.Id = a.payload.doc.id;
          return data;
        });
        if (this.imagesList.length > 0) {
          this.addImageMarkersOnMap()
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
    const myLatlng = { lat: -25.363, lng: 131.044 };

    let infoWindow = new google.maps.InfoWindow({
      content: "Click the map to get Lat/Lng!",
      position: myLatlng,
    });
    this.map.addListener("click", (event: any) => {
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
  addImageMarkersOnMap = () => {
    var scope = this;
    this.imagesList.map((point: any) => {
      const icon = {
        url: '../../assets/360marker.png', // url
        scaledSize: new google.maps.Size(28, 28), // scaled size
        origin: new google.maps.Point(0, 0), // origin
        anchor: new google.maps.Point(0, 0) // anchor
      };
      var marker = new google.maps.Marker({
        title: point.Name,
        icon: icon,
        map: this.map,
        position: new google.maps.LatLng(point.lat, point.long),
      });
      marker.setCursor('pointer');
      google.maps.event.addListener(marker, 'click', function (e) {
        //Open image in panellum
        if (scope.selectedMarker != point) {
          scope.selectedMarker = point;
        }

      });
      marker.setMap(this.map);
    })
  }

  modalToggle = () => {
    this.showModal = !this.showModal;
  };

  addMapImage = () => {
    this.form.controls.CreatedBy.setValue(Date.now().toString());
    this.form.controls.userId.setValue(localStorage.getItem('uid'));
    this.uploadFile();
    this.mapSer.addMapPointer(this.form.getRawValue()).then(
      (res) => {
        this.modalToggle();
        this.selectedMarker = {...this.form.getRawValue(), Id: res.id};
        this.form.reset();
      },
      (err) => {
        console.error(err);
      }
    );
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

  goBackEvent(event: any) {
    this.selectedMarker = null;
  }
}
