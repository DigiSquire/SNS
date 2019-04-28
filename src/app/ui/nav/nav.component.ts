import { Component } from '@angular/core';
import { Location } from '@angular/common';
@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent {
  location: Location;
  constructor(location: Location) {
    this.location = location;
  }

}
