import { Injectable } from "@angular/core";

export interface UserData {
  userId: number;
  name: string;
  email: string;
  role: 'customer' | 'restaurant' | 'deliverer' | 'admin';
  token?: string;  // Adding token as part of UserData
}

@Injectable({ providedIn: 'root' })
export class AuthGuard {
  private user: UserData | null = null;

  constructor() {
    console.log('AuthGuard service initialized');
  }

  // Set the user data and save it to local storage
  setUser(user: UserData) {
    // Ensure role is lowercase
    user.role = user.role.toLowerCase() as 'customer' | 'restaurant' | 'deliverer' | 'admin';
    console.log('AuthGuard: Setting user with token', user.token);
    this.user = user;
    localStorage.setItem('user', JSON.stringify(user));
  }

  // Get user data from local storage or from the current session
  getUser(): UserData | null {
    if (!this.user) {
      const stored = localStorage.getItem('user');
      if (stored) {
        this.user = JSON.parse(stored);
      }
    }
    return this.user;
  }

  // Get the role of the user (used for route guards)
  getRole(): 'customer' | 'restaurant' | 'deliverer' | 'admin' | null {
    return this.getUser()?.role ?? null;
  }

  // Get user ID (could be useful for API calls)
  getId(): number | null {
    return this.getUser()?.userId ?? null;
  }

  // Get restaurant ID (if the user is a restaurant)
  getRestId(): number | null {
    return this.getUser()?.userId ?? null;
  }

  // Logout: Clear user data from local storage
  logout() {
    this.user = null;
    localStorage.removeItem('user');
  }
}
