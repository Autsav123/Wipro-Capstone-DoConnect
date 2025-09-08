import { Component, signal } from '@angular/core';
import{ Router } from '@angular/router';
@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  standalone: false,
  styleUrl: './app.css'
})
export class App {
  constructor(private router: Router) {}

  protected readonly title = signal('DoConnect-Fronted');

  isAdmin(): boolean {
    return localStorage.getItem('userRole') === 'Admin';
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token') || !!localStorage.getItem('userId');
  }

  logout() {
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}

  