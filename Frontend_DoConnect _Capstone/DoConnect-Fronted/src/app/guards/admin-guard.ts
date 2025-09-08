import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(): boolean {
    
     if (localStorage.getItem('token')) {
      return true;
    }
    this.router.navigate(['/login']); // Unauthorized ko login par bhejo
    return false;
  }
}