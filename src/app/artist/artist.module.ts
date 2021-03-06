import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ArtistCenterRoutingModule } from './artist-center-routing.module';
import { MaterialModule } from '../material/material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { ArtistCenterComponent } from './artist-center/artist-center.component';
import { ProfileComponent } from './profile/profile.component';
import { MyArtworksComponent } from './my-artworks/my-artworks.component';
import { UploadArtworkComponent } from './upload-artwork/upload-artwork.component';
import { DropZoneDirective } from '../uploads/drop-zone.directive';
import { NumbersOnlyDirective } from '../core/numbers-only.directive';
import { SharedModule } from '../shared/shared.module';
import { FileSizePipe  } from '../uploads/file-size.pipe';
@NgModule({
  imports: [
    CommonModule,
    ArtistCenterRoutingModule,
    ReactiveFormsModule,
    MaterialModule,
    SharedModule
  ],
  declarations: [
    NumbersOnlyDirective,
    ArtistCenterComponent,
    DropZoneDirective,
    FileSizePipe,
    ProfileComponent,
    MyArtworksComponent,
    UploadArtworkComponent
  ]
})
export class ArtistModule { }
