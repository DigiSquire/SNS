import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoadingModule } from 'ngx-loading';
import { HomePageComponent } from './home-page/home-page.component';
import { MainNavComponent } from './main-nav/main-nav.component';
import { NotificationMessageComponent } from './notification-message/notification-message.component';
import { UserFormComponent } from './user-form/user-form.component';
import { SeoService } from '../core/seo.service';
import { UploadsModule } from '../uploads/uploads.module';
import { GalleryComponent } from './gallery/gallery.component';
import { NavComponent } from './nav/nav.component';
import { MainFooterComponent } from './main-footer/main-footer.component';
import { MaterialModule } from '../material/material.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { PageTitleComponent } from './page-title/page-title.component';
import { ArtistsComponent } from './artists/artists.component';

@NgModule({
  imports: [
    LoadingModule,
    CommonModule,
    RouterModule,
    FormsModule, 
    ReactiveFormsModule,
    UploadsModule,   
    MaterialModule, 
    NgbModule
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
  ],
  providers: [SeoService]
})
export class UiModule {}
