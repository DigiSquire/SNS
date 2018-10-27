import { Component, OnInit } from '@angular/core';
import { NotifyService } from '../../core/notify.service';
import { Router, RouterEvent, NavigationEnd  } from '@angular/router';
@Component({
  selector: 'notification-message',
  templateUrl: './notification-message.component.html',
  styleUrls: ['./notification-message.component.scss']
})
export class NotificationMessageComponent implements OnInit {
  currentUrl: string;
  onArtist= false;
  constructor(public notify: NotifyService, private router: Router) {
    
  } 
  ngOnInit() {
    this.router.events.subscribe((event: RouterEvent) => {
      if (event instanceof NavigationEnd) {
        event.urlAfterRedirects.indexOf('artists') > -1 ? this.onArtist = true : this.onArtist = false;
        console.log(this.onArtist);
      }
    });
  }
}
