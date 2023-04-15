import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegisterComponent } from './components/register/register.component';
import { UsersComponent } from './components/users/users.component';
import { ImageviewerComponent } from './components/imageviewer/imageviewer.component';
import { MapviewerComponent } from './components/mapviewer/mapviewer.component';
import { AdminmapviewerComponent } from './components/adminmapviewer/adminmapviewer.component';

const routes: Routes = [
  { path: '', component: RegisterComponent },
  { path: 'adminmapviewer', component: AdminmapviewerComponent },
  { path: 'registerLogin', component: RegisterComponent },
  { path: 'users', component: UsersComponent },
  { path: 'imageViewer', component: ImageviewerComponent },
  { path: 'mapviewer', component: MapviewerComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
