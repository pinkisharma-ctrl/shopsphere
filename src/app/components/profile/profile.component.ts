import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ApiService } from '../../core/api.service';
import { HeaderComponent } from "../../header/header.component";
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  standalone:true,
  imports: [CommonModule, ReactiveFormsModule, HeaderComponent],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  profileForm!: FormGroup;
  originalData: any;
  isFormChanged = false;

  constructor(private fb: FormBuilder, private _apiService: ApiService, private router: Router) {}

  ngOnInit(): void {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      this.originalData = user;
      this.profileForm = this.fb.group({
        name: [user.name],
        email: [user.email],
        password: [user.password],
        role: [user.role],
        avatar: [user.avatar],
      });
      this.profileForm.valueChanges.subscribe(val => {
        this.isFormChanged = JSON.stringify(val) !== JSON.stringify({
          name: this.originalData.name,
          email: this.originalData.email,
          password: this.originalData.password,
          role: this.originalData.role,
          avatar: this.originalData.avatar,
        });
      });
    }
  }

  saveChanges() {
    if (this.profileForm.valid && this.isFormChanged) {
      const updatedUser = this.profileForm.value;
      const userFromLocal = JSON.parse(localStorage.getItem('user') || '{}');
      // Prepare payload as per API requirement
      const payload = {
        id: userFromLocal.id,
        username: updatedUser.name,
        email: updatedUser.email,
        password: updatedUser.password
      };
      this._apiService.updateUserById(userFromLocal.id, payload).subscribe({
        next: (res:any) => {
          console.log('User updated:', res);
          // Update localStorage with latest user data
          const newLocalUser = {
            ...userFromLocal,
            name: updatedUser.name,
            email: updatedUser.email,
            password: updatedUser.password,
          };
          localStorage.setItem('user', JSON.stringify(newLocalUser));
          this.originalData = { ...this.profileForm.value };
          this.isFormChanged = false;
        },
        error: (err:any) => {
          console.error('Update failed:', err);
        }
      });
    }
  }
  
  cancelChanges() {
    this.router.navigate(['/home']);
    if (this.originalData) {
      this.profileForm.patchValue(this.originalData);
      this.isFormChanged = false;
    }
  }
}
