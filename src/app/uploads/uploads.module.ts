import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UploadPageComponent } from './upload-page/upload-page.component';
import { DropZoneDirective } from './drop-zone.directive';
// import { FileSizePipe } from './file-size.pipe';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [UploadPageComponent],
  exports: [UploadPageComponent ] 
})
export class UploadsModule { }
