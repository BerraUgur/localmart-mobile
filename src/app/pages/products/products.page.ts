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
    this.logger.info('ProductsPage initialized');
  }

  ngOnInit() {
    this.currentRole = this.authService.getCurrentRoles();
    this.currentUserId = this.authService.getCurrentUserId();
    this.logger.info('ProductsPage ngOnInit', { currentRole: this.currentRole, currentUserId: this.currentUserId });
    this.productService.getAllProducts().subscribe({
      next: (data: Product[]) => {
        this.products = data;
        this.filteredProducts = data;
        this.logger.info('Products fetched successfully', data);
        if (this.currentRole === 'Seller') {
          this.filteredProducts = this.products.filter(product => product.sellerUserId !== this.currentUserId);
          this.sellerProducts = this.products.filter(product => product.sellerUserId === this.currentUserId);
          this.notSellerProducts = this.products.filter(product => product.sellerUserId !== this.currentUserId);
          this.notSellerProducts.forEach(product => {
            if (product.city && !this.cities.includes(product.city)) {
              this.cities.push(product.city);
            }
          });
        } else {
          data.forEach(product => {
            if (product.city && !this.cities.includes(product.city)) {
              this.cities.push(product.city);
            }
          });
        }
      },
      error: (err) => {
        this.logger.error('Failed to fetch products', err);
      }
    });
  }

  updateFilter(event: any) {
    const selectedValue = event.target.value;
    if (selectedValue === 'all') {
      this.filteredProducts = this.notSellerProducts;
    } else {
      this.filteredProducts = this.notSellerProducts.filter(p => p.city === selectedValue);
    }
  }

  // Add logout logic if needed
  logout() { }
}