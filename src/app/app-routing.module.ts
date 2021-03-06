import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './core/auth.guard';
import { ResetPasswordAuthGuard } from './core/reset-password.guard';
import { LoginAuthGuard } from './core/login-auth.guard';
import { HomePageComponent } from './ui/home-page/home-page.component';
import { UserFormComponent } from './ui/user-form/user-form.component';
import { PasswordResetComponent } from './ui//password-reset/password-reset.component';
import { GalleryComponent } from './ui/gallery/gallery.component';
import { ArtistsComponent } from './ui/artists/artists.component';
const routes: Routes = [
  { path: '', redirectTo: 'artists', pathMatch: 'full' },
  { path: 'home', component: HomePageComponent },
  {
    path: 'artist-center',    
    loadChildren: 'app/artist/artist.module#ArtistModule',
    canActivate: [AuthGuard]
  },
  {
    path: 'admin-center',    
    loadChildren: 'app/admin/admin.module#AdminModule',
    canActivate: [AuthGuard]
  },
  { path: 'artists', component: ArtistsComponent },
  { path: 'login',
    component: UserFormComponent,
    canActivate: [LoginAuthGuard] },
  {
    path: 'reset-password',
    component: PasswordResetComponent,
    canActivate: [ResetPasswordAuthGuard]
  },
  { path: 'gallery', component: GalleryComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { scrollPositionRestoration: 'enabled' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
