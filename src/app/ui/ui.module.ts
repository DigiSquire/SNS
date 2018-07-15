import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoadingModule } from 'ngx-loading';
import { HomePageComponent } from './home-page/home-page.component';
import { MainNavComponent } from './main-nav/main-nav.component';
import { NotificationMessageComponent } from './notification-message/notification-message.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { UserFormComponent } from './user-form/user-form.component';
import { ArtistComponent } from './artist/artist.component'; 
import { SeoService } from '../core/seo.service';
import { UploadsModule } from '../uploads/uploads.module';
import { GalleryComponent } from './gallery/gallery.component';
import { UploadArtworkComponent } from './upload-artwork/upload-artwork.component';
import { NavComponent } from './nav/nav.component';
import { MainFooterComponent } from './main-footer/main-footer.component';
import { MaterialModule } from '../material/material.module';
@NgModule({
  imports: [LoadingModule,
     CommonModule, RouterModule, FormsModule, ReactiveFormsModule, UploadsModule, MaterialModule ],
  declarations: [ 
    HomePageComponent,
    MainNavComponent,
    NotificationMessageComponent,
    UserProfileComponent,
    UserFormComponent,
    ArtistComponent,
    GalleryComponent,
    NavComponent,
    MainFooterComponent,
    UploadArtworkComponent
  ],
  exports: [
    MainNavComponent,
    MainFooterComponent,
    NotificationMessageComponent
  ],
  providers: [SeoService]
})
export class UiModule {}
