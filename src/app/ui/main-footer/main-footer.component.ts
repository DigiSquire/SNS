import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
@Component({
  selector: 'main-footer',
  templateUrl: './main-footer.component.html',
  styleUrls: ['./main-footer.component.scss']
})
export class MainFooterComponent implements OnInit {
  location: Location;
  constructor(location: Location) {
    this.location = location;
  }

  ngOnInit() {
  }

}
