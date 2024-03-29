import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegisterComponent } from './components/register/register.component';
import { UsersComponent } from './components/users/users.component';
import { ImageviewerComponent } from './components/imageviewer/imageviewer.component';
import { MapviewerComponent } from './components/mapviewer/mapviewer.component';
import { AdminmapviewerComponent } from './components/adminmapviewer/adminmapviewer.component';
import { MapImagesComponent } from './components/map-images/map-images.component';
import { AuthGuard } from './guard/auth.guard';

const routes: Routes = [
  { path: '', component: MapviewerComponent },
  {
    path: 'adminmapviewer',
    component: AdminmapviewerComponent,
    canActivate: [AuthGuard],
  },
  { path: 'registerLogin', component: RegisterComponent },
  { path: 'users', component: UsersComponent },
  { path: 'imageViewer', component: ImageviewerComponent },
  { path: 'mapviewer', component: MapviewerComponent },
  { path: 'mapImages', component: MapImagesComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
