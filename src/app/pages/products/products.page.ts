import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { LoggerService } from 'src/app/services/logger.service';
import { Product } from 'src/app/models/product';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.page.html',
  styleUrls: ['./products.page.scss'],

})
export class productsPage implements OnInit {
  currentRole: any = 1;
  currentUserId?: number;
  products: Product[] = [];
  filteredProducts: Product[] = [];
  sellerProducts: Product[] = [];
  notSellerProducts: Product[] = [];
  noProducts: boolean = false;

  cities: any = []

  constructor(private authService: AuthService, private productService: ProductService, private logger: LoggerService) {
    this.logger.logInfo('ProductsPage initialized');
  }

  ngOnInit() {
    this.currentRole = this.authService.getCurrentRoles();
    this.currentUserId = this.authService.getCurrentUserId();
    this.logger.logInfo('ProductsPage ngOnInit', { currentRole: this.currentRole, currentUserId: this.currentUserId });
    this.productService.getAllProducts().subscribe({
      next: (response: any) => {
        const products = Array.isArray(response?.data) ? response.data : [];
        this.products = products;
        this.filteredProducts = this.products;
        this.logger.logInfo('Products fetched successfully', products);
        // Build seller/non-seller lists in a consistent way so counts are correct
        this.sellerProducts = this.products.filter(product => product.sellerUserId == this.currentUserId);
        this.notSellerProducts = this.products.filter(product => product.sellerUserId != this.currentUserId);

        // Default filtered view should show not-seller products (others)
        this.filteredProducts = this.notSellerProducts.slice();

        // Build cities list from notSellerProducts (the list the user can filter)
        this.cities = [];
        this.notSellerProducts.forEach(product => {
          if (product?.city && !this.cities.includes(product.city)) {
            this.cities.push(product.city);
          }
        });

        // If current user is not a seller, show all products instead
        if (this.currentRole !== 'Seller') {
          this.filteredProducts = this.products.slice();
          // ensure cities include all product cities
          this.cities = [];
          this.products.forEach(product => {
            if (product?.city && !this.cities.includes(product.city)) {
              this.cities.push(product.city);
            }
          });
        }
      },
      error: (err) => {
        this.logger.logError('Failed to fetch products', err);
      }
    });
  }

  updateFilter(event: any) {
    // Ionic ionChange provides value at event.detail.value; fall back to target.value
    const selectedValue = event?.detail?.value ?? event?.target?.value ?? event;
    if (selectedValue === 'all') {
      this.filteredProducts = (this.currentRole === 'Seller') ? this.notSellerProducts.slice() : this.products.slice();
    } else {
      this.filteredProducts = (this.currentRole === 'Seller') ? this.notSellerProducts.filter(p => p.city === selectedValue) : this.products.filter(p => p.city === selectedValue);
    }
  }

  // Add logout logic if needed
  logout() { }
}