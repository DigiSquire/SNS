import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgbCarouselConfig } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '../../core/auth.service';

@Component({
  selector: 'artists',
  templateUrl: './artists.component.html',
  styleUrls: ['./artists.component.scss'],
  providers: [NgbCarouselConfig]
})
export class ArtistsComponent implements OnInit, OnDestroy {
  showNavigationArrows = false;
  private subscription;
  userRole: string = null;
  images: Array < any > = [{
    'url': './assets/paint1.1-min.jpeg'

    },
    {
      'url': './assets/paint2.1-min.jpeg'
    },
    {
      'url': './assets/paint3.1-min.jpeg'

    }
  ];
  constructor(private auth: AuthService) {}

  ngOnInit() {
    this.subscription = this.auth.loggedInUserRole.subscribe((message) => this.userRole = message);
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
