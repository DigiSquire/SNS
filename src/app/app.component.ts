import { Component } from '@angular/core';
import { AuthService } from './core/auth.service'; 
import { startWith, tap, delay } from 'rxjs/operators';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  public loading: boolean; 

  constructor(private auth: AuthService) { 
    this.auth.isLoading
      .pipe(
        startWith(null),
        delay(0),
      tap((message) => this.loading = message)
      ).subscribe();
  }


}