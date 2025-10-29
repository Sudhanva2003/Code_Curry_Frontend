import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthGuard } from './auth.guard';  // Import your existing AuthGuard

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {

  constructor(private authGuard: AuthGuard, private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    const requiredRole = next.data['role'];  // Get required role from route data
    const user = this.authGuard.getUser();
    console.log("RoleGuard: Checking access for role:", requiredRole,user?.role,user);
    // Check if the user is logged in and has the required role
    if (user && user.role?.toLowerCase() === requiredRole) {
      console.log("RoleGuard: Access granted");
      return true;  // Access granted
    } else {
      this.router.navigate(['/login']);  // Redirect to login if not authorized
      return false;
    }
  }
}
