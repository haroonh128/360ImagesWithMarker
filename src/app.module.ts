import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { RegisterComponent } from './components/register/register.component';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxIntlTelInputModule } from 'ngx-intl-tel-input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { UsersComponent } from './components/users/users.component';
import { ImageviewerComponent } from './components/imageviewer/imageviewer.component';
import { AngularFireModule } from '@angular/fire/compat';
import { environment } from './environments/environment';
import { ToastrModule } from 'ngx-toastr';
import { AgmCoreModule } from '@agm/core';
import { MapviewerComponent } from './components/mapviewer/mapviewer.component';
import { MapImagesComponent } from './components/map-images/map-images.component';
import { AdminmapviewerComponent } from './components/adminmapviewer/adminmapviewer.component';
@NgModule({
  declarations: [
    AppComponent,
    RegisterComponent,
    UsersComponent,
    ImageviewerComponent,
    MapviewerComponent,
    MapImagesComponent,
    AdminmapviewerComponent,
  ],
  imports: [
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyAy-keeXMuyQHOBUHwUfNz8jFZK5agMEeM',
      libraries: ['drawing'],
    }),
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    NgxIntlTelInputModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    AngularFireModule.initializeApp(environment.firebase),
    ToastrModule.forRoot(),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
