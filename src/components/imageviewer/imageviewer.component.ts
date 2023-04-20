import {
  AfterViewInit,
  Component,
  OnInit,
  ElementRef,
  ViewChild,
  Input,
  OnChanges,
  SimpleChanges,
  EventEmitter,
  Output,
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
  @Output() goBackEvent = new EventEmitter<boolean>();

  @ViewChild('addMarker') addMarker: ElementRef | undefined;
  @ViewChild('zoomIn') zoomIn: ElementRef | undefined;
  @ViewChild('zoomOut') zoomOut: ElementRef | undefined;
  @ViewChild('fullScreen') fullScreen: ElementRef | undefined;
  showModal: boolean = false;
  form = new FormGroup({
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
  imageViewerList: any = [];
  newSceneId: any = "";
  previousSceneId: any = "";
  hotspotIds: any = [];
  hotspotsList: any = [];
  isloading: boolean = true;

  constructor(
    private imgSer: ImageViewerService,
    private store: AngularFireStorage
  ) { }

  mousePosition = {
    x: 0,
    y: 0,
  };

  cursor: any = null;
  viewer: any = null;

  ngOnInit(): void {
    this.createClearPanellum();
  }

  createClearPanellum = () => {
    var scope = this;
    this.viewer = pannellum.viewer('panorama', {
      default: {
        autoLoad: true,
        showControls: false,
      },
      type: 'equirectangular',
      scenes: [],
      hotSpots: [],
    });
    this.hotspotIds = [];
    scope.viewer.on('mousedown', function (event: any) {
      if (scope.cursor.style.cursor == 'pointer') {
        scope.mousePosition.x = event.screenX;
        scope.mousePosition.y = event.screenY;
      }
    });
    scope.viewer.on('mouseup', function (event: any) {
      if (
        scope.mousePosition.x === event.screenX &&
        scope.mousePosition.y === event.screenY
      ) {
        if (scope.cursor.style.cursor == 'pointer') {
          // coords[0] is pitch, coords[1] is yaw
          var coords = scope.viewer.mouseEventToCoords(event);
          scope.modalToggle();
          scope.form.controls.Lat.setValue(coords[0]);
          scope.form.controls.Long.setValue(coords[1]);
        }
      }
    });
  }

  removeHotSpots = () => {
    let hotSpots = document.getElementsByClassName('custom-hotspot');
    if (hotSpots.length > 0) {
      for (let i = 1; i <= hotSpots.length; i++) {
        hotSpots[i - 1].remove();
      }
    }
    // this.hotspotIds.forEach((id: any) => {
    //   this.viewer.removeHotSpot(id);
    //   document.getElementById(id)?.remove();
    // });
    this.hotspotIds = [];
  }

  async ngOnChanges(changes: SimpleChanges) {
    if (!changes['marker'].firstChange) {
      this.isloading = true;
      this.imgSer.getImagePointers().subscribe({
        next: (res: any) => {
          this.hotspotsList = res.map((a: any) => {
            return a.payload.doc.data();
          });
        },
        error: (err: any) => {
          console.log(err);
          this.isloading = false;
        },
        complete: () => { },
      });
      if (this.marker != null && this.marker.url != null) {
        if(this.mapViewer) this.removeHotSpots();
        this.store
          .ref(this.marker.url)
          .getDownloadURL()
          .subscribe({
            next: async (res: any) => {
              this.newSceneId = this.marker.Name;
              this.viewer.addScene(this.newSceneId, {
                type: 'equirectangular',
                panorama: res,
              });
              await this.viewer.loadScene(this.newSceneId);
              await this.loadSceneData();
            },
            error: (err: any) => {
              console.log(err);
            },
            complete: () => {
            },
          });
      }
    }
  }

  loadSceneData = async () => {
    if (this.hotspotsList.length > 0) {
      this.hotspotsList.map((hotspot: any) => {
        if (hotspot.ImageId == this.marker.Id) {
          this.viewer.addHotSpot({
            id: hotspot.Title,
            pitch: hotspot.Lat,
            yaw: hotspot.Long,
            text: hotspot.Title,
            createTooltipFunc: this.hotspot,
            createTooltipArgs: hotspot,
            cssClass: 'custom-hotspot'

          });
          this.hotspotIds.push(hotspot.Title);
        }
      });
    }
    this.cursor = document
      .getElementsByClassName('pnlm-ui pnlm-grab')
      .item(0);
    this.viewer.removeScene(this.previousSceneId);
    this.isloading = false;
  }


  // Hot spot creation function
  hotspot = (hotSpotDiv: any, args: any) => {
    hotSpotDiv.classList.add('custom-tooltip');
    var span = document.createElement('span');
    span.setAttribute("id", args.Title);
    span.innerHTML = args.Title + "</br>" + args.Description;
    hotSpotDiv.appendChild(span);
    span.style.width = span.scrollWidth - 20 + 'px';
    span.style.marginLeft = -(span.scrollWidth - hotSpotDiv.offsetWidth) / 2 - 14 + 'px';
    span.style.marginTop = -span.scrollHeight - 12 + 'px';
  }


  ngAfterViewInit() {
    var scope = this;
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
  };

  addPointerToImage = () => {
    this.form.controls.CreatedBy.setValue(Date.now().toString());
    this.form.controls.ImageId.setValue(this.marker.Id);
    this.imgSer.addImgPointer(this.form.getRawValue()).then(
      (res) => {
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
    this.imgSer.deleteImgPointer().then(
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
      next: (value: any) => {
        this.imageViewerList = value.map((a: any) => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return { id, ...data };
        });
      },
      error: (err) => {
        console.log(err);
      },
      complete: () => { },
    });
  };
  goBack = () => {
    // this.viewer.destroy();
    // this.previousSceneId = this.newSceneId;
    // this.createClearPanellum();   
    this.removeHotSpots();
    this.goBackEvent.emit(true)
  }
}
