import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private loggedIn = false;
  private role: 'user' | 'restaurant' | null = null;

  login(username: string, password: string, role: 'user' | 'restaurant'): boolean {
    // dummy login logic
    if (username && password) {
      this.loggedIn = true;
      this.role = role;
      localStorage.setItem('role', role);
      localStorage.setItem('token', 'dummy-token');
      return true;
    }
    return false;
  }

  logout() {
    this.loggedIn = false;
    this.role = null;
    localStorage.clear();
  }

  isLoggedIn(): boolean {
    return this.loggedIn || !!localStorage.getItem('token');
  }

  getRole(): 'user' | 'restaurant' | null {
    return this.role || (localStorage.getItem('role') as 'user' | 'restaurant' | null);
  }
}
