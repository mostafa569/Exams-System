import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ErrorService {
  handleError(error: HttpErrorResponse) {
    let errorMessage = '';
    
    if (error.status === 0) {
      // Client-side or network error
      errorMessage = 'Network error occurred. Please check your connection.';
    } else {
      // Backend error with response
      errorMessage = error.error.message || `Server returned code ${error.status}`;
    }
    
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}