import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductDetailComponent } from './product-detail.component';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../core/api.service';
import { CartService } from '../../shared/cart.service';

describe('ProductDetailComponent', () => {
  let component: ProductDetailComponent;
  let fixture: ComponentFixture<ProductDetailComponent>;
  let apiServiceSpy: jasmine.SpyObj<ApiService>;
  let cartServiceSpy: jasmine.SpyObj<CartService>;
  let routerSpy: jasmine.SpyObj<Router>;

  const mockProduct = {
    id: 1,
    title: 'Test Product',
    category: 'electronics',
    price: 199
  };

  beforeEach(async () => {
    apiServiceSpy = jasmine.createSpyObj('ApiService', [
      'getProductById',
      'getProduct',
      'getStoredProducts',
      'setProducts'
    ]);
    cartServiceSpy = jasmine.createSpyObj('CartService', ['addToCart']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [ProductDetailComponent],
      providers: [
        { provide: ApiService, useValue: apiServiceSpy },
        { provide: CartService, useValue: cartServiceSpy },
        { provide: Router, useValue: routerSpy },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: { paramMap: { get: () => '1' } }
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ProductDetailComponent);
    component = fixture.componentInstance;
    localStorage.setItem('selectedProduct', JSON.stringify(mockProduct));

  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

   
  it('should add product to cart', () => {
    component.addToCart(mockProduct);
    expect(cartServiceSpy.addToCart).toHaveBeenCalledWith(mockProduct);
  });

  it('should navigate to home on goToHome', () => {
    component.goToHome();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/home']);
  });

  it('should increment and decrement slide index', () => {
    component.similarProducts = new Array(12).fill({ id: 2, category: 'electronics' });

    component.nextSlide();
    expect(component.currentSlideIndex).toBe(1);

    component.prevSlide();
    expect(component.currentSlideIndex).toBe(0);
  });

  it('should remove selectedProduct from localStorage on destroy', () => {
    localStorage.setItem('selectedProduct', JSON.stringify(mockProduct));
    component.ngOnDestroy();
    expect(localStorage.getItem('selectedProduct')).toBeNull();
  });
});
