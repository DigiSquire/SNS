import { Component, OnInit } from '@angular/core';
import { SeoService } from '../../core/seo.service';
import { FormBuilder, FormGroup, Validators, EmailValidator } from '@angular/forms';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ArtworkService } from '../../core/artwork.service';
@Component({
  selector: 'artist-home',
  templateUrl: './artist.component.html',
  styleUrls: ['./artist.component.scss']
})
export class ArtistComponent implements OnInit  {
  title = 'Welcome Artist to Spaces and Stories';
  seoDescription = 'Giving Artists and art connoisseurs to connect on a reliable platform';
  rForm: FormGroup;
  post: any;                     // A property for our submitted form
  description = '';
  email = '';
  file;
  emailPattern: any = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  titleAlert = 'A valid email is required';

  constructor(private fb: FormBuilder, private seo: SeoService, private http: HttpClient, private artService: ArtworkService) {
    this.rForm = fb.group({
      'email': [null, [Validators.required, Validators.pattern(this.emailPattern)]],
      'description': [null, Validators.compose([Validators.required, Validators.minLength(10), Validators.maxLength(500)])]
    });
  }
  startUpload(event: FileList) {
    // The File object
    this.file = event.item(0);

    // Client-side validation example
    if (this.file.type.split('/')[0] !== 'image') {
      console.error('unsupported file type :( ');
      return;
    }
    console.log(this.file);
  }
  addPost(post) {
    this.description = post.description;
    console.log(this.description);
    this.email = post.email;
    const file = this.file;
    const formData: FormData = new FormData();
    formData.append('metadata', this.email);
    formData.append('file', file);
    console.log(file);    
    return this.artService.uploadArtwork(formData).subscribe((result => {
      console.log(result);
    }));
  }
  ngOnInit() {
    this.seo.generateTags({
      title: this.title,
      description: this.seoDescription,
      slug: 'artists'
      // image: animal.imgURL
    });
  }

}
