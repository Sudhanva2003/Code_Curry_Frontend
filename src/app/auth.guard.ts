import { Injectable } from "@angular/core";

export interface UserData {
  userId: number;
  name: string;
  email: string;
  role: 'customer' | 'restaurant' | 'deliverer' | 'admin';
}

@Injectable({ providedIn: 'root' })
export class AuthGuard {
  private user: UserData | null = null;

  
  setUser(user: UserData) {
    this.user = user;
    localStorage.setItem('user', JSON.stringify(user));
  }


  getUser(): UserData | null {
    if (!this.user) {
      const stored = localStorage.getItem('user');
      if (stored) {
        this.user = JSON.parse(stored);
      }
    }
    return this.user;
  }


  getRole(): 'customer' | 'restaurant' | 'deliverer' | 'admin' | null {
    return this.getUser()?.role ?? null;
  }


  getId(): number | null {
    return this.getUser()?.userId ?? null;
  }

 
  getRestId(): number | null {
    return this.getUser()?.userId ?? null;
  }

  
  logout() {
    this.user = null;
    localStorage.removeItem('user');
  }
}
