import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ProfileComponent } from './profile/profile.component';
import { MyArtworksComponent } from './my-artworks/my-artworks.component';
import { ArtistCenterComponent } from './artist-center/artist-center.component';
import { UploadArtworkComponent } from './upload-artwork/upload-artwork.component';


const artistCenterRoutes: Routes = [
    {
        path: '',
        component: ArtistCenterComponent,
        children: [
            {
                path: '',
                redirectTo: 'profile',
                pathMatch: 'full',
                component: ProfileComponent
            },
            {
                path: 'profile',
                component: ProfileComponent
            },
            {
                path: 'upload',
                component: UploadArtworkComponent                
            },            
            {
                path: 'my-artworks',
                component: MyArtworksComponent
            }
        ]
    }
];

@NgModule({
    imports: [
        RouterModule.forChild(artistCenterRoutes)
    ],
    exports: [
        RouterModule
    ]
})
export class ArtistCenterRoutingModule { }