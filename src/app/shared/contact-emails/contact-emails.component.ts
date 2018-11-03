import { Component, Input } from '@angular/core';
import { Location } from '@angular/common';
@Component({
  selector: 'contact-emails',
  templateUrl: './contact-emails.component.html',
  styleUrls: ['./contact-emails.component.scss']
})
export class ContactEmailsComponent {
  @Input() header;
  location: Location;
  constructor(location: Location) {
    this.location = location;
  }
}
