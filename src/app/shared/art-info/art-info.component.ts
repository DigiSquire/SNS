import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';
@Component({
  selector: 'art-info',
  templateUrl: './art-info.component.html',
  styleUrls: ['./art-info.component.scss']
})
export class ArtInfoComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data) { }
}
