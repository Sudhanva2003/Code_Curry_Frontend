
import { Injectable } from "@angular/core";

export interface UserData {
  userId: number;
  name: string;
  email: string;
  role: 'user' | 'restaurant';
}

@Injectable({ providedIn: 'root' })
export class AuthGuard {
  private user: UserData | null = null;

  // Set user after login
  setUser(user: UserData) {
    this.user = user;
    localStorage.setItem('user', JSON.stringify(user));
  }

  // Get entire user object
  getUser(): UserData | null {
    if (!this.user) {
      const stored = localStorage.getItem('user');
      if (stored) {
        this.user = JSON.parse(stored);
      }
    }
    return this.user;
  }

  // Get role only
  getRole(): 'user' | 'restaurant' | null {
    return this.getUser()?.role ?? null;
  }

  // Get id only
  getId(): number | null {
    return this.getUser()?.userId ?? null;
  }

   getRestId(): number | null {
    return this.getUser()?.userId ?? null;
  }


  // Clear on logout
  logout() {
    this.user = null;
    localStorage.removeItem('user');
  }
}
