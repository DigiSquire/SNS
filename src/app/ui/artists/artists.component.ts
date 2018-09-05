import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { NgbCarouselConfig } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'artists',
  templateUrl: './artists.component.html',
  styleUrls: ['./artists.component.scss'],
  providers: [NgbCarouselConfig]
})
export class ArtistsComponent implements OnInit {
  showNavigationArrows = false;
  images: Array<any> = [
    { 
      'url': './assets/img_1@2x.jpg'
    
      },
     {
        'url': './assets/img_2.jpeg'
      }
  ];
  constructor(private _http: HttpClient) {}

  ngOnInit() {
  }

}
