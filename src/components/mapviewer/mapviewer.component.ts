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
export class MapviewerComponent {
  zoom: number = 2;
  map: any;
  showModal: boolean = false;
  // initial center position for the map
  lat: number = 0;
  lng: number = 0;
  imagesList: any = [];
  searchList: any = [];

  //string
  searchText: string = '';

  selectedMarker: any = null;
  markers: any = [];
  constructor(
    private mapSer: MapViewerService,
    private imageServ: ImageViewerService
  ) { }
  ngOnInit(): void {
    this.getImages();
  }
  onMapReady(map: any) {
    var ownRef = this;
    var options = {
      mapTypeId: 'roadmap',
      mapTypeControl: true,
      mapTypeControlOptions: {
        style: google.maps.MapTypeControlStyle.DROPDOWN_MENU,
        position: google.maps.ControlPosition.LEFT_CENTER,
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

  getImages = () => {
    this.mapSer.getMapPointers().subscribe({
      next: (res: any) => {
        this.imagesList = res.map((a: any) => {
          const data = a.payload.doc.data();
          data.Id = a.payload.doc.id;
          return data;
        });
        if (this.imagesList.length > 0) {
          this.addImageMarkers();
        }
      },
      error: (err) => {
        console.error(err);
      },
      complete: () => { },
    });
  };
  addImageMarkers = () => {
    var scope = this;
    this.imagesList.map((point: any) => {
      const icon = {
        url: '../../assets/360marker.png', // url
        scaledSize: new google.maps.Size(28, 28), // scaled size
        origin: new google.maps.Point(0, 0), // origin
        anchor: new google.maps.Point(0, 0), // anchor
      };
      var marker = new google.maps.Marker({
        title: point.Name,
        icon: icon,
        map: this.map,
        position: new google.maps.LatLng(point.lat, point.long),
      });
      this.markers.push(marker);
      marker.setCursor('pointer');
      google.maps.event.addListener(marker, 'click', function (e) {
        //Open image in panellum
        if (scope.selectedMarker != point) {
          scope.selectedMarker = point;
        }
      });
      marker.setMap(this.map);
    });
  };
  searchSelection = (marker: any) => {
    if (this.selectedMarker != marker) {
      this.selectedMarker = marker;
    }
  }

  clearMarkers = () => {
    this.markers.forEach((marker: any) => {
      marker.setMap(null);
    })
    this.markers = [];
  }

  searchImages = (search: string) => {
    if (search.length > 1) {
      this.mapSer.getMapPointers().subscribe({
        next: (res: any) => {
          this.searchList = [];
          this.imagesList = res.map((a: any) => {
            const data = a.payload.doc.data();
            data.Id = a.payload.doc.id;
            return data;
          });
          if (this.imagesList.length > 0) {
            for (var i = 0; i < this.imagesList.length; i++) {
              let title = this.imagesList[i].Name.toLowerCase();
              if (title.includes(search.toLowerCase())) {
                this.searchList.push(this.imagesList[i]);
              }
            }
            this.clearMarkers();
            this.imagesList = this.searchList;
            this.addImageMarkers();
          }
        },
        error: (err) => {
          console.error(err);
        },
        complete: () => { },
      });
    } else if(search.length == 0){
      this.clearMarkers();
      this.getImages();
    }
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
