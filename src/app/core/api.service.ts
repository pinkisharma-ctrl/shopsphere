import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { LoginResponse, User } from './models/api-responses.model';

@Injectable({
  providedIn: 'root'
})

export class ApiService{
  private readonly baseUrl = 'https://fakestoreapi.com';
  private readonly EscuelajsUrl = 'https://api.escuelajs.co/api/v1/auth';
  private allProductsSubject = new BehaviorSubject<any[] | null>(null);
  products$ = this.allProductsSubject.asObservable();

  constructor(private http: HttpClient) {}


  login(formData:any){
    return this.http.post<LoginResponse>(`${this.EscuelajsUrl}/login`, formData);
  }

  _login(formData:any){
    return this.http.post<LoginResponse>(`http://localhost:3000/auth/login`, formData);
  }

  register(formData:any){
      return this.http.post<LoginResponse>(`http://localhost:3000/auth/register`, formData);
  }

  _profile(){
    return this.http.get(`http://localhost:3000/auth/profile`);
   }
  getProfile() {
    return this.http.get<User>(`${this.EscuelajsUrl}/profile`);
  }

  getProduct(): Observable<any> {
    return this.http.get(`${this.baseUrl}/products`);
  }
  getProductById(id: number) {
    return this.http.get<any>(`${this.baseUrl}/products/${id}`);
  }
  updateUserById(id: number, data:any) {
    return this.http.put<any>(`${this.baseUrl}/users/${id}`, data);
  }
  // https://fakestoreapi.com/users/{id}

  setProducts(products: any[]) {
    this.allProductsSubject.next(products);
  }

  getStoredProducts(): any[] | null {
    return this.allProductsSubject.getValue();
  }

}
