import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoadingModule } from 'ngx-loading';
import { HomePageComponent } from './home-page/home-page.component';
import { MainNavComponent } from './main-nav/main-nav.component';
import { NotificationMessageComponent } from './notification-message/notification-message.component';
import { UserFormComponent } from './user-form/user-form.component';
import { UploadsModule } from '../uploads/uploads.module';
import { GalleryComponent } from './gallery/gallery.component';
import { NavComponent } from './nav/nav.component';
import { MainFooterComponent } from './main-footer/main-footer.component';
import { MaterialModule } from '../material/material.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { PageTitleComponent } from './page-title/page-title.component';
import { ArtistsComponent } from './artists/artists.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  imports: [
    LoadingModule,
    CommonModule,
    RouterModule,
    FormsModule, 
    ReactiveFormsModule,
    UploadsModule,   
    MaterialModule, 
    NgbModule,
    SharedModule
  ],
  declarations: [
    HomePageComponent,
    MainNavComponent,
    NotificationMessageComponent,
    UserFormComponent,
    GalleryComponent,
    NavComponent,
    MainFooterComponent,
    PageTitleComponent,
    ArtistsComponent
  ],
  exports: [
    MainNavComponent,
    MainFooterComponent,
    PageTitleComponent,
    NotificationMessageComponent
  ]
})
export class UiModule {}
