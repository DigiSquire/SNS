import { BrowserModule, BrowserTransferStateModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { LoadingModule } from 'ngx-loading';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { environment } from '../environments/environment';
// import { AngularFireModule } from 'angularfire2';
import { AngularFireAuthModule } from '@angular/fire/auth'
// import { AngularFireAuthModule } from 'angularfire2/auth';
import { CoreModule } from './core/core.module';
import { UiModule } from './ui/ui.module';
// import { AngularFireStorageModule } from 'angularfire2/storage';
import { AngularFireModule } from '@angular/fire';
import { AngularFireStorageModule } from '@angular/fire/storage';
@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [ 
    LoadingModule,
    BrowserAnimationsModule,
    BrowserModule.withServerTransition({appId: 'my-app'}),
    BrowserTransferStateModule,
    AppRoutingModule,
    CoreModule,
    UiModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireAuthModule,
    AngularFireStorageModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
