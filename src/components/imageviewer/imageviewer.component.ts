import { AfterViewInit, Component, OnInit, ElementRef, ViewChild } from '@angular/core';
declare var pannellum: any;
@Component({
  selector: 'app-imageviewer',
  templateUrl: './imageviewer.component.html',
  styleUrls: ['./imageviewer.component.css']
})
export class ImageviewerComponent implements OnInit, AfterViewInit {
  
  //Custom buttons
  @ViewChild('addMarker') addMarker: ElementRef | undefined;
  @ViewChild('zoomIn') zoomIn: ElementRef | undefined;
  @ViewChild('zoomOut') zoomOut: ElementRef | undefined;
  @ViewChild('fullScreen') fullScreen: ElementRef | undefined;

  //For setting mouse position on mousedown
  mousePosition = {
    x: 0,
    y: 0
  };

  //Cursor for checking click event type
  cursor: any = null;
  viewer: any = null;


  ngOnInit(): void {
    var scope = this;

    //Pannellum integration
    this.viewer = pannellum.viewer('panorama', {
      
      //Basic configuration
      "default": {
        // "firstScene": "circle",
        "sceneFadeDuration": 1000,
        "autoLoad": true,
        "showControls": false
      },          
      "type": "equirectangular",

      //Add panorama here when using only one 360 image
      //When using one panorama we don't need to use scenes
      "panorama": "https://pannellum.org/images/bma-1.jpg", 
      //pitch and yaw are x and y coordinates
      "hotSpots": [
        {
          "pitch": -20.1,
          "yaw": 140.9,
          "text": "Spring House or Dairy",
          // Custom hotspot icon and tooltip
          // "cssClass": "custom-hotspot",
          // "createTooltipFunc": hotspotFunc,
          // "createTooltipArgs": "Baltimore Museum of Art"
        }
      ],

      //Scenes for using multiple 360 images and click on its hotspot to move to that 360 image
      //A scene is a 360 image
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


    // Additional functions that we can use
    // var upMove = function () {
    //   try {
    //     scope.viewer.setPitch(scope.viewer.getPitch() + 5);
    //   }
    //   catch (e) {
    //     console.log(e);
    //   }
    // }

    // var rightMove = function () {
    //   try {
    //     scope.viewer.setYaw(scope.viewer.getYaw() + 5);
    //   }
    //   catch (e) {
    //     console.log(e);
    //   }
    // }

    // var downMove = function () {
    //   try {
    //     scope.viewer.setPitch(scope.viewer.getPitch() - 5);
    //   }
    //   catch (e) {
    //     console.log(e);
    //   }
    // }

    // var leftMove = function () {
    //   try {
    //     scope.viewer.setYaw(scope.viewer.getYaw() - 5);
    //   }
    //   catch (e) {
    //     console.log(e);
    //   }
    // }

    // var swapImage = function () {
    //   try {
    //     var inv_Pitch = scope.viewer.getPitch();
    //     var inv_Yaw = scope.viewer.getYaw();
    //     var inv_Hfov = scope.viewer.getHfov();

    //     if (scope.viewer.getScene() == 'circle') {
    //       scope.viewer.loadScene('house', inv_Pitch, inv_Yaw, inv_Hfov)
    //     }
    //     else {
    //       scope.viewer.loadScene('circle', inv_Pitch, inv_Yaw, inv_Hfov)
    //     }
    //   }
    //   catch (e) {

    //   }
    // }

    //Mouse click event on image
    scope.viewer.on('mousedown', function (event: any) {
      if (scope.cursor.style.cursor == "pointer") {
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

        if (scope.cursor.style.cursor == "pointer") {
          // coords[0] is pitch, coords[1] is yaw
          var coords = scope.viewer.mouseEventToCoords(event);
          console.log("coords", coords);
          //Adding hotspot/marker in the current image
          scope.viewer.addHotSpot({
            "pitch": coords[0],
            "yaw": coords[1],
            "text": "New Hotspot",
          });
          // Do something with the coordinates here...
        }
      }
    });
  }
  
  ngAfterViewInit() {
    var scope = this;

    //Picking cursor 
    scope.cursor =  document.getElementsByClassName("pnlm-ui pnlm-grab").item(0) as HTMLElement;
    //Add marker button
    this.addMarker?.nativeElement.addEventListener('click', function (e: any) {
      if (scope.cursor.style.cursor == "pointer") {
        scope.cursor.style.cursor = "grabbing";
      } else {
        scope.cursor.style.cursor = "pointer";
      }
    })
    this.zoomIn?.nativeElement.addEventListener('click', function (e: any) {
      scope.viewer.setHfov(scope.viewer.getHfov() - 10);
    })
    this.zoomOut?.nativeElement.addEventListener('click', function (e: any) {
      scope.viewer.setHfov(scope.viewer.getHfov() + 10);
    })
    this.fullScreen?.nativeElement.addEventListener('click', function (e: any) {
      scope.viewer.toggleFullscreen();
    })
  }
}
