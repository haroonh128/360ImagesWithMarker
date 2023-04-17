import {
  AfterViewInit,
  Component,
  OnInit,
  ElementRef,
  ViewChild,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ImageViewerService } from 'src/services/image-viewer.service';
import { AngularFireStorage } from '@angular/fire/compat/storage';
declare var pannellum: any;
@Component({
  selector: 'app-imageviewer',
  templateUrl: './imageviewer.component.html',
  styleUrls: ['./imageviewer.component.css'],
})
export class ImageviewerComponent implements OnInit, AfterViewInit, OnChanges {
  @Input() marker: any;
  @Input() mapViewer: boolean = false;
  //Custom buttons
  @ViewChild('addMarker') addMarker: ElementRef | undefined;
  @ViewChild('zoomIn') zoomIn: ElementRef | undefined;
  @ViewChild('zoomOut') zoomOut: ElementRef | undefined;
  @ViewChild('fullScreen') fullScreen: ElementRef | undefined;
  showModal: boolean = false;
  form = new FormGroup({
    Id: new FormControl(''),
    Title: new FormControl('', [Validators.required]),
    Description: new FormControl('', [Validators.required]),
    Lat: new FormControl(''),
    Long: new FormControl(''),
    IsDeleted: new FormControl(false),
    CreatedBy: new FormControl(''),
    ModifiedBy: new FormControl(''),
    ImageId: new FormControl(''),
    UserId: new FormControl(''),
  });
  hotspotsList: any = [];

  constructor(private imgSer: ImageViewerService,
    private store: AngularFireStorage) { }

  //For setting mouse position on mousedown
  mousePosition = {
    x: 0,
    y: 0,
  };

  //Cursor for checking click event type
  cursor: any = null;
  viewer: any = null;

  ngOnInit(): void {
    var scope = this;
    //Pannellum integration
    this.viewer = pannellum.viewer('panorama', {
      //Basic configuration
      default: {
        // "firstScene": "circle",
        autoLoad: true,
        showControls: false,
      },
      type: 'equirectangular',

      //Add panorama here when using only one 360 image
      //When using one panorama we don't need to use scenes
      // panorama: 'https://pannellum.org/images/bma-1.jpg',
      // //pitch and yaw are x and y coordinates
      // hotSpots: [
      //   {
      //     pitch: -20.1,
      //     yaw: 140.9,
      //     text: 'Spring House or Dairy',
      //     // Custom hotspot icon and tooltip

      //     // "cssClass": "custom-hotspot",
      //     // "createTooltipFunc": hotspotFunc,
      //     // "createTooltipArgs": "Baltimore Museum of Art"
      //   },
      // ],

      //Scenes for using multiple 360 images and click on its hotspot to move to that 360 image
      //A scene is a 360 image
      "scenes": [],
      "hotSpots": [],

      // "scenes": {
      // In scenes object we add a screen, each scene will have its name i.e. circle, house
      //   "circle": {
      //     "type": "equirectangular",
      //     "panorama": "https://pannellum.org/images/bma-1.jpg",
      //     "hotSpots": [
      //       {
      //         "pitch": -20.1,
      //         "yaw": 140.9,
      //         "type": "scene",
      //         "text": "Spring House or Dairy",
      //         "sceneId": "house"
      //       }
      //     ]
      //   },

      //   "house": {
      //     "type": "equirectangular",
      //     "panorama": "https://pannellum.org/images/bma-1.jpg",
      //     "hotSpots": [
      //       {
      //         "pitch": -0.6,
      //         "yaw": 37.1,
      //         "type": "scene",
      //         "text": "Mason Circle",
      //         "sceneId": "circle",
      //         "targetYaw": -23,
      //         "targetPitch": 2
      //       }
      //     ]
      //   }
      // }
    });

    //Mouse click event on image
    scope.viewer.on('mousedown', function (event: any) {
      if (scope.cursor.style.cursor == 'pointer') {
        scope.mousePosition.x = event.screenX;
        scope.mousePosition.y = event.screenY;
      }
    });
    scope.viewer.on('mouseup', function (event: any) {
      //Checking if mouse is clicked and dragging
      if (
        scope.mousePosition.x === event.screenX &&
        scope.mousePosition.y === event.screenY
      ) {
        //We will only show add marker option only when marker add option is selected
        //We change the cursor to pointer when marker add option is selected

        if (scope.cursor.style.cursor == 'pointer') {
          // coords[0] is pitch, coords[1] is yaw
          var coords = scope.viewer.mouseEventToCoords(event);
          console.log('coords', coords);
          scope.modalToggle();
          scope.form.controls.Lat.setValue(coords[0]);
          scope.form.controls.Long.setValue(coords[1]);

          // //Adding hotspot/marker in the current image
          // scope.viewer.addHotSpot({
          //   pitch: coords[0],
          //   yaw: coords[1],
          //   text: 'New Hotspot',
          // });
          // Do something with the coordinates here...
        }
      }
    });
  }
  ngOnChanges(changes: SimpleChanges) {
    var scope = this;
    if (!changes['marker'].firstChange) {
      this.imgSer.getImagePointers().subscribe({
        next: (res: any) => {
          this.hotspotsList = res.map((a: any) => {
            return a.payload.doc.data();
          });
        },
        error: (err: any) => {
          console.log(err);
        },
        complete: () => { },
      });
      this.store.ref(this.marker.url).getDownloadURL().subscribe({
        next: (res: any) => {
          this.viewer.addScene('newScene', {
            "type": "equirectangular",
            "panorama": res,
            // "panorama": "https://pannellum.org/images/bma-1.jpg",
          })
          console.log(this.hotspotsList);
          if (this.hotspotsList.length > 0) {
            this.hotspotsList.map((hotspot: any) => {
              if (hotspot.ImageId == this.marker.Id) {
                this.viewer.addHotSpot({
                  pitch: hotspot.Lat,
                  yaw: hotspot.Long,
                  text: hotspot.Title,
                });
              }
            });
          }
          this.viewer.loadScene('newScene');
        },
        error: (err: any) => {
          console.log(err);
        },
        complete: () => { },
      })
    }
  }

  ngAfterViewInit() {
    console.log(this.marker);
    var scope = this;

    //Picking cursor
    scope.cursor = document
      .getElementsByClassName('pnlm-ui pnlm-grab')
      .item(0) as HTMLElement;
    //Add marker button
    this.addMarker?.nativeElement.addEventListener('click', function (e: any) {
      if (scope.cursor.style.cursor == 'pointer') {
        scope.cursor.style.cursor = 'grabbing';
      } else {
        scope.cursor.style.cursor = 'pointer';
      }
    });
    this.zoomIn?.nativeElement.addEventListener('click', function (e: any) {
      scope.viewer.setHfov(scope.viewer.getHfov() - 10);
    });
    this.zoomOut?.nativeElement.addEventListener('click', function (e: any) {
      scope.viewer.setHfov(scope.viewer.getHfov() + 10);
    });
    this.fullScreen?.nativeElement.addEventListener('click', function (e: any) {
      scope.viewer.toggleFullscreen();
    });
  }

  modalToggle = () => {
    this.showModal = !this.showModal;
  }

  addPointerToImage = () => {
    this.form.controls.CreatedBy.setValue(Date.now().toString());

    this.imgSer.addImgPointer(this.form.getRawValue()).then(
      (res) => {
        console.log(res);
        //Adding hotspot/marker in the current image
        this.viewer.addHotSpot({
          pitch: this.form.controls.Lat.value,
          yaw: this.form.controls.Long.value,
          text: this.form.controls.Title.value,
        });
        this.modalToggle();
      },
      (err) => {
        console.error(err);
      }
    );
  };

  delImageViewer = () => {
    this.imgSer.deleteImgPointer(this.form.controls.Id.value?.toString()).then(
      (res) => {
        console.log(res);
      },
      (err) => {
        console.error(err);
      }
    );
  };

  getImagePointers = () => {
    this.imgSer.getImagePointers().subscribe({
      next(value) {
        console.log(value);
      },
      error(err) {
        console.log(err);
      },
      complete() { },
    });
  };
}
