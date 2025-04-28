// // core/interceptor/token.interceptor.ts
// import { HttpInterceptorFn } from '@angular/common/http';
// export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
//   const token = localStorage.getItem('access_token');
//   const authReq = req.clone({
//     setHeaders: token ? { Authorization: `Bearer ${token}` } : {}
//   });
//   return next(authReq);
// };

// core/interceptor/token.interceptor.ts
import { HttpInterceptorFn } from '@angular/common/http';

export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
  const skipAuthUrls = ['/login', '/signup'];
  const shouldSkip = skipAuthUrls.some(url => req.url.includes(url));
  if (shouldSkip) {
    return next(req);// don't attach token
  }
  const token = localStorage.getItem('token');
  const authReq = req.clone({
    setHeaders: token ? { Authorization: `Bearer ${token}` } : {}
  });

  return next(authReq); // attach token for other routes
};
