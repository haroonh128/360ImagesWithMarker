import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegisterComponent } from './components/register/register.component';
import { UsersComponent } from './components/users/users.component';
import { ImageviewerComponent } from './components/imageviewer/imageviewer.component';

const routes: Routes = [
  { path: '', component: RegisterComponent },

  { path: 'registerLogin', component: RegisterComponent },
  { path: 'users', component: UsersComponent },
  { path: 'imageViewer', component: ImageviewerComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
