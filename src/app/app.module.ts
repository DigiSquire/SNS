import { BrowserModule, BrowserTransferStateModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule  } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { environment } from '../environments/environment';

import { AngularFireModule } from 'angularfire2';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { LoadingModule } from 'ngx-loading';
import { CoreModule } from './core/core.module';
import { UiModule } from './ui/ui.module';
// import { UploadsModule } from './uploads/uploads.module';
@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [ 
    BrowserModule.withServerTransition({appId: 'my-app'}),
    BrowserTransferStateModule,
    AppRoutingModule,
    CoreModule,
    UiModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireAuthModule,
    LoadingModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
