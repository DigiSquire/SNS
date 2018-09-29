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
      'url': './assets/artistimage1.jpg'
    
       },
      {
       'url': './assets/paint2.png'
       },
       {
        'url': './assets/paint1.v2.jpg' 
       
           }
  ];
  constructor(private _http: HttpClient) {}

  ngOnInit() {
  }

}
