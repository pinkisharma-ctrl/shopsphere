import { HttpInterceptorFn, HttpErrorResponse, HttpClient } from '@angular/common/http';
import { catchError, switchMap, throwError } from 'rxjs';
import { inject } from '@angular/core';
import { handleHttpError } from '../../auth/utils/http-error-handler';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const http = inject(HttpClient);

  return next(req).pipe(
    catchError((err: HttpErrorResponse) => {
      if (err.status === 401) {
        const refreshToken = localStorage.getItem('refresh_token');

        if (refreshToken) {
          return http.post<{ access_token: string }>(
            'https://api.escuelajs.co/api/v1/auth/refresh-token',
            { refreshToken }
          ).pipe(
            switchMap((res) => {
              localStorage.setItem('access_token', res.access_token);
              const clonedReq = req.clone({
                setHeaders: { Authorization: `Bearer ${res.access_token}` }
              });
              return next(clonedReq);
            }),
            catchError(refreshErr => {
              handleHttpError(refreshErr);
              localStorage.clear();
              return throwError(() => refreshErr);
            })
          );
        }
      }
      // Use centralized handler
      handleHttpError(err);
      return throwError(() => err);
    })
  );
};
