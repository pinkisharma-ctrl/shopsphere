// src/app/core/services/auth.service.ts
import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly localStorageKey = 'user';
  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}
  signUp(username: string, password: string): void {
    localStorage.setItem(this.localStorageKey, JSON.stringify({ username, password }));
  }

  signIn(username: string, password: string): boolean {
    const userData = localStorage.getItem(this.localStorageKey);
    if (!userData) return false;

    const { username: storedUsername, password: storedPassword } = JSON.parse(userData);
    return username === storedUsername && password === storedPassword;
  }


  isAuthenticated(): boolean {
    if (isPlatformBrowser(this.platformId)) {
      return !!localStorage.getItem(this.localStorageKey);
    }
    return false;
  }
}
