import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminCenterRoutingModule } from './admin-center-routing.module';
import { MaterialModule } from '../material/material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { AdminCenterComponent } from './admin-center/admin-center.component';
import { PendingArtworksComponent } from './pending-artworks/pending-artworks.component';
import { ApprovedArtworksComponent } from './approved-artworks/approved-artworks.component';
import { RejectedArtworksComponent } from './rejected-artworks/rejected-artworks.component';
import { DialogComponent } from './dialog/dialog.component';

@NgModule({
  imports: [
    CommonModule,
    AdminCenterRoutingModule,
    ReactiveFormsModule,
    MaterialModule
  ],
  declarations: [
    AdminCenterComponent,
    PendingArtworksComponent,
    ApprovedArtworksComponent,
    RejectedArtworksComponent,
    DialogComponent
  ],
    entryComponents: [
      DialogComponent
    ],
})
export class AdminModule { }
