import { Component, OnInit } from '@angular/core';
import { SeoService } from '../../core/seo.service';
import { Router } from '@angular/router';

@Component({
  selector: 'home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent implements OnInit {

  animals$;

  title = 'Welcome to Spaces and Stories';
  description = 'Giving Artists and art connoisseur to connect on a reliable platform';

  newAnimal: { name?: string, bio?: string } = {}
  constructor(private seo: SeoService, private router: Router) { }

  ngOnInit() {
    // this.animals$ = this.afs.collection('animals', ref => ref.orderBy('img') ).valueChanges();
    this.seo.generateTags({
      title: this.title,
      description: this.description,
      slug: 'Home'
      // image: animal.imgURL
    });
  }

}
