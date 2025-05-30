import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/shared/services/auth.service';
import { Product } from 'src/app/shared/services/product';
import { ProductService } from 'src/app/shared/services/product.service';

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

  // products:any = [
  //   { id: 1, name: 'iPhone 16 Pro 1TB Akıllı Telefon Natural Titanium MYNX3TU/A', description: 'iPhone 16 Pro 1TB Akıllı Telefon Natural Titanium MYNX3TU/A', price: '129.999', discountedPrice: '99.999', mainImage: 'https://assets.mmsrg.com/isr/166325/c1/-/ASSET_MMS_144721927?x=280&y=190&format=jpg&quality=80&sp=yes&strip=yes&trim&ex=280&ey=190&align=center&resizesource&unsharp=1.5x1+0.7+0.02&cox=0&coy=0&cdx=280&cdy=190'},
  //   { id: 2, name: 'GRUNDIG GDH 92 PKS A++ Enerji Sınıfı 9 kg Isı Pompalı Kurutma', description: 'GRUNDIG GDH 92 PKS A++ Enerji Sınıfı 9 kg Isı Pompalı Kurutma', price: '20.999', discountedPrice: '16.399', mainImage: 'https://assets.mmsrg.com/isr/166325/c1/-/ASSET_MMS_133515701?x=280&y=190&format=jpg&quality=80&sp=yes&strip=yes&trim&ex=280&ey=190&align=center&resizesource&unsharp=1.5x1+0.7+0.02&cox=0&coy=0&cdx=280&cdy=190'},
  //   { id: 3, name: 'LENOVO Tab 10.1 inç 4/128GB WUXGA Tablet + Kılıf ZAEH0039TR', description: 'LENOVO Tab 10.1 inç 4/128GB WUXGA Tablet + Kılıf ZAEH0039TR', price: '7.499', discountedPrice: '5.499', mainImage: 'https://assets.mmsrg.com/isr/166325/c1/-/ASSET_MMS_149860847?x=280&y=190&format=jpg&quality=80&sp=yes&strip=yes&trim&ex=280&ey=190&align=center&resizesource&unsharp=1.5x1+0.7+0.02&cox=0&coy=0&cdx=280&cdy=190'},
  //   { id: 4, name: 'APPLE MW0Y3TU/A/MacBook Air/Apple M4 İşlemci', description: 'APPLE MW0Y3TU/A/MacBook Air/Apple M4 İşlemci', price: '6.999', discountedPrice: '5.499', mainImage: 'https://assets.mmsrg.com/isr/166325/c1/-/ASSET_MMS_151160138?x=280&y=190&format=jpg&quality=80&sp=yes&strip=yes&trim&ex=280&ey=190&align=center&resizesource&unsharp=1.5x1+0.7+0.02&cox=0&coy=0&cdx=280&cdy=190'},
  //   { id: 5, name: 'WINIX Zero Compact Hava Temizleme Cihazı Siyah Beyaz', description: 'WINIX Zero Compact Hava Temizleme Cihazı Siyah Beyaz', price: '6.999', discountedPrice: '6.499', mainImage: 'https://assets.mmsrg.com/isr/166325/c1/-/ASSET_MMS_143826918?x=280&y=190&format=jpg&quality=80&sp=yes&strip=yes&trim&ex=280&ey=190&align=center&resizesource&unsharp=1.5x1+0.7+0.02&cox=0&coy=0&cdx=280&cdy=190'},
  // ];

  constructor(private authService: AuthService, private productService: ProductService) { }

  ngOnInit() {
    this.currentRole = this.authService.getCurrentRoles()
    this.currentUserId = this.authService.getCurrentUserId();
    console.log(this.currentRole)

    this.productService.getAllProducts().subscribe(
      (data: Product[]) => {
        this.products = data;
        this.filteredProducts = data;

        if (this.currentRole === 'Seller') {
          this.filteredProducts = this.products.filter(product => product.sellerUserId != this.currentUserId);
          this.sellerProducts = this.products.filter(product => product.sellerUserId == this.currentUserId);
          this.notSellerProducts = this.products.filter(product => product.sellerUserId != this.currentUserId);

          // this.filteredProducts = this.products.sort((a, b) => {
          //   const aIsCurrentUser = a.sellerUserId === this.currentUserId ? 0 : 1;
          //   const bIsCurrentUser = b.sellerUserId === this.currentUserId ? 0 : 1;
          //   return aIsCurrentUser - bIsCurrentUser;
          // });
          // this.filteredProducts = this.products.sort((a, b) => {
          //   return a.sellerUserId - b.sellerUserId;
          // });
          this.notSellerProducts.forEach(product => {
            if (!this.cities.includes(product.city)) {
              this.cities.push(product.city);
            }
          })
        } else {
          data.forEach(product => {
            if (!this.cities.includes(product.city)) {
              this.cities.push(product.city);
            }
          })
        }
      },
      error => {
      }
    );
  }

  updateFilter(e: any) {
    console.log(e.target.value)
    let selectedValue = e.target.value;
    if (selectedValue === 'all') {
      //Dont show seller products
      // this.filteredProducts = this.products.filter(product => product.sellerUserId != this.currentUserId);
      // this.filteredProducts = this.products;
      this.filteredProducts = this.notSellerProducts;
    } else {
      //Dont show seller products
      // this.filteredProducts = this.products.filter(product => product.sellerUserId != this.currentUserId && product.city === selectedValue);
      // this.filteredProducts = this.products.filter(p => p.city === selectedValue);
      this.filteredProducts = this.notSellerProducts.filter(p => p.city === selectedValue);
    }
  }

  logout() {
  }

}
