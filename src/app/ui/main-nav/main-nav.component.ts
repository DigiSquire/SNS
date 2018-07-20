import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../core/auth.service';
import { NgbDropdownConfig } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'main-nav',
  templateUrl: './main-nav.component.html',
  styleUrls: ['./main-nav.component.scss'],
  providers: [NgbDropdownConfig]
})
export class MainNavComponent {
  constructor(public auth: AuthService, config: NgbDropdownConfig) {
    config.placement = 'bottom-right';
    config.autoClose = true;
   }
}
