import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../../core/auth.service';
import { NgbDropdownConfig } from '@ng-bootstrap/ng-bootstrap';
import { startWith, tap } from 'rxjs/operators';
@Component({
  selector: 'main-nav',
  templateUrl: './main-nav.component.html',
  styleUrls: ['./main-nav.component.scss'],
  providers: [NgbDropdownConfig]
})
export class MainNavComponent implements OnInit, OnDestroy {
  userRole: string = null;
  private subscription;
  public loading: boolean; 
  constructor(public auth: AuthService, config: NgbDropdownConfig) {
    config.placement = 'bottom-right';
    config.autoClose = true;
  }

  ngOnInit() {
    this.auth.loggedInUserRole.subscribe((message) => this.userRole = message);
    this.subscription = this.auth.isLoading
      .pipe(
        startWith(false),
        tap((message) => this.loading = message)
      ).subscribe();
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}

