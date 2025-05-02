import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ProfileComponent } from './profile.component';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../core/api.service';
import { of, throwError } from 'rxjs';
import { Router } from '@angular/router';

describe('ProfileComponent', () => {
  let component: ProfileComponent;
  let fixture: ComponentFixture<ProfileComponent>;
  let apiServiceSpy: jasmine.SpyObj<ApiService>;
  let routerSpy: jasmine.SpyObj<Router>;

  const mockUser = {
    id: 1,
    name: 'Test User',
    email: 'test@example.com',
    password: '123456',
    role: 'customer',
    avatar: 'https://i.imgur.com/avatar.png'
  };

  beforeEach(async () => {
    localStorage.setItem('user', JSON.stringify(mockUser));

    const apiSpy = jasmine.createSpyObj('ApiService', ['updateUserById']);
    const rSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [CommonModule, ReactiveFormsModule,ProfileComponent],
      providers: [
        { provide: ApiService, useValue: apiSpy },
        { provide: Router, useValue: rSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ProfileComponent);
    component = fixture.componentInstance;
    apiServiceSpy = TestBed.inject(ApiService) as jasmine.SpyObj<ApiService>;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    localStorage.setItem('allProducts', JSON.stringify(mockUser)); // ✅ sets it here

    fixture.detectChanges(); // triggers ngOnInit
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should create the component and initialize form', () => {
    expect(component).toBeTruthy();
    expect(component.profileForm).toBeDefined();
    expect(component.profileForm.get('name')?.value).toBe(mockUser.name);
  });

  it('should detect form changes', fakeAsync(() => {
    component.profileForm.patchValue({ name: 'Updated Name' });
    tick(); // simulate debounce
    expect(component.isFormChanged).toBeTrue();
  }));

  it('should call updateUserById on saveChanges', () => {
    apiServiceSpy.updateUserById.and.returnValue(of({ success: true }));
    component.profileForm.patchValue({ name: 'Updated Name' });
    component.isFormChanged = true;
    component.saveChanges();
    expect(apiServiceSpy.updateUserById).toHaveBeenCalledWith(mockUser.id, jasmine.objectContaining({
      username: 'Updated Name'
    }));
  });

  it('should handle API error gracefully', () => {
    const consoleSpy = spyOn(console, 'error');
    apiServiceSpy.updateUserById.and.returnValue(throwError(() => new Error('API error')));

    component.profileForm.patchValue({ name: 'Updated Name' });
    component.isFormChanged = true;

    component.saveChanges();

    expect(consoleSpy).toHaveBeenCalledWith('Update failed:', jasmine.any(Error));
  });

  it('should reset form and navigate on cancelChanges', () => {
    component.cancelChanges();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/home']);
    expect(component.isFormChanged).toBeFalse();
  });
});
