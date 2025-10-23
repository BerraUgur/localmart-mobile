import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { AddressService } from 'src/app/services/address.service';
import { AuthService } from 'src/app/services/auth.service';
import { User } from 'src/app/models/comment';
import { Mail } from 'src/app/models/mail';
import { MailService } from 'src/app/services/mail.service';
import { Order } from 'src/app/models/order';
import { OrdersService } from 'src/app/services/orders.service';
import { Product } from 'src/app/models/product';
import { ProductService } from 'src/app/services/product.service';
import { LoggerService } from 'src/app/services/logger.service';

@Component({
  selector: 'app-basket',
  templateUrl: './basket.page.html',
  styleUrls: ['./basket.page.scss'],
})
export class BasketPage implements OnInit {
  products: any = []
  currentBasket: any = [];
  currentUserId?: number;
  currentUser?: User;
  city: any = '';
  district: any = '';
  postalCode: any = '';
  openAddress: any = '';
  note: any = '';

  constructor(
    private alertController: AlertController,
    private productService: ProductService,
    private addressService: AddressService,
    private ordersService: OrdersService,
    private authService: AuthService,
    private mailService: MailService,
    private logger: LoggerService
  ) { }

  ngOnInit() {
    if (localStorage.getItem('basket')) {
      this.currentBasket = JSON.parse((<any>localStorage.getItem('basket')));
      this.logger.info('Basket loaded from localStorage', this.currentBasket);
    }
    if (this.currentBasket) {
      this.currentBasket.forEach((product: any) => {
        this.productService.getProductById(product.productId).subscribe((product: Product | null) => {
          if (product) {
            this.authService.getUser(product.sellerUserId).subscribe((user) => {
              product.sellerPhone = user.phoneNumber;
              this.products.push(product);
              this.logger.info('Product loaded for basket', product);
            });
          } else {
            this.logger.error('Product not found', { productId: product && 'productId' in product ? (product as any).productId : undefined });
          }
        },
          error => {
            this.logger.error('Error fetching product details', error);
          }
        );
      });
      this.currentUserId = this.authService.getCurrentUserId();
      this.authService.getUser(this.currentUserId).subscribe((user) => {
        this.currentUser = user;
        this.logger.info('Current user loaded', user);
      });
    }
  }

  get totalPrice() {
    return this.products.reduce((sum, product) => sum + product.discountedPrice, 0).toFixed(2);
  }

  async deleteProductBasket(productId: number) {
    const alert = await this.alertController.create({
      header: 'Are you sure?',
      message: 'Do you want to remove this product from your basket?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Yes',
          handler: () => {
            this.products = this.products.filter((p: any) => p.id != productId);
            let newBasket: any = [];
            this.products.forEach(p => {
              newBasket.push({ productId: p.id, quantity: 1 });
            });
            this.currentBasket = newBasket;
            localStorage.setItem('basket', JSON.stringify(newBasket));
            this.alertController.create({
              header: 'Success!',
              message: 'Product removed from your basket.',
              buttons: ['OK']
            }).then(successAlert => successAlert.present());
          }
        }
      ]
    });
    await alert.present();
  }

  approveBasket() {
    if (this.city == '' || this.district == '' || this.postalCode == '' || this.openAddress == '') {
      this.alertController.create({
        header: 'Missing Information!',
        message: 'Please fill in the address information.',
        buttons: ['OK']
      }).then(errorAlert => errorAlert.present());
      return;
    } else {
      const addressRequest: any = {
        city: this.city,
        userId: this.currentUserId,
        district: this.district,
        postalCode: this.postalCode,
        openAddress: this.openAddress,
      };
  this.logger.info('Address request', addressRequest);
      this.addressService.addAddress(addressRequest).subscribe(
        data => {
          let order: Order = {
            userId: this.currentUserId,
            addressId: data.id,
            note: this.note,
            orderItems: this.currentBasket
          }
          this.ordersService.addOrder(order).subscribe(data => {
            let products = `
              <table style="width: 100%; border: 1px solid #000; border-collapse: collapse;">
                <thead>
                  <tr>
                    <th style="padding: 8px; text-align: left;">Product Name</th>
                    <th style="padding: 8px; text-align: left;">Price</th>
                  </tr>
                </thead>
                <tbody>
                  ${this.currentBasket.map((basketItem: any) => {
              const product = this.products.find((product: any) => product.id == basketItem.productId);
              return `
                      <tr>
                        <td style="padding: 8px;">${product?.name}</td>
                        <td style="padding: 8px;">${product?.discountedPrice} TL</td>
                      </tr>
                    `;
            }).join('')}
                  <tr>
                    <td colspan="2" style="padding: 8px; text-align: right; font-weight: bold;">Total Price: ${this.totalPrice} TL</td>
                  </tr>
                </tbody>
              </table>
              <br/>
              <b>Address Information:</b><br/>
              <table style="width: 100%; border: 1px solid #000; border-collapse: collapse; margin-top: 10px;">
                <tr>
                  <td style="padding: 8px; font-weight: bold;">City:</td>
                  <td style="padding: 8px;">${this.city}</td>
                </tr>
                <tr>
                  <td style="padding: 8px; font-weight: bold;">District:</td>
                  <td style="padding: 8px;">${this.district}</td>
                </tr>
                <tr>
                  <td style="padding: 8px; font-weight: bold;">Address:</td>
                  <td style="padding: 8px;">${this.openAddress}</td>
                </tr>
                <tr>
                  <td style="padding: 8px; font-weight: bold;">Postal Code:</td>
                  <td style="padding: 8px;">${this.postalCode}</td>
                </tr>
              </table>
              <br/>
              <b>Note:</b> ${this.note}<br/><br/>
              You will be informed about the status of your order.<br/><br/>
              Localmart Team
            `;

            let mail: Mail = {
              to: this.currentUser?.email,
              subject: 'Localmart | Your Basket Has Been Approved.',
              body: products
            }
            this.mailService.sendMail(mail).subscribe(
              (response) => { this.logger.info('Mail sent successfully', response); },
              (error) => { this.logger.error('Error sending mail', error); }
            );

            // Send an e-mail to the owner of the products in the basket
            this.products.forEach((product: any) => {
              this.authService.getUser(product.sellerUserId).subscribe((user) => {
                let newTotalPrice: number = 0;
                let products = `
                  <table style="width: 100%; border: 1px solid #000; border-collapse: collapse;">
                    <thead>
                      <tr>
                        <th style="padding: 8px; text-align: left;">Product Name</th>
                        <th style="padding: 8px; text-align: left;">Price</th>
                      </tr>
                    </thead>
                    <tbody>
                      ${this.currentBasket.map((basketItem: any) => {
                  const product = this.products.find((product: any) => product.id == basketItem.productId);
                  if (product.sellerUserId != user.id) {
                    return '';
                  }
                  newTotalPrice += Number(product.discountedPrice);
                  return `
                          <tr>
                            <td style="padding: 8px;">${product?.name}</td>
                            <td style="padding: 8px;">${product?.discountedPrice} TL</td>
                          </tr>
                        `;
                }).join('')}
                      <tr>
                        <td colspan="2" style="padding: 8px; text-align: right; font-weight: bold;">Total Price: ${newTotalPrice.toFixed(2)} TL</td>
                      </tr>
                    </tbody>
                  </table>
                  <br/>
                  <b>Address Information:</b><br/>
                  <table style="width: 100%; border: 1px solid #000; border-collapse: collapse; margin-top: 10px;">
                    <tr>
                      <td style="padding: 8px; font-weight: bold;">City:</td>
                      <td style="padding: 8px;">${this.city}</td>
                    </tr>
                    <tr>
                      <td style="padding: 8px; font-weight: bold;">District:</td>
                      <td style="padding: 8px;">${this.district}</td>
                    </tr>
                    <tr>
                      <td style="padding: 8px; font-weight: bold;">Address:</td>
                      <td style="padding: 8px;">${this.openAddress}</td>
                    </tr>
                    <tr>
                      <td style="padding: 8px; font-weight: bold;">Postal Code:</td>
                      <td style="padding: 8px;">${this.postalCode}</td>
                    </tr>
                  </table>
                  <br/>
                  Your order has been received successfully. Please ship as soon as possible.<br/><br/>
                  Localmart Team
                `;

                let mail_seller: Mail = {
                  to: user.email,
                  subject: 'Localmart | Your Order Has Been Approved.',
                  body: products
                }
                this.mailService.sendMail(mail_seller).subscribe();
              })
            })

            this.alertController.create({
              header: 'Success!',
              message: 'Your order has been approved.',
              buttons: ['OK']
            }).then(successAlert => successAlert.present());
          })
        },
        error => {
          console.error('Address save failed', error);
        }
      );
    }
  }
}
