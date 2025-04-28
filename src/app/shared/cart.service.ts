import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartKey = 'cartItems';
  private cartItemsSubject = new BehaviorSubject<any[]>(this.getCartFromStorage());
  cartItems$ = this.cartItemsSubject.asObservable();

  constructor() {}

  private getCartFromStorage(): any[] {
    const data = localStorage.getItem(this.cartKey);
    return data ? JSON.parse(data) : [];
  }

  private updateStorage(items: any[]) {
    localStorage.setItem(this.cartKey, JSON.stringify(items));
    this.cartItemsSubject.next(items);
  }

  getCartItems(): any[] {
    return this.getCartFromStorage();
  }

  addToCart(item: any) {
    const currentItems = this.getCartFromStorage();
    const exists = currentItems.some(product => product.id === item.id);
  
    if (!exists) {
      currentItems.push(item);
      this.updateStorage(currentItems);
    }
  }
  

  removeFromCart(index: number) {
    const currentItems = this.getCartFromStorage();
    const updatedItems = currentItems.filter(item => item.id !== index);
    this.updateStorage(updatedItems);
  }

  clearCart() {
    localStorage.removeItem(this.cartKey);
    this.cartItemsSubject.next([]);
  }

  // Optional: remove by product ID
  removeItemById(productId: number) {
    const currentItems = this.getCartFromStorage();
    const updatedItems = currentItems.filter(item => item.id !== productId);
    this.updateStorage(updatedItems);
  }
}
