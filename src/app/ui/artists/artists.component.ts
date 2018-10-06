import { Component, OnInit } from '@angular/core';
import { NgbCarouselConfig } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '../../core/auth.service';

@Component({
  selector: 'artists',
  templateUrl: './artists.component.html',
  styleUrls: ['./artists.component.scss'],
  providers: [NgbCarouselConfig]
})
export class ArtistsComponent implements OnInit {
  showNavigationArrows = false;
  images: Array < any > = [{
      'url': './assets/paint1.1.jpeg'

    },
    {
      'url': './assets/paint2.1.jpeg'
    },
    {
      'url': './assets/paint3.1.jpeg'

    }
  ];
  constructor(public auth: AuthService) {}

  ngOnInit() {}

}
