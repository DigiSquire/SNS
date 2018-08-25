import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PendingArtworksComponent } from './pending-artworks/pending-artworks.component';
import { AllArtworksComponent } from './all-artworks/all-artworks.component';
import { AdminCenterComponent } from './admin-center/admin-center.component';
import { ApprovedArtworksComponent } from './approved-artworks/approved-artworks.component';


const adminCenterRoutes: Routes = [
    {
        path: '', 
        component: AdminCenterComponent,
        children: [
            {
                path: '',
                redirectTo: 'pending-approvals',
                pathMatch: 'full',
                component: PendingArtworksComponent
            },
            {
                path: 'pending-approvals',
                component: PendingArtworksComponent
            },
            {
                path: 'approved',
                component: ApprovedArtworksComponent                
            },            
            {
                path: 'all-artworks',
                component: AllArtworksComponent
            }
        ]
    }
];

@NgModule({
    imports: [
        RouterModule.forChild(adminCenterRoutes)
    ],
    exports: [
        RouterModule
    ]
})
export class AdminCenterRoutingModule { }