import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../core/api.service';

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './sign-up.component.html',
  styleUrl:'./sign-up.component.scss'

})
export class SignUpComponent {
  signUpForm: FormGroup;
  error: string = '';

  constructor(private fb: FormBuilder, private router: Router, private _apiService :ApiService) {
    this.signUpForm = this.fb.group({
      username: ['', Validators.required],
      email: ['john@mail.com', [Validators.required, Validators.email]],
      password: ['changeme', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    });
  }

  signUp() {
    if (this.signUpForm.invalid) {
      this.error = 'Please fill all fields correctly.';
      return;
    }
    const { password, confirmPassword } = this.signUpForm.value;
    if (password !== confirmPassword) {
      this.error = 'Passwords do not match.';
      return;
    }
    const user = {
      firstName: this.signUpForm.value.firstName,
      lastName: this.signUpForm.value.lastName,
      email: this.signUpForm.value.email,
      password: this.signUpForm.value.password
    };

    localStorage.setItem('user', JSON.stringify(user));
    this.router.navigate(['/auth/sign-in']);
  }
  goToSignIn() {
    this.router.navigate(['/auth/sign-in']);
  }

  _register(){
    const payload={
      email:'pinki@gmail.com',
      username:'pinki',
      password:'12345678',
      profilePic:'fskjfsjgfihflk'
    }
    this._apiService.register(payload).subscribe((response) => {
      localStorage.setItem('access_token',response.access_token)
    })
  }
  
}
