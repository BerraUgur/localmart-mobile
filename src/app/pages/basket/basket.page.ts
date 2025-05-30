import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { AddressService } from 'src/app/shared/services/address.service';
import { AuthService } from 'src/app/shared/services/auth.service';
import { User } from 'src/app/shared/services/comment';
import { Mail } from 'src/app/shared/services/mail';
import { MailService } from 'src/app/shared/services/mail.service';
import { Order } from 'src/app/shared/services/order';
import { OrdersService } from 'src/app/shared/services/orders.service';
import { Product } from 'src/app/shared/services/product';
import { ProductService } from 'src/app/shared/services/product.service';

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
    private router: Router,
    private productService: ProductService,
    private addressService: AddressService,
    private ordersService: OrdersService,
    private authService: AuthService,
    private mailService: MailService,
  ) { }

  ngOnInit() {
    if (localStorage.getItem('basket')) {
      this.currentBasket = JSON.parse((<any>localStorage.getItem('basket')));
    }

    if (this.currentBasket) {
      this.currentBasket.forEach((product: any) => {
        this.productService.getProductById(product.productId).subscribe((product: Product | null) => {
          if (product) {
            this.authService.getUser(product.sellerUserId).subscribe((user) => {
              product.sellerPhone = user.phoneNumber;
              this.products.push(product);
              // this.updateTotalPrice()
            })

          } else {
            console.error('Product not found');
          }
        },
          error => {
            console.error('Error fetching product details', error);
          }
        );
      });

      this.currentUserId = this.authService.getCurrentUserId();
      this.authService.getUser(this.currentUserId).subscribe((user) => {
        this.currentUser = user
        console.log(this.currentUser)

        console.log("this.currentUser?.email ==>", this.currentUser?.email)
      });
    }

  }

  get totalPrice() {
    return this.products.reduce((sum, product) => sum + product.discountedPrice, 0).toFixed(2);
  }

  async deleteProductBasket(productId: number) {
    const alert = await this.alertController.create({
      header: 'Emin misiniz?',
      message: 'Bu ürünü sepetinizden silmek istiyor musunuz?',
      buttons: [
        {
          text: 'İptal',
          role: 'cancel'
        },
        {
          text: 'Evet',
          handler: () => {
            this.products = this.products.filter((p: any) => p.id != productId);

            let newBasket: any = [];
            this.products.forEach(p => {
              newBasket.push({ productId: p.id, quantity: 1 });
            });

            this.currentBasket = newBasket;
            localStorage.setItem('basket', JSON.stringify(newBasket));

            // Silme işlemi başarılı bildirimi
            this.alertController.create({
              header: 'Başarılı!',
              message: 'Ürün sepetinizden silindi.',
              buttons: ['Tamam']
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
        header: 'Eksik Bilgi!',
        message: 'Lütfen Adres Bilgilerini Doldurunuz.',
        buttons: ['Tamam']
      }).then(errorAlert => errorAlert.present());
      return
    } else {
      const addressRequest: any = {
        city: this.city,
        userId: this.currentUserId,
        district: this.district,
        postalCode: this.postalCode,
        openAddress: this.openAddress,
      };
      console.log('Address request', addressRequest);
      this.addressService.addAddress(addressRequest).subscribe(
        data => {
          let order: Order = {
            userId: this.currentUserId,
            addressId: data.id,
            note: this.note,
            orderItems: this.currentBasket
          }
          this.ordersService.addOrder(order).subscribe(data => {

            // let products = '';
            // this.currentBasket.forEach((basketItem: any) => {
            //   products += `<b>Ürün Adı</b> ${this.products.find((product: any) => product.id == basketItem.productId).name}, Fiyat: ${this.products.find((product: any) => product.id == basketItem.productId).discountedPrice} TL</br>`;
            // });
            // products += `</br><b>Toplam Fiyat:</b> ${this.totalPrice} TL</br></br>`;
            // products += `Adres Bilgileri:</br></br>Şehir: ${this.city}</br>İlçe: ${this.district}</br>Açık Adres: ${this.openAddress}</br>Posta Kodu: ${this.postalCode}</br></br>`;
            // products += `Not: ${this.note}</br></br>`;
            // products += `Siparişiniz başarıyla alınmıştır. Sipariş detaylarınız aşağıdaki gibidir:</br></br>`;
            // products += `Sipariş Numarası: ${this.}</br></br>`;
            // products += `Siparişinizin durumu hakkında bilgilendirme yapılacaktır.</br></br>`;
            // products += `Localmart Ekibi</br></br>`;

            let products = `
              <table style="width: 100%; border: 1px solid #000; border-collapse: collapse;">
                <thead>
                  <tr>
                    <th style="padding: 8px; text-align: left;">Ürün Adı</th>
                    <th style="padding: 8px; text-align: left;">Fiyat</th>
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
                    <td colspan="2" style="padding: 8px; text-align: right; font-weight: bold;">Toplam Fiyat: ${this.totalPrice} TL</td>
                  </tr>
                </tbody>
              </table>
              <br/>
              <b>Adres Bilgileri:</b><br/>
              <table style="width: 100%; border: 1px solid #000; border-collapse: collapse; margin-top: 10px;">
                <tr>
                  <td style="padding: 8px; font-weight: bold;">Şehir:</td>
                  <td style="padding: 8px;">${this.city}</td>
                </tr>
                <tr>
                  <td style="padding: 8px; font-weight: bold;">İlçe:</td>
                  <td style="padding: 8px;">${this.district}</td>
                </tr>
                <tr>
                  <td style="padding: 8px; font-weight: bold;">Açık Adres:</td>
                  <td style="padding: 8px;">${this.openAddress}</td>
                </tr>
                <tr>
                  <td style="padding: 8px; font-weight: bold;">Posta Kodu:</td>
                  <td style="padding: 8px;">${this.postalCode}</td>
                </tr>
              </table>
              <br/>
              <b>Not:</b> ${this.note}<br/><br/>
              Siparişinizin durumu hakkında bilgilendirme yapılacaktır.<br/><br/>
              Localmart Ekibi
            `;

            let mail: Mail = {
              to: this.currentUser?.email,
              subject: 'Localmart | Sepetiniz Onaylanmıştır.',
              body: products
            }
            this.mailService.sendMail(mail).subscribe((response) => { console.log('Mail sent successfully', response); }, (error) => { console.error('Error sending mail', error); });

            // ürünlerin sahibine de mail gönder;
            this.products.forEach((product: any) => {
              this.authService.getUser(product.sellerUserId).subscribe((user) => {
                // ürün sahipleri için yeni mail oluştur
                console.log("user => ", user)
                let newTotalPrice: number = 0;
                let products = `
                  <table style="width: 100%; border: 1px solid #000; border-collapse: collapse;">
                    <thead>
                      <tr>
                        <th style="padding: 8px; text-align: left;">Ürün Adı</th>
                        <th style="padding: 8px; text-align: left;">Fiyat</th>
                      </tr>
                    </thead>
                    <tbody>
                      ${this.currentBasket.map((basketItem: any) => {
                  console.log("this.products =>", this.products)
                  const product = this.products.find((product: any) => product.id == basketItem.productId);
                  console.log("product => ", product);
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
                        <td colspan="2" style="padding: 8px; text-align: right; font-weight: bold;">Toplam Fiyat: ${newTotalPrice.toFixed(2)} TL</td>
                      </tr>
                    </tbody>
                  </table>
                  <br/>
                  <b>Adres Bilgileri:</b><br/>
                  <table style="width: 100%; border: 1px solid #000; border-collapse: collapse; margin-top: 10px;">
                    <tr>
                      <td style="padding: 8px; font-weight: bold;">Şehir:</td>
                      <td style="padding: 8px;">${this.city}</td>
                    </tr>
                    <tr>
                      <td style="padding: 8px; font-weight: bold;">İlçe:</td>
                      <td style="padding: 8px;">${this.district}</td>
                    </tr>
                    <tr>
                      <td style="padding: 8px; font-weight: bold;">Açık Adres:</td>
                      <td style="padding: 8px;">${this.openAddress}</td>
                    </tr>
                    <tr>
                      <td style="padding: 8px; font-weight: bold;">Posta Kodu:</td>
                      <td style="padding: 8px;">${this.postalCode}</td>
                    </tr>
                  </table>
                  <br/>
                  Siparişiniz başarıyla alınmıştır. Lütfen en kısa sürede kargoya veriniz:<br/><br/>
                  Localmart Ekibi
                `;

                let mail_seller: Mail = {
                  to: user.email,
                  subject: 'Localmart | Siparişiniz Onaylanmıştır.',
                  body: products
                }
                this.mailService.sendMail(mail_seller).subscribe((response) => { console.log('Mail sent successfully', response); }, (error) => { console.error('Error sending mail', error); });
              })
            })

            this.alertController.create({
              header: 'Başarılı!',
              message: 'Siparişiniz Onaylanmıştır.',
              buttons: ['Tamam']
            }).then(successAlert => successAlert.present());
            console.log("data , Benim datam =>", data)
            // this.currentBasket = [];
            // localStorage.removeItem('basket');
            // this.router.navigate(['/my-orders/'])
          })
        },
        error => {
          console.error('Address save failed', error);
        }
      );
    }
  }
}
