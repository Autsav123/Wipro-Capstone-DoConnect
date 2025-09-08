import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: false
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMsg = '';
  loading = false;
  submitted = false;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  get f() { return this.loginForm.controls; }

  onSubmit() {
    this.submitted = true;
    if (this.loginForm.invalid) return;

    this.loading = true;
    this.http.post('http://localhost:5193/api/UserApi/login', this.loginForm.value)
      .subscribe({
        next: (response: any) => {
          console.log('Login response:', response); // Debug log

          // JWT Token, Role, UserId save karo
          if (response && response.token) {
            localStorage.setItem('token', response.token);
            localStorage.setItem('userRole', response.role);
            localStorage.setItem('userId', response.userId);

            // Store username and email from response or use form values as fallback
            localStorage.setItem('username', response.username || this.loginForm.value.username);
            localStorage.setItem('email', response.email || 'user@doconnect.com');

            console.log('Stored in localStorage:');
            console.log('username:', localStorage.getItem('username'));
            console.log('email:', localStorage.getItem('email'));
            console.log('userRole:', localStorage.getItem('userRole'));
            console.log('userId:', localStorage.getItem('userId'));

            // Role-based redirect
            if (response.role === 'Admin') {
              this.router.navigate(['/admin-dashboard']);
            } else {
              this.router.navigate(['/questions']);  // Ya /profile for normal users
            }
          } else {
            this.errorMsg = 'Login failed: Invalid response!';
          }
          this.loading = false;
        },
        error: err => {
          this.errorMsg = 'Login failed! Username or password incorrect.';
          this.loading = false;
        }
});
}
}