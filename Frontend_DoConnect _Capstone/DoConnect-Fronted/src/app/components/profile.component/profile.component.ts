import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile.component',
  standalone: false,
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit {
  username: string = '';
  email: string = '';

  constructor(private router: Router) {}

  ngOnInit(): void {
    // Load user data from localStorage
    const storedUsername = localStorage.getItem('username');
    const storedEmail = localStorage.getItem('email');
    const storedRole = localStorage.getItem('userRole');

    // Set values with better fallbacks
    this.username = storedUsername || 'User';
    this.email = storedEmail || 'user@doconnect.com';

    // Debug: Log what's in localStorage
    console.log('Profile Component - localStorage contents:');
    console.log('username:', storedUsername);
    console.log('email:', storedEmail);
    console.log('userRole:', storedRole);
    console.log('userId:', localStorage.getItem('userId'));
    console.log('token:', localStorage.getItem('token'));

    // If no username/email found, try to get from API or show message
    if (!storedUsername || !storedEmail) {
      console.warn('Username or email not found in localStorage. This might indicate an issue with the login process.');
    }
  }

  getUserRole(): string {
    return localStorage.getItem('userRole') || 'User';
  }

  getRoleBadgeClass(): string {
    const role = this.getUserRole().toLowerCase();
    switch (role) {
      case 'admin':
        return 'badge-primary';
      case 'user':
        return 'badge-secondary';
      default:
        return 'badge-secondary';
    }
  }

  isAdmin(): boolean {
    return localStorage.getItem('userRole') === 'Admin';
  }

  editProfile(): void {
    // TODO: Implement edit profile functionality
    alert('Edit profile functionality will be implemented soon!');
  }

  changePassword(): void {
    // TODO: Implement change password functionality
    alert('Change password functionality will be implemented soon!');
  }

  refreshProfile(): void {
    // Refresh profile data from localStorage
    console.log('Refreshing profile data...');

    // Re-read from localStorage
    const storedUsername = localStorage.getItem('username');
    const storedEmail = localStorage.getItem('email');

    this.username = storedUsername || 'User';
    this.email = storedEmail || 'user@doconnect.com';

    // Show current localStorage contents
    console.log('Current localStorage contents:');
    console.log('username:', storedUsername);
    console.log('email:', storedEmail);
    console.log('userRole:', localStorage.getItem('userRole'));
    console.log('userId:', localStorage.getItem('userId'));
    console.log('token:', localStorage.getItem('token'));

    // Show alert with current values
    alert(`Profile refreshed!\nUsername: ${this.username}\nEmail: ${this.email}\nRole: ${this.getUserRole()}`);
  }

  logout(): void {
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}
