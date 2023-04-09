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

@NgModule({
  declarations: [AppComponent, RegisterComponent, UsersComponent, ImageviewerComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    NgxIntlTelInputModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
