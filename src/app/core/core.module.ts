import { NgModule } from '@angular/core';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';
import { NotifyService } from './notify.service';
import { HttpClientModule } from '@angular/common/http';
import { HttpErrorHandler } from './http-error-handler.service';
import { ArtworkService } from './artwork.service'
@NgModule({
  imports: [
    HttpClientModule
  ],
  providers: [AuthService, AuthGuard, NotifyService, HttpErrorHandler, ArtworkService]
})
export class CoreModule { }
