import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../core/api.service';
import { CartService } from '../../shared/cart.service';
import { HeaderComponent } from "../../header/header.component";
import { CurrencyFormatPipe } from "../../shared/currency-format.pipe";

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, HeaderComponent, CurrencyFormatPipe],
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss']
})
export class ProductDetailComponent implements OnInit {
  product: any;
  similarProducts: any[] = [];
  currentSlideIndex: number = 0;
  slideSize: number = 6; // Show 6 products per row

  constructor(
    private route: ActivatedRoute,
    private apiService: ApiService,
    private cartService: CartService,
    private router: Router
  ) {}

  ngOnInit(): void {
    let productId = Number(this.route.snapshot.paramMap.get('id'));
    const storedProduct = localStorage.getItem('selectedProduct');
    if (storedProduct) {
      this.product = JSON.parse(storedProduct);
      this.loadSimilarProducts(this.product.category);
    }
  
    this.apiService.getProductById(productId).subscribe(product => {
      this.product = product;
      localStorage.setItem('selectedProduct', JSON.stringify(product));
      this.loadSimilarProducts(product.category);
    });
  }

  loadSimilarProducts(category: string) {
    const cachedProducts = this.apiService.getStoredProducts();
    if (cachedProducts) {
      this.similarProducts = cachedProducts.filter(
        p => p.category === category && p.id !== this.product.id
      );
    } else {
      this.apiService.getProduct().subscribe(products => {
        this.apiService.setProducts(products); // Save in service
        this.similarProducts = products.filter(
          (p:any) => p.category === category && p.id !== this.product.id
        );
      });
    }
  }

  addToCart(product: any) {
    this.cartService.addToCart(product);

  }

  // Slider Controls
  get currentSlide(): any[] {
    const start = this.currentSlideIndex * this.slideSize;
    return this.similarProducts.slice(start, start + this.slideSize);
  }

  nextSlide() {
    if ((this.currentSlideIndex + 1) * this.slideSize < this.similarProducts.length) {
      this.currentSlideIndex++;
    }
  }

  prevSlide() {
    if (this.currentSlideIndex > 0) {
      this.currentSlideIndex--;
    }
  }

  goToHome(){
    this.router.navigate(['/home'])

  }
  ngOnDestroy(): void {
    localStorage.removeItem('selectedProduct');
  }
}
