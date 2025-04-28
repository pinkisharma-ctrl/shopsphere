import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../core/api.service';
import { LoginResponse } from '../../core/models/api-responses.model';
import { switchMap, take } from 'rxjs';
import { SocialAuthService, SocialUser, SocialLoginModule, GoogleLoginProvider, GoogleSigninButtonModule } from '@abacritt/angularx-social-login';
import { environment } from '../../../environments/environment';
declare const google: any;

@Component({
  selector: 'app-sign-in',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule,SocialLoginModule,GoogleSigninButtonModule ],
  templateUrl: './sign-in.component.html',
  styleUrl:'./sign-in.component.scss'
})

export class SignInComponent {
  signInForm: FormGroup;
  error = '';
  user: SocialUser | undefined;

  constructor(private fb: FormBuilder, private router: Router, private _apiService : ApiService,
    private socialAuthService: SocialAuthService

  ) {
    this.signInForm = this.fb.group({
      email: ['john@mail.com', [Validators.required, Validators.email]],
      password: ['changeme', Validators.required],
    });
  }

_login(){
  const payload={
    email:'pinki@gmail.com',
    password:'12345678',
  }
  this._apiService._login(payload).subscribe((response) => {
    console.log(response);
    localStorage.setItem('token',response.access_token);
    localStorage.setItem('isLoggedIn', 'true');
    this._getUserDetails();
    // this.router.navigate(['/home']);
  })
}//npm sun start:dev
 
_getUserDetails(){
  this._apiService._profile().subscribe((response) => {
    console.log(response)
    localStorage.setItem('user', JSON.stringify(response));
    this.router.navigate(['/profile']);
  });
}

  login(): void {
    if (this.signInForm.invalid) {
      this.error = 'Please fill all fields correctly.';
      return;
    }
    const { email, password } = this.signInForm.value;
    this._apiService.login({email, password}).pipe(
      take(1),// Only take the first emission
      switchMap((res: LoginResponse) => {
        localStorage.setItem('token', res.access_token);
        localStorage.setItem('isLoggedIn', 'true');
        return this._apiService.getProfile();
      })
    ).subscribe({
      next: (user) => {
        localStorage.setItem('user', JSON.stringify(user));
        this.router.navigate(['/home']);
      },
      error: () => {
        this.error = 'Invalid login credentials';
      }
    });
  }

  ngOnInit(): void {
    this.socialAuthService.authState.subscribe((user) => {
      this.user = user;
      if (user) {
        localStorage.setItem('user', JSON.stringify({
          name: user.name,
          email: user.email,
          avatar: user.photoUrl,
          provider: user.provider
        }));
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('token', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ');
        this.router.navigate(['/home']);
      }
    });
  }
  
  loginWithGoogle(): void {
    this.socialAuthService.signIn(GoogleLoginProvider.PROVIDER_ID);
  }
  
  goToSignUp() {
    this.router.navigate(['/auth/sign-up']);
  }
}

  // handleGoogleSignIn(token: string) {
  //   const base64Url = token.split('.')[1];
  //   const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  //   const decodedPayload = JSON.parse(decodeURIComponent(escape(window.atob(base64))));
  //   const userData = {
  //     email: decodedPayload.email,
  //     name: decodedPayload.name,
  //     avatar: decodedPayload.picture
  //   };
  //   localStorage.setItem('user', JSON.stringify(userData));
  //   localStorage.setItem('isLoggedIn', 'true');
  //   this.router.navigate(['/home']);
  // }


  // ngOnInit(): void {
    
  //   setTimeout(() => {
  //     const google = (window as any).google;
  //     if (google) {
  //       google.accounts.id.initialize({
  //         client_id: environment.googleClientId,
  //         callback: this.handleCredentialResponse.bind(this),
  //       });
    
  //       google.accounts.id.renderButton(
  //         document.getElementById('googleBtn'),
  //         { theme: 'outline', size: 'large' }
  //       );
  //     } else {
  //       console.error('Google not available yet.');
  //     }
  //   }, 3000); // Delay 3 seconds
    
  // }
  
  // handleCredentialResponse(response: any) {
  //   console.log('Google token response:', response);
  //   // Decode JWT if needed, send to backend, etc.
  // }


