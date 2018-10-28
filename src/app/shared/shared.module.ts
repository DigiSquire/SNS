import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ArtworkCardComponent } from './artwork-card/artwork-card.component';
import { MaterialModule } from '../material/material.module';
import { DialogComponent } from './dialog/dialog.component';
@NgModule({
  imports: [
    CommonModule,
    MaterialModule
  ],
  declarations: [
    ArtworkCardComponent,
    DialogComponent
  ],
  exports: [
    ArtworkCardComponent
  ],
  entryComponents: [
    DialogComponent
  ]
})
export class SharedModule { }
