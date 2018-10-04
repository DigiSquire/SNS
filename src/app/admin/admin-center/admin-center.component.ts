import { Component } from '@angular/core';
import { NotifyService } from '../../core/notify.service';
@Component({
  selector: 'admin-center',
  templateUrl: './admin-center.component.html',
  styleUrls: ['./admin-center.component.scss']
}) 
export class AdminCenterComponent {
  navLinks = [{
    'path': './pending-approvals',
    'label': 'Pending-Approvals'
  }, {
    'path': './approved',
    'label': 'Approved'
  }, {
    'path': './rejected',
    'label': 'Rejected'
  }];
  activeLink = this.navLinks[0];
  constructor(private notify: NotifyService) { }
  clearMsg = () => {
    this.notify.clear();
  }
}
