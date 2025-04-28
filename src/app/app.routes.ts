import { Routes } from '@angular/router';
import { loadRemoteModule } from '@angular-architects/module-federation';
import { SignInComponent } from './auth/sign-in/sign-in.component';
import { HomeComponent } from './components/home/home.component';


export const routes: Routes = [
  {
    path:'', component:HomeComponent,

  },
    {
        path: 'mfe1',
        loadComponent: () =>
          loadRemoteModule({
            type: 'module',  // Type is 'module', but we're loading a standalone component
            remoteEntry: 'http://localhost:4201/remoteEntry.js',  // URL to the remote MFE
            //remoteName: 'mfe1',
            exposedModule: './RemoteEntryComponent',  // Load the exposed component
          }).then((m) => m.RemoteEntryComponent),  // Use the component directly
      },
      {
        path: 'auth',
        loadChildren: () =>
          import('./auth/auth.module').then((m) => m.AuthModule),
      },
      {
        path: '',
        loadChildren: () =>
          import('./components/pages.module').then((m) => m.PagesModule),
      },
      {
        path: '**',
        redirectTo: 'home',
      }
     // {
      //   path: 'auth',
      //   loadChildren: () =>
      //     import('./auth/auth.module').then((m) => m.AuthModule),  // Lazy loading auth module
      // },
      // { path: '', redirectTo: '/auth/sign-in', pathMatch: 'full' },
      // {
      //   path: 'auth',
      //   loadChildren: () =>
      //     import('./auth/auth.module').then((m) => m.AuthModule),  // Lazy loading auth module
      // }
];


/**
 *   {
        path: '',
        redirectTo: 'home',  
        pathMatch: 'full'
      },
      {
        path: 'home',
        component: HomeComponent, 
        canActivate: [AuthGuard]    
      },
      {
        path: 'cart',
        component: CartComponent,  
        canActivate: [AuthGuard]   
      },
      {
        path: 'product-detail/:id',
        component: ProductDetailComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'profile',
        component: ProfileComponent,
        canActivate: [AuthGuard]
      },
      
      {
        path: 'sign-in',
        component: SignInComponent , 
        canActivate: [AuthGuard]  
      },
      {
        path: 'sign-up',
        component: SignUpComponent, 
        canActivate: [AuthGuard]  
      },
      {
        path: '**',
        redirectTo: 'sign-in' 
      }
 */