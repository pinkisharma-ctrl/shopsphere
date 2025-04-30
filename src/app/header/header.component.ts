import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CartService } from '../shared/cart.service';
import { ApiService } from '../core/api.service';

@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  constructor(public router : Router,private cartService: CartService,private _apiService :ApiService ){}
  cartItemCount:number=0;

    ngOnInit() {
      this.cartService.cartItems$.subscribe((items: any[]) => {
          this.cartItemCount = items.length;
      });
    }

  logout() {
    this.router.navigate(['/auth/sign-in']);
   localStorage.clear();
     
  }
  goToCart(){
    this.router.navigate(['/cart']);
  }

  goToHomePage(){
    this.router.navigate(['/home']);
  }
  
  goToProfile(){
    this.router.navigate(['/profile'])
      // this._apiService._profile().subscribe((response) => {
      //   console.log(response)
      //   this.router.navigate(['/profile']);
      // });
  }

}