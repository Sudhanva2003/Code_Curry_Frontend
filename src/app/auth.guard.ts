import { Injectable } from "@angular/core";
@Injectable({ providedIn: 'root' })
export class AuthGuard {
  private role: 'user' | 'restaurant' | null = null;

  login(role: 'user' | 'restaurant') {
    this.role = role;
  }

  getRole(): 'user' | 'restaurant' | null {
    if (!this.role) {
      // Read from localStorage on page reload
      const storedRole = localStorage.getItem('role');
      if (storedRole === 'user' || storedRole === 'restaurant') {
        this.role = storedRole;
      }
    }
    return this.role;
  }
}
