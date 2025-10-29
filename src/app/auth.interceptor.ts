import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthGuard } from './auth.guard';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private authGuard: AuthGuard) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
     console.log('Interceptor: Request intercepted');
    const user = this.authGuard.getUser();
    if (user && user.token) {  // Check if token is present in user data
      const clonedRequest = req.clone({
        setHeaders: {
          Authorization: `Bearer ${user.token}`  // Add Bearer token to Authorization header
        }
      });
      return next.handle(clonedRequest);  // Forward the modified request
    }
    return next.handle(req);  // If no token, proceed without modifying the request
  }
}
