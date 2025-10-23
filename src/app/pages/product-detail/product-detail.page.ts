import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';
import { LoggerService } from 'src/app/services/logger.service';
import { CustomComment } from 'src/app/models/comment';
import { CommentService } from 'src/app/services/comment.service';
import { Product } from 'src/app/models/product';
import { ProductService } from 'src/app/services/product.service';
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

  constructor(
    private route: ActivatedRoute,
    private alertController: AlertController,
    private router: Router,
    private productService: ProductService,
    private commentService: CommentService,
    private authService: AuthService,
    private logger: LoggerService
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
          this.logger.info('Product loaded', product);
          this.authService.getUser(product.sellerUserId).subscribe((user) => {
            this.seller = user;
            this.logger.info('Seller loaded', user);
          });
          this.initializeSwipers();
        } else {
          this.logger.error('Product not found', { productId });
        }
      },
      error => {
        this.logger.error('Error fetching product details', error);
      }
    );

    this.currentUserId = this.authService.getCurrentUserId();

    if (localStorage.getItem('basket')) {
      this.currentBasket = JSON.parse((<any>localStorage.getItem('basket')));
    }
  }

  async addToCart(productId: number | any) {
    if (!this.isLogging) {
      const alert = await this.alertController.create({
        header: 'Warning!',
        message: 'You must be logged in to add to basket.',
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel'
          },
          {
            text: 'Login',
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
        header: 'Warning!',
        message: 'Admin users cannot add products to basket.',
        buttons: ['OK']
      });
      await warningAlert.present();
      return;
    }

    for (let i = 0; i < this.currentBasket.length; i++) {
      if (this.currentBasket[i].productId === productId) {
        const warningAlert = await this.alertController.create({
          header: 'Warning!',
          message: 'Product is already in your basket.',
          buttons: ['OK']
        });
        await warningAlert.present();
        return;
      }
    }

    if (this.currentUserId == this.product?.sellerUserId) {
      this.alertController.create({
        header: 'Warning!',
        message: 'You cannot add your own product to basket.',
        buttons: ['OK']
      }).then(successAlert => successAlert.present());
      return;
    }

    this.currentBasket.push({
      productId: productId,
      quantity: 1
    });

    localStorage.setItem('basket', JSON.stringify(this.currentBasket));

    const successAlert = await this.alertController.create({
      header: 'Success!',
      message: 'Product added to basket.',
      buttons: ['OK']
    });
    await successAlert.present();
  }

  addComment() {
    if (this.product) {
      const newComment: CustomComment = {
        content: this.comment, productId: this.product.id, userId: this.authService.getCurrentUserId(),
      };
      this.commentService.addComment(newComment).subscribe(
        (data: CustomComment) => {
          location.reload();
          this.comments?.push(data);
          this.logger.info('Comment added successfully', data);
        },
        error => {
          this.logger.error('Error adding comment', error);
        }
      );
    }
  }

  deleteComment(commentId: number) {
    this.commentService.deleteComment(commentId).subscribe(
      () => {
        this.comments = this.comments?.filter(comment => comment.id !== commentId);
        this.logger.info('Comment deleted', { commentId });
      },
      error => {
        this.logger.error('Error deleting comment', error);
      }
    );
  }

  async deleteProduct(productId: any) {
    const alert = await this.alertController.create({
      header: 'Are you sure?',
      message: 'Are you sure you want to delete this product?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Yes',
          handler: () => {
            this.productService.deleteProduct(productId).subscribe(
              () => {
                this.logger.info('Product deleted', { productId });
                this.alertController.create({
                  header: 'Success!',
                  message: `Product deleted successfully.`,
                  buttons: ['OK']
                }).then(successAlert => {
                  successAlert.present();
                  this.router.navigate(['/products']).then(() => {
                    setTimeout(() => {
                      location.reload();
                    }, 1000);
                  });
                });
              },
              error => {
                this.logger.error('Error deleting product', error);
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
