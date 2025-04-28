import { Routes } from '@angular/router';
import { RemoteEntryComponent } from './remote-entry/remote-entry.component';

export const routes: Routes = [
    {
        path: 'remote-entry',
        component: RemoteEntryComponent,  // Use the standalone component directly
      },
      { path: '', redirectTo: '', pathMatch: 'full' },
];
