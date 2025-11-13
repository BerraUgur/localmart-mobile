import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { AddressService } from 'src/app/services/address.service';
import { AuthService } from 'src/app/services/auth.service';
import { Order } from 'src/app/models/order';
import { OrdersService } from 'src/app/services/orders.service';
import { Mail } from 'src/app/models/mail';
import { MailService } from 'src/app/services/mail.service';
import { LoggerService } from 'src/app/services/logger.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-my-orders',
  templateUrl: './my-orders.page.html',
  styleUrls: ['./my-orders.page.scss'],
})
export class MyOrdersPage implements OnInit {

  incomingOrders: Order[] = [];
  orders: Order[] = [];
  allOrders: any = []

  currentUserId?: number;
  currentUserRole?: string;
  apiUrl = environment.apiUrl;

  constructor(
    private alertController: AlertController,
    private ordersService: OrdersService,
    private addressService: AddressService,
    private authService: AuthService,
    private mailService: MailService,
    private logger: LoggerService
  ) {}

  getImageUrl(imagePath: string | null | undefined): string {
    if (!imagePath) return 'assets/icon/favicon.png';
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      return imagePath;
    }
    return `${this.apiUrl}${imagePath}`;
  }

  ngOnInit() {
    this.loadOrders();
  }

  private loadOrders() {
    this.currentUserId = this.authService.getCurrentUserId();
    this.currentUserRole = this.authService.getCurrentRoles();

    // Buyer
    this.ordersService.getOrdersByUserId(this.currentUserId).subscribe(ordersArray => {
      this.orders = ordersArray;
      this.orders.forEach((item: any) => {
        this.addressService.getAddressById(item.addressId).subscribe((address: any) => {
          item.address = address.data;
        });
        if (Array.isArray(item.orderItems)) {
          item.orderItems.forEach((orderItem: any) => {
            this.authService.getUser(orderItem.product.sellerUserId).subscribe(user => {
              orderItem.product.sellerPhone = user.phoneNumber;
            });
          });
        }
      });
    });

    // Seller
    this.ordersService.getAllOrders().subscribe(allOrdersArray => {
      this.incomingOrders = [];
      allOrdersArray.forEach((item: any) => {
        this.addressService.getAddressById(item.addressId).subscribe((address: any) => {
          item.address = address.data;
        });
        if (Array.isArray(item.orderItems)) {
          item.orderItems = item.orderItems.filter((p: any) => p.product.sellerUserId == this.currentUserId);
          item.orderItems.forEach((orderItem: any) => {
            this.authService.getUser(orderItem.product.sellerUserId).subscribe(user => {
              orderItem.product.sellerPhone = user.phoneNumber;
            });
          });
        }
        if (item.orderItems && item.orderItems.length > 0) {
          this.incomingOrders.push(item);
        }
      });
    });
  }

  orderShipped(order: Order | any, pid?: number) {
    const obs = pid ? this.ordersService.updateOrderToShippedProductById(order.id, order, pid) : this.ordersService.updateOrderToShippedById(order.id, order);
    obs.subscribe(data => {
      // Send mail to buyer with detailed HTML
      this.authService.getUser(order.userId).subscribe(user => {
        const productsHtml = `
          <table style='width: 100%; border: 1px solid #000; border-collapse: collapse;'>
            <thead>
              <tr>
                <th style='padding: 8px; text-align: left;'>Product Name</th>
                <th style='padding: 8px; text-align: left;'>Price</th>
              </tr>
            </thead>
            <tbody>
              ${order.orderItems.map((item: any) => `
                <tr>
                  <td style='padding: 8px;'>${item.product?.name}</td>
                  <td style='padding: 8px;'>${item.product?.discountedPrice} TL</td>
                </tr>
              `).join('')}
              <tr>
                <td colspan='2' style='padding: 8px; text-align: right; font-weight: bold;'>Total Price: ${order.orderItems.reduce((sum: number, item: any) => sum + (item.product?.discountedPrice ?? 0), 0)} TL</td>
              </tr>
            </tbody>
          </table>
          <br/>
          <b>Address Information:</b><br/>
          <table style='width: 100%; border: 1px solid #000; border-collapse: collapse; margin-top: 10px;'>
            <tr>
              <td style='padding: 8px; font-weight: bold;'>City:</td>
              <td style='padding: 8px;'>${order.address?.city}</td>
            </tr>
            <tr>
              <td style='padding: 8px; font-weight: bold;'>District:</td>
              <td style='padding: 8px;'>${order.address?.district}</td>
            </tr>
            <tr>
              <td style='padding: 8px; font-weight: bold;'>Address:</td>
              <td style='padding: 8px;'>${order.address?.openAddress}</td>
            </tr>
            <tr>
              <td style='padding: 8px; font-weight: bold;'>Postal Code:</td>
              <td style='padding: 8px;'>${order.address?.postalCode}</td>
            </tr>
          </table>
          <br/>
          Your order #${order.id} has been shipped. You can track your order from your account.<br/><br/>
          Thank you for shopping with Localmart!<br/><br/>Localmart Team
        `;
        const mail: Mail = {
          to: user.email,
          subject: 'Localmart | Your order has been shipped.',
          body: productsHtml
        };
        this.mailService.sendMail(mail).subscribe(
          () => this.logger.logInfo('Mail sent to buyer for shipped order', { orderId: order.id }),
          error => this.logger.logError('Error sending mail to buyer for shipped order', error)
        );
      });
      this.alertController.create({
        header: 'Success!',
        message: 'Product has been shipped.',
        buttons: ['OK']
      }).then(successAlert => {
        successAlert.present();
        // refresh lists so UI shows updated status
        this.loadOrders();
      });
    });
  }

  orderDelivered(order: Order | any, pid?: number) {
    const obs = pid ? this.ordersService.updateOrderToDeliveredProductById(order.id, order, pid) : this.ordersService.updateOrderToDeliveredById(order.id, order);
    obs.subscribe(data => {
      // Send mail to seller with detailed HTML
      if (order.orderItems && order.orderItems.length > 0) {
        const sellerId = order.orderItems[0].product.sellerUserId;
        this.authService.getUser(sellerId).subscribe(user => {
          const sellerItems = order.orderItems.filter((item: any) => item.product.sellerUserId === sellerId);
          const newTotalPrice = sellerItems.reduce((sum: number, item: any) => sum + (item.product?.discountedPrice ?? 0), 0);
          const productsHtml = `
            <table style='width: 100%; border: 1px solid #000; border-collapse: collapse;'>
              <thead>
                <tr>
                  <th style='padding: 8px; text-align: left;'>Product Name</th>
                  <th style='padding: 8px; text-align: left;'>Price</th>
                </tr>
              </thead>
              <tbody>
                ${sellerItems.map((item: any) => `
                  <tr>
                    <td style='padding: 8px;'>${item.product?.name}</td>
                    <td style='padding: 8px;'>${item.product?.discountedPrice} TL</td>
                  </tr>
                `).join('')}
                <tr>
                  <td colspan='2' style='padding: 8px; text-align: right; font-weight: bold;'>Total Price: ${newTotalPrice} TL</td>
                </tr>
              </tbody>
            </table>
            <br/>
            <b>Address Information:</b><br/>
            <table style='width: 100%; border: 1px solid #000; border-collapse: collapse; margin-top: 10px;'>
              <tr>
                <td style='padding: 8px; font-weight: bold;'>City:</td>
                <td style='padding: 8px;'>${order.address?.city}</td>
              </tr>
              <tr>
                <td style='padding: 8px; font-weight: bold;'>District:</td>
                <td style='padding: 8px;'>${order.address?.district}</td>
              </tr>
              <tr>
                <td style='padding: 8px; font-weight: bold;'>Address:</td>
                <td style='padding: 8px;'>${order.address?.openAddress}</td>
              </tr>
              <tr>
                <td style='padding: 8px; font-weight: bold;'>Postal Code:</td>
                <td style='padding: 8px;'>${order.address?.postalCode}</td>
              </tr>
            </table>
            <br/>
            Your product in order #${order.id} has been delivered to the buyer.<br/><br/>
            Thank you for using Localmart!<br/><br/>Localmart Team
          `;
          const mail: Mail = {
            to: user.email,
            subject: 'Localmart | Your product has been delivered.',
            body: productsHtml
          };
          this.mailService.sendMail(mail).subscribe(
            () => this.logger.logInfo('Mail sent to seller for delivered order', { orderId: order.id }),
            error => this.logger.logError('Error sending mail to seller for delivered order', error)
          );
        });
      }
      this.alertController.create({
        header: 'Success!',
        message: 'Product has been delivered.',
        buttons: ['OK']
      }).then(successAlert => {
        successAlert.present();
        this.loadOrders();
      });
    });
  }
}
