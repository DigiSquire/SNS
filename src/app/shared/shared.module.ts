import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ArtworkCardComponent } from './artwork-card/artwork-card.component';
import { MaterialModule } from '../material/material.module';
import { DialogComponent } from './dialog/dialog.component';
import { ContactEmailsComponent } from './contact-emails/contact-emails.component';
import { ArtInfoComponent } from './art-info/art-info.component';
@NgModule({
  imports: [
    CommonModule,
    MaterialModule
  ],
  declarations: [
    ArtworkCardComponent,
    DialogComponent,
    ContactEmailsComponent,
    ArtInfoComponent
  ],
  exports: [
    ArtworkCardComponent,
    ContactEmailsComponent
  ],
  entryComponents: [
    DialogComponent,
    ArtInfoComponent
  ]
})
export class SharedModule { }
