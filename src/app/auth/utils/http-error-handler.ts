import { HttpErrorResponse } from '@angular/common/http';

export function handleHttpError(error: HttpErrorResponse): void {
  switch (error.status) {
    case 400:
      console.error('Bad Request:', error.error);
      break;
    case 401:
      console.warn('Unauthorized. Token may have expired.');
      break;
    case 403:
      console.error('Forbidden: Access is denied.');
      break;
    case 404:
      console.error('Not Found:', error.error?.message || 'Resource not found');
      break;
    case 500:
      console.error('Server Error:', error.message);
      break;
    default:
      console.error('Unexpected error:', error.message);
  }
}
