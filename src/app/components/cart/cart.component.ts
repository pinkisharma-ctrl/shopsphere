import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { CartService } from '../../shared/cart.service';
import { CurrencyFormatPipe } from '../../shared/currency-format.pipe';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, CurrencyFormatPipe],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss'],
})
export class CartComponent implements OnInit, OnDestroy {
  cartItems: any[] = [];
  private cartSubscription!: Subscription;

  constructor(private cartService: CartService, public router:Router) {}

  ngOnInit() {
    this.cartSubscription = this.cartService.cartItems$.subscribe((items: any[]) => {
      this.cartItems = items;
    });
  }

  removeItem(productId: number) {
    this.cartService.removeFromCart(productId); // this updates both state and localStorage
  }

  clearCart() {
    this.cartService.clearCart(); // this clears both state and localStorage
  }

  goToHome(){
    this.router.navigate(['/home']);
  }
  ngOnDestroy() {
    if (this.cartSubscription) {
      this.cartSubscription.unsubscribe(); // avoid memory leaks
    }
  }
}
