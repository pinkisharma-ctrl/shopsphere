import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private _authService: AuthService, private router: Router) {}
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const isLoggedIn = this._authService.isAuthenticated();
    const currentUrl = state.url;
    // If accessing login or signup page and already logged in, redirect to home
    if (currentUrl === '/sign-in' || currentUrl === '/sign-up') {
      if (isLoggedIn) {
        this.router.navigate(['/home']);
        return false; // Prevent navigation to login/signup pages
      }
    } else {
      // If trying to access protected routes, ensure the user is logged in
      if (isLoggedIn) {
        return true; // Allow navigation
      } else {
        this.router.navigate(['/auth/sign-in']);
        return false; // Redirect to sign-in if not logged in
      }
    }

    return true; // Default return
  }
}
