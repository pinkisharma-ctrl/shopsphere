import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HomeComponent } from './home.component';
import { ApiService } from '../../core/api.service';
import { CartService } from '../../shared/cart.service';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClient, HttpHandler } from '@angular/common/http';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let apiServiceSpy: jasmine.SpyObj<ApiService>;
  let cartServiceSpy: jasmine.SpyObj<CartService>;
  let router: Router;

  const mockProducts = [
    { id: 1, title: 'Product 1', category: 'electronics' },
    { id: 2, title: 'Product 2', category: 'jewelery' },
    { id: 3, title: 'Another Product', category: 'electronics' },
  ];

  beforeEach(async () => {
    apiServiceSpy = jasmine.createSpyObj('ApiService', ['getProduct', 'setProducts']);
    cartServiceSpy = jasmine.createSpyObj('CartService', ['addToCart']);

    await TestBed.configureTestingModule({
      imports: [HomeComponent, RouterTestingModule],
      providers: [
        { provide: ApiService, useValue: apiServiceSpy },
        { provide: CartService, useValue: cartServiceSpy },
        { provide: HttpClient },
        { provide: HttpHandler}
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    localStorage.setItem('allProducts', JSON.stringify(mockProducts)); // ✅ sets it here
    localStorage.clear();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should paginate products correctly', () => {
    component.filteredProducts = Array.from({ length: 20 }, (_, i) => ({ id: i + 1, title: `Product ${i + 1}` }));
    component.totalPages = 3;
    component.currentPage = 2;
    component.updatePaginatedPosts();
    expect(component.paginatedPosts.length).toBe(component.pageSize);
    expect(component.paginatedPosts[0].id).toBe(9); // Page 2, start index = 8
  });

  it('should go to next and previous page correctly', () => {
    component.filteredProducts = Array.from({ length: 16 }, (_, i) => ({ id: i + 1, title: `Product ${i + 1}` }));
    component.totalPages = 2;
    component.currentPage = 1;
    component.nextPage();
    expect(component.currentPage).toBe(2);
    component.prevPage();
    expect(component.currentPage).toBe(1);
  });

  it('should filter by category', () => {
    component.allProducts = mockProducts;
    component.filterByCategory('electronics');
    expect(component.filteredProducts.length).toBe(2);
  });

  it('should add product to cart', () => {
    const product = { id: 1, title: 'Product 1' };
    component.addToCart(product);
    expect(cartServiceSpy.addToCart).toHaveBeenCalledWith(product);
  });

  it('should navigate to product detail and store selected product', () => {
    spyOn(router, 'navigate');
    const product = { id: 1, title: 'Product 1' };
    component.getdetails(product);
    expect(localStorage.getItem('selectedProduct')).toContain('Product 1');
    expect(router.navigate).toHaveBeenCalledWith(['/product-detail', 1]);
  });

});
