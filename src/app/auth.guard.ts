// import { Injectable } from "@angular/core";
// @Injectable({ providedIn: 'root' })
// export class AuthGuard {
//   private role: 'user' | 'restaurant' | null = null;

//   login(role: 'user' | 'restaurant') {
//     this.role = role;
//   }

//   getRole(): 'user' | 'restaurant' | null {
//     if (!this.role) {
//       // Read from localStorage on page reload
//       const storedRole = localStorage.getItem('role');
//       if (storedRole === 'user' || storedRole === 'restaurant') {
//         this.role = storedRole;
//       }
//     }
//     return this.role;
//   }
// }


// import { Injectable } from "@angular/core";

// export interface UserData {
//   id: number;
//   name: string;
//   role: 'user' | 'restaurant';
// }

// @Injectable({ providedIn: 'root' })
// export class AuthGuard {
//   private user: UserData | null = null;

//   // Set user after login
//   setUser(user: UserData) {
//     this.user = user;
//     localStorage.setItem('user', JSON.stringify(user));
//   }

//   // Get user
//   getUser(): UserData | null {
//     if (!this.user) {
//       const stored = localStorage.getItem('user');
//       if (stored) {
//         this.user = JSON.parse(stored);
//       }
//     }
//     return this.user;
//   }

//   // Clear on logout
//   logout() {
//     this.user = null;
//     localStorage.removeItem('user');
//   }
// }


import { Injectable } from "@angular/core";

export interface UserData {
  id: number;
  name: string;
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
    return this.getUser()?.id ?? null;
  }

  // Clear on logout
  logout() {
    this.user = null;
    localStorage.removeItem('user');
  }
}
