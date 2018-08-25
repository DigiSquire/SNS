import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminCenterComponent } from './admin-center/admin-center.component';
import { PendingArtworksComponent } from './pending-artworks/pending-artworks.component';
import { ApprovedArtworksComponent } from './approved-artworks/approved-artworks.component';
import { AllArtworksComponent } from './all-artworks/all-artworks.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [AdminCenterComponent, PendingArtworksComponent, ApprovedArtworksComponent, AllArtworksComponent]
})
export class AdminModule { }
