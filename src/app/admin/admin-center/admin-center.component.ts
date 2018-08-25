import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'admin-center',
  templateUrl: './admin-center.component.html',
  styleUrls: ['./admin-center.component.scss']
}) 
export class AdminCenterComponent implements OnInit {
  navLinks = [{
    'path': './pending-approvals',
    'label': 'Pending-Approvals'
  }, {
    'path': './approved',
    'label': 'Approved'
  }, {
    'path': './all-artworks',
    'label': 'All Artworks'
  }];
  activeLink = this.navLinks[0];
  constructor() { }

  ngOnInit() {
  }

}
