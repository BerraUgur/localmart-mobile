import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProductService } from 'src/app/shared/services/product.service';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-product-add',
  templateUrl: './product-add.page.html',
  styleUrls: ['./product-add.page.scss'],
})
export class ProductAddPage implements OnInit {

  mainImage: string | null = null;
  images: string[] = [];
  name: string = '';
  price: number | null = null;
  discountedPrice: number | null = null;
  stock: number | null = null;
  description: string = '';
  city: string = '';
  district: string = '';

  singleImageBase64: string | undefined;
  multipleImagesBase64: string[] = [];

  constructor(private productService: ProductService, private router: Router, private alertController: AlertController) { }

  ngOnInit() { }

  onSingleFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.convertToBase64(file).then(
        (base64: string) => {
          this.singleImageBase64 = base64;
        }
      );
    }
  }

  onMultipleFilesSelected(event: any): void {
    const files = event.target.files;
    if (files.length > 0) {
      this.multipleImagesBase64 = []; // Reset previous images
      Array.from(files).forEach((file: any) => {
        this.convertToBase64(file).then(
          (base64: string) => {
            this.multipleImagesBase64.push(base64);
          }
        );
      });
    }
  }

  private convertToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        resolve(reader.result as string);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  saveProduct() {
    if (!this.name || this.price === null || this.discountedPrice === null || this.stock === null || !this.description || !this.city || !this.district || !this.singleImageBase64 || this.multipleImagesBase64.length === 0) {
      this.alertController.create({
        header: 'Uyarı',
        message: 'Lütfen tüm alanları doldurunuz.',
        buttons: ['Tamam']
      }).then(alert => alert.present());
      return;
    }

    const productRequest: any = {
      mainImage: this.singleImageBase64,
      images: this.multipleImagesBase64,
      name: this.name,
      price: this.price,
      discountedPrice: this.discountedPrice,
      stock: this.stock,
      description: this.description,
      city: this.city,
      district: this.district
    }

    console.log('Product request', productRequest);
    this.productService.createProduct(productRequest).subscribe(
      async data => {
        console.log('Product saved successfully', data);
        const succesAlert = await this.alertController.create({
          header: 'Başarılı!',
          message: 'Ürün başarıyla kaydedildi.',
          buttons: ['Tamam']
        });
        await succesAlert.present();
        this.router.navigate(['/products']).then(() => {
          setTimeout(() => {
            location.reload();
          }, 1000);
        });
      },
      error => {
        console.error('Product save failed', error);
      }
    );
  }

  clickNextInput(event: MouseEvent) {
    const parent = event.currentTarget as HTMLElement;
    const input = parent.querySelector('input[type="file"]') as HTMLElement;
    input?.click();
  }

}
