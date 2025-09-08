import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  standalone: false
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
  submitted = false;
  loading = false;
  successMsg = '';
  errorMsg = '';
  roles = ['User', 'Admin']; // Available roles

  constructor(
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit() {
    this.registerForm = this.formBuilder.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      role: ['User', Validators.required] // Default role set to 'User'
    });
  }

  // Getter for form fields
  get f() { return this.registerForm.controls; }

  onSubmit() {
    this.submitted = true;
    this.errorMsg = '';
    this.successMsg = '';

    console.log(this.registerForm.value);
    if (this.registerForm.invalid) return;

    this.loading = true;
    this.http.post<any>('http://localhost:5193/api/UserApi/Register', this.registerForm.value)
      .subscribe({
        next: (res) => {
          // Store user information in localStorage
          localStorage.setItem('username', res.username || this.f['username'].value);
          localStorage.setItem('email', res.email || this.f['email'].value);
          localStorage.setItem('userRole', res.role || this.f['role'].value);

          // Store userId if provided by backend
          if (res.userId) {
            localStorage.setItem('userId', res.userId.toString());
          }

          // Store token if provided by backend
          if (res.token) {
            localStorage.setItem('token', res.token);
          }

          this.successMsg = 'Registration successful! Redirecting to profile...';
          this.loading = false;

          setTimeout(() => {
            this.router.navigate(['/profile']);
          }, 2000);
        },
        error: (err) => {
          this.errorMsg = err.error?.message || 'Registration failed. Please try again.';
          this.loading = false;
        }
      });
  }
}