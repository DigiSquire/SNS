import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './core/auth.guard';
import { HomePageComponent } from './ui/home-page/home-page.component';
import { UserFormComponent } from './ui/user-form/user-form.component';
import { GalleryComponent } from './ui/gallery/gallery.component';
import { ArtistsComponent } from './ui/artists/artists.component';
// , canActivate: [AuthGuard] 
const routes: Routes = [
  { path: '', redirectTo: 'gallery', pathMatch: 'full' },
  { path: 'home', component: HomePageComponent },
  {
    path: 'artist-center',
    loadChildren: 'app/artist/artist.module#ArtistModule'
  },
  {
    path: 'admin-center',
    loadChildren: 'app/admin/admin.module#AdminModule'
  },
  { path: 'artists', component: ArtistsComponent },
  { path: 'login', component: UserFormComponent },
  { path: 'gallery', component: GalleryComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { initialNavigation: 'enabled' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
