import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminCenterRoutingModule } from './admin-center-routing.module';
import { MaterialModule } from '../material/material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { AdminCenterComponent } from './admin-center/admin-center.component';
import { PendingArtworksComponent } from './pending-artworks/pending-artworks.component';
import { ApprovedArtworksComponent } from './approved-artworks/approved-artworks.component';
import { RejectedArtworksComponent } from './rejected-artworks/rejected-artworks.component';
import { SharedModule } from '../shared/shared.module';
@NgModule({
  imports: [
    CommonModule,
    AdminCenterRoutingModule,
    ReactiveFormsModule,
    MaterialModule,
    SharedModule
  ],
  declarations: [
    AdminCenterComponent,
    PendingArtworksComponent,
    ApprovedArtworksComponent,
    RejectedArtworksComponent
  ]
})
export class AdminModule { }
