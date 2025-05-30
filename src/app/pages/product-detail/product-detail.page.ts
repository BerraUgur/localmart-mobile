import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/shared/services/auth.service';
import { CustomComment } from 'src/app/shared/services/comment';
import { CommentService } from 'src/app/shared/services/comment.service';
import { Product } from 'src/app/shared/services/product';
import { ProductService } from 'src/app/shared/services/product.service';

import Swiper from 'swiper';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.page.html',
  styleUrls: ['./product-detail.page.scss'],

})
export class productDetailPage implements OnInit, AfterViewInit {
  product: Product | null = null;
  comments?: CustomComment[] = [];
  comment?: string;

  currentRole: any = 1;
  isLogging = false;
  currentUserId?: number;
  seller?: any;

  currentBasket: any = [];

  productMainImgs?: Swiper | any;
  productOtherImgs?: Swiper | any;

  // products:any = [
  //   { id: 1, name: 'iPhone 16 Pro 1TB Akıllı Telefon Natural Titanium MYNX3TU/A', description: 'iPhone 16 Pro 1TB Akıllı Telefon Natural Titanium MYNX3TU/A', price: '129.999', discountedPrice: '99.999', mainImage: 'https://assets.mmsrg.com/isr/166325/c1/-/ASSET_MMS_144721927?x=280&y=190&format=jpg&quality=80&sp=yes&strip=yes&trim&ex=280&ey=190&align=center&resizesource&unsharp=1.5x1+0.7+0.02&cox=0&coy=0&cdx=280&cdy=190'},
  //   { id: 2, name: 'GRUNDIG GDH 92 PKS A++ Enerji Sınıfı 9 kg Isı Pompalı Kurutma', description: 'GRUNDIG GDH 92 PKS A++ Enerji Sınıfı 9 kg Isı Pompalı Kurutma', price: '20.999', discountedPrice: '16.399', mainImage: 'https://assets.mmsrg.com/isr/166325/c1/-/ASSET_MMS_133515701?x=280&y=190&format=jpg&quality=80&sp=yes&strip=yes&trim&ex=280&ey=190&align=center&resizesource&unsharp=1.5x1+0.7+0.02&cox=0&coy=0&cdx=280&cdy=190'},
  //   { id: 3, name: 'LENOVO Tab 10.1 inç 4/128GB WUXGA Tablet + Kılıf ZAEH0039TR', description: 'LENOVO Tab 10.1 inç 4/128GB WUXGA Tablet + Kılıf ZAEH0039TR', price: '7.499', discountedPrice: '5.499', mainImage: 'https://assets.mmsrg.com/isr/166325/c1/-/ASSET_MMS_149860847?x=280&y=190&format=jpg&quality=80&sp=yes&strip=yes&trim&ex=280&ey=190&align=center&resizesource&unsharp=1.5x1+0.7+0.02&cox=0&coy=0&cdx=280&cdy=190'},
  //   { id: 4, name: 'APPLE MW0Y3TU/A/MacBook Air/Apple M4 İşlemci', description: 'APPLE MW0Y3TU/A/MacBook Air/Apple M4 İşlemci', price: '6.999', discountedPrice: '5.499', mainImage: 'https://assets.mmsrg.com/isr/166325/c1/-/ASSET_MMS_151160138?x=280&y=190&format=jpg&quality=80&sp=yes&strip=yes&trim&ex=280&ey=190&align=center&resizesource&unsharp=1.5x1+0.7+0.02&cox=0&coy=0&cdx=280&cdy=190'},
  //   { id: 5, name: 'WINIX Zero Compact Hava Temizleme Cihazı Siyah Beyaz', description: 'WINIX Zero Compact Hava Temizleme Cihazı Siyah Beyaz', price: '6.999', discountedPrice: '6.499', mainImage: 'https://assets.mmsrg.com/isr/166325/c1/-/ASSET_MMS_143826918?x=280&y=190&format=jpg&quality=80&sp=yes&strip=yes&trim&ex=280&ey=190&align=center&resizesource&unsharp=1.5x1+0.7+0.02&cox=0&coy=0&cdx=280&cdy=190'},
  // ];

  // product:any = {} 
  // product:any = { 
  //   name: 'iPhone 16 Pro 1TB Akıllı Telefon Natural Titanium MYNX3TU/A',
  //   description: 'iPhone 16 Pro 1TB Akıllı Telefon Natural Titanium MYNX3TU/A',
  //   price: '129.999',
  //   discountedPrice: '99.999',
  //   mainImage: 'https://assets.mmsrg.com/isr/166325/c1/-/ASSET_MMS_144721927?x=280&y=190&format=jpg&quality=80&sp=yes&strip=yes&trim&ex=280&ey=190&align=center&resizesource&unsharp=1.5x1+0.7+0.02&cox=0&coy=0&cdx=280&cdy=190'
  // }

  constructor(
    private route: ActivatedRoute,
    private alertController: AlertController,
    private router: Router,
    private productService: ProductService,
    private commentService: CommentService,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.isLogging = this.authService.loggedIn()
    this.currentRole = this.authService.getCurrentRoles()

    const productId = +this.route.snapshot.paramMap.get('id')!;
    this.productService.getProductById(productId).subscribe(
      (product: Product | null) => {
        if (product) {
          this.product = product;
          this.comments = product.comments;
          console.log('Product fetched successfully', product);

          this.authService.getUser(product.sellerUserId).subscribe((user) => {
            this.seller = user
            console.log("this.seller => ", this.seller)
          })

          this.initializeSwipers();
        } else {
          console.error('Product not found');
        }
      },
      error => {
        console.error('Error fetching product details', error);
      }
    );

    this.currentUserId = this.authService.getCurrentUserId();

    if (localStorage.getItem('basket')) {
      this.currentBasket = JSON.parse((<any>localStorage.getItem('basket')));
    }
  }

  logout() {
  }

  async addToCart(productId: number | any) {
    if (!this.isLogging) {
      const alert = await this.alertController.create({
        header: 'Uyarı!',
        message: 'Sepete eklemek için giriş yapmalısınız.',
        buttons: [
          {
            text: 'İptal',
            role: 'cancel'
          },
          {
            text: 'Giriş Yap',
            handler: () => {
              this.router.navigate(['/login']);
            }
          }
        ]
      });
      await alert.present();
      return;
    }

    if (this.currentRole == "Admin") {
      const warningAlert = await this.alertController.create({
        header: 'Uyarı!',
        message: 'Admin kullanıcılar sepete ürün ekleyemez.',
        buttons: ['Tamam']
      });
      await warningAlert.present();
      return;
    }

    for (let i = 0; i < this.currentBasket.length; i++) {
      if (this.currentBasket[i].productId === productId) {
        const warningAlert = await this.alertController.create({
          header: 'Uyarı!',
          message: 'Ürün sepetinizde zaten mevcut.',
          buttons: ['Tamam']
        });
        await warningAlert.present();
        return;
      }
    }

    if (this.currentUserId == this.product?.sellerUserId) {
      this.alertController.create({
        header: 'Uyarı!',
        message: 'Kendi ürününüzü sepete ekleyemezsiniz.',
        buttons: ['Tamam']
      }).then(successAlert => successAlert.present());
      return
    }

    this.currentBasket.push({
      productId: productId,
      quantity: 1
    });

    localStorage.setItem('basket', JSON.stringify(this.currentBasket));

    const successAlert = await this.alertController.create({
      header: 'Başarılı!',
      message: 'Ürün sepete eklendi.',
      buttons: ['Tamam']
    });
    await successAlert.present();
  }


  addComment() {
    if (this.product) {
      // let currentUser: User | any;
      // this.authService.getUser(this.authService.getCurrentUserId()).subscribe(
      //   (data: User) => {
      //     currentUser = data;
      //   },
      //   error => {
      //     console.error('Cant find user', error);
      //   }
      // );
      // console.log(currentUser)

      const newComment: CustomComment = {
        content: this.comment, productId: this.product.id, userId: this.authService.getCurrentUserId(),
      };
      this.commentService.addComment(newComment).subscribe(
        (data: CustomComment) => {
          location.reload();
          this.comments?.push(data);
          console.log('Comment added successfully', data);
        },
        error => {
          console.error('Error adding comment', error);
        }
      );
    }
  }

  deleteComment(commentId: number) {
    this.commentService.deleteComment(commentId).subscribe(
      () => {
        this.comments = this.comments?.filter(comment => comment.id !== commentId);
      },
      error => {
        console.error('Error deleting comment:', error);
      }
    );
  }

  async deleteProduct(productId: any) {
    const alert = await this.alertController.create({
      header: 'Emin misiniz?',
      message: 'Bu ürünü silmek istediğinize emin misiniz?',
      buttons: [
        {
          text: 'İptal',
          role: 'cancel'
        },
        {
          text: 'Evet',
          handler: () => {
            this.productService.deleteProduct(productId).subscribe(
              () => {
                this.alertController.create({
                  header: 'Başarılı!',
                  message: `Ürünü başarıyla silinmiştir.`,
                  buttons: ['Tamam']
                }).then(successAlert => {
                  successAlert.present()
                  this.router.navigate(['/products']).then(() => {
                    setTimeout(() => {
                      location.reload();
                    }, 1000);
                  });
                });
              },
              error => {
                console.error('Error deleting user:', error);
              }
            );
          }
        }
      ]
    });

    await alert.present();
  }

  capitalizeFirstLetter(value: string | undefined): string {
    if (!value) return '';
    return value.charAt(0).toUpperCase();
  }

  ngAfterViewInit(): void {
    this.initializeSwipers();
  }

  initializeSwipers(): void {
    this.productMainImgs = new Swiper('.product-main-imgs', {
      slidesPerView: 1,
      on: {
        slideChange: () => {
          const activeIndex = this.productMainImgs.activeIndex;
          // console.log('Active index:', activeIndex);
          this.productOtherImgs.slideTo(activeIndex);
          this.updateThumbnailActiveClass(activeIndex);
        }
      }
    });

    this.productOtherImgs = new Swiper('.product-other-imgs', {
      slidesPerView: 2.5,
      spaceBetween: 10,
      breakpoints: {
        668: {
          slidesPerView: 3
        },
        1024: {
          slidesPerView: 4
        }
      }
    });

    // Attach click event listeners
    setTimeout(() => {
      document.querySelectorAll('.product-other-imgs .swiper-slide').forEach((slide, index) => {
        slide.addEventListener('click', () => {
          this.productMainImgs.slideTo(index);
          this.updateThumbnailActiveClass(index);
        });
      });
    }, 100);
  }

  updateThumbnailActiveClass(activeIndex: number): void {
    document.querySelectorAll('.product-other-imgs .swiper-slide').forEach((slide, index) => {
      slide.classList.toggle('active', index === activeIndex);
    });
  }

}
