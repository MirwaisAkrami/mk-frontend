import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const authService = inject(AuthService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      // Don't intercept translation file errors - let ngx-translate handle them
      if (req.url.includes('/assets/i18n/')) {
        return throwError(() => error);
      }

      let errorMessage = 'An error occurred';

      if (error.error instanceof ErrorEvent) {
        // Client-side error
        errorMessage = `Client Error: ${error.error.message}`;
      } else {
        // Server-side error
        if (error.status === 401) {
          // Unauthorized - redirect to login
          console.warn('Unauthorized access - redirecting to login');
          authService.logout();
          router.navigate(['/login']);
          errorMessage = 'Session expired. Please login again.';
        } else if (error.status === 403) {
          // Forbidden
          errorMessage = 'You do not have permission to access this resource.';
        } else if (error.status === 404) {
          errorMessage = 'Resource not found.';
        } else if (error.status === 500) {
          errorMessage = 'Internal server error. Please try again later.';
        } else {
          errorMessage = error.error?.message || `Server Error: ${error.status} - ${error.message}`;
        }
      }

      console.error('HTTP Error:', errorMessage, error);

      return throwError(() => error);
    })
  );
};
