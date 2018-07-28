import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ArtistCenterRoutingModule } from './artist-center-routing.module';
import { MaterialModule } from '../material/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ArtistCenterComponent } from './artist-center/artist-center.component';
import { ProfileComponent } from './profile/profile.component';
import { MyArtworksComponent } from './my-artworks/my-artworks.component';
import { UploadArtworkComponent } from './upload-artwork/upload-artwork.component';
@NgModule({
  imports: [
    CommonModule,
    ArtistCenterRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule
  ],
  declarations: [ArtistCenterComponent, ProfileComponent, MyArtworksComponent, UploadArtworkComponent]
})
export class ArtistModule { }
