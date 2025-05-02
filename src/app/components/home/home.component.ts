import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../core/api.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';  // Add this
import { HeaderComponent } from "../../header/header.component";
import { CategoryMapPipe } from '../../shared/category-map.pipe';
import { CartService } from '../../shared/cart.service';
import { HighlightProductDirective } from '../../shared/highlightProduct.directive';
import { Router } from '@angular/router';
import { CurrencyFormatPipe } from "../../shared/currency-format.pipe";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, HeaderComponent, HighlightProductDirective, CurrencyFormatPipe],  // Add FormsModule
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  allProducts: any[] = [];
  filteredProducts: any[] = [];
  paginatedPosts: any[] = [];
  currentPage = 1;
  pageSize = 8;
  totalPages = 0;
  searchQuery = '';
  categoryPipe = new CategoryMapPipe(); // use pipe
  rating = 4.1; // Use your rating value here
  stars = Array(5).fill(0);

  constructor( public _apiService: ApiService, private cartService: CartService, private router: Router) {}

  ngOnInit(): void {
    const allProductsStr  = localStorage.getItem('allProducts');
    if (allProductsStr) {
      this.allProducts = JSON.parse(allProductsStr);
      this._apiService.setProducts(this.allProducts);
      this.applySearchAndPaginate();
    } else {
      this._apiService.getProduct().subscribe({
        next: (response: any[]) => {
          this.allProducts = response;
            localStorage.setItem('allProducts',JSON.stringify(this.allProducts) )
          this._apiService.setProducts(response); // Save globally
          this.applySearchAndPaginate();
        },
        error: (err) => {
          console.error('Failed to fetch products', err);
        }
      });
    }
  }

  getStarFill(index: number, rate: number): number {
    const fullStars = Math.floor(rate);
    const decimal = rate - fullStars;
    if (index < fullStars) return 100;
    if (index === fullStars) {
      return decimal >= 0.6 ? 100 : 50;
    }
    return 0;
  }
  
  onSearchChange(): void {
    this.currentPage = 1;  // Reset to first page when searching
    this.applySearchAndPaginate();
  }

  applySearchAndPaginate(): void {
    const query = this.searchQuery.trim().toLowerCase();
    this.filteredProducts = query
      ? this.allProducts.filter(product =>
          product.title.toLowerCase().includes(query)
        )
      : this.allProducts;
    this.totalPages = Math.ceil(this.filteredProducts.length / this.pageSize);
    this.updatePaginatedPosts();
  }

  updatePaginatedPosts(): void {
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    this.paginatedPosts = this.filteredProducts.slice(start, end);
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePaginatedPosts();
    }
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePaginatedPosts();
    }
  }

  filterByCategory(categoryKey: string): void {
    const category = this.categoryPipe.transform(categoryKey);
    this.searchQuery = ''; // clear search if category is applied
    this.filteredProducts = this.allProducts.filter(product =>
      product.category.toLowerCase() === category.toLowerCase()
    );
    this.currentPage = 1;
    this.totalPages = Math.ceil(this.filteredProducts.length / this.pageSize);
    this.updatePaginatedPosts();
  }

  addToCart(product: any) {
    this.cartService.addToCart(product);
  }

  getdetails(product:any){
    localStorage.setItem('selectedProduct', JSON.stringify(product))
    this.router.navigate(['/product-detail', product.id])
  }
};