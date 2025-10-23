import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { LoggerService } from 'src/app/services/logger.service';
import { Product } from 'src/app/models/product';
import { ProductService } from 'src/app/services/product.service';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-product-update',
  templateUrl: './product-update.page.html',
  styleUrls: ['./product-update.page.scss'],
})
export class ProductUpdatePage implements OnInit {
  productForm: FormGroup;
  productId?: number;

  mainImage: any = '';
  imagesArr: string[] | any = [];

  currentUserId?: number;

  isNewMainImg = false
  isNewOtherImg = false

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private productService: ProductService,
    private authService: AuthService,
    private alertController: AlertController,
    private logger: LoggerService
  ) {
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      sellerUserId: [''],
      price: [0],
      discountedPrice: [0, Validators.required],
      stock: [null, Validators.required],
      description: ['', Validators.required],
      city: ['', Validators.required],
      district: ['', Validators.required],
      mainImage: [''],
      images: this.fb.array(['', '', '', '', '', '', ''])
    });
  }

  ngOnInit() {
    this.productId = +this.route.snapshot.paramMap.get('id')!;
    this.productService.getProductById(this.productId).subscribe(
      (product: Product | null) => {
        if (product) {
          this.logger.info('Product loaded', product);
          this.mainImage = product.mainImage;
          this.imagesArr = product.images;
          this.productForm.patchValue(product);
        }
      },
      error => {
        this.logger.error('Error fetching product details', error);
      }
    );
    this.currentUserId = this.authService.getCurrentUserId();

  }

  onMainImageSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.convertToBase64(file).then(base64 => {
        this.isNewMainImg = true;
        this.productForm.patchValue({ mainImage: base64 });
        this.mainImage = base64;
        this.logger.info('Main image selected', { fileName: file.name });
      });
    }
  }

  onImagesSelected(event: any) {
    const files = event.target.files;
    const newImages: any = [];
    this.imagesArr = [];
    this.isNewOtherImg = true
    for (let i = 0; i < files.length; i++) {
      this.convertToBase64(files[i]).then(base64 => {
        newImages.push(base64);
        this.imagesArr.push(base64);
        this.logger.info('Other image selected', { fileName: files[i].name });
      });
    }
    setTimeout(() => {
      this.productForm.patchValue({ images: newImages });
      this.logger.debug('Images array updated', newImages);
    }, 100);
  }

  convertToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  }

  updateProduct() {
    const controls = this.productForm.controls;
    if (
      !controls['name'].value ||
      controls['price'].value === null ||
      controls['discountedPrice'].value === null ||
      controls['stock'].value === null ||
      !controls['description'].value ||
      !controls['city'].value ||
      !controls['district'].value ||
      !controls['mainImage'].value ||
      !controls['images'].value ||
      (Array.isArray(controls['images'].value) && controls['images'].value.length === 0)
    ) {
      this.alertController.create({
        header: 'Warning',
        message: 'Please fill in all fields.',
        buttons: ['OK']
      }).then(alert => alert.present());
      return;
    }
    if (this.productForm.valid) {
      this.productForm.value.id = this.productId;
      this.productService.updateProduct(this.productId!, this.productForm.value).subscribe(
        async response => {
          this.logger.info('Product updated successfully', response);
          const succesAlert = await this.alertController.create({
            header: 'Success!',
            message: 'Product updated successfully.',
            buttons: ['OK']
          });
          await succesAlert.present();
          this.router.navigate(['/products']).then(() => {
            setTimeout(() => {
              location.reload();
            }, 1000);
          });
        },
        error => {
          this.logger.error('Error updating product', error);
        }
      );
    }
  }

  clickNextInput(event: MouseEvent) {
    const parent = event.currentTarget as HTMLElement;
    const input = parent.querySelector('input[type="file"]') as HTMLElement;
    input?.click();
  }
}
