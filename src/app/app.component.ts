import { Component } from '@angular/core';
import { AuthService } from './core/auth.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  public loading: boolean; 

  constructor(private auth: AuthService) { 
    this.auth.isLoading.subscribe(message => this.loading = message)
  }


}