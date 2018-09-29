import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PendingArtworksComponent } from './pending-artworks/pending-artworks.component';
import { RejectedArtworksComponent } from './rejected-artworks/rejected-artworks.component';
import { AdminCenterComponent } from './admin-center/admin-center.component';
import { ApprovedArtworksComponent } from './approved-artworks/approved-artworks.component';
import { AuthGuard } from '../core/auth.guard';

const adminCenterRoutes: Routes = [
    {
        path: '', 
        component: AdminCenterComponent,
        canActivate: [AuthGuard],
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
                path: 'rejected',
                component: RejectedArtworksComponent
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