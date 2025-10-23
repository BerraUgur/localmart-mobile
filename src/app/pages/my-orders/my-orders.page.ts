import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { AddressService } from 'src/app/services/address.service';
import { AuthService } from 'src/app/services/auth.service';
import { Order } from 'src/app/models/order';
import { OrdersService } from 'src/app/services/orders.service';
import { Mail } from 'src/app/models/mail';
import { MailService } from 'src/app/services/mail.service';
import { LoggerService } from 'src/app/services/logger.service';

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

  constructor(
    private alertController: AlertController,
    private ordersService: OrdersService,
    private addressService: AddressService,
    private authService: AuthService,
    private mailService: MailService,
    private logger: LoggerService
  ) { }

  ngOnInit() {
    this.currentUserId = this.authService.getCurrentUserId();
    this.currentUserRole = this.authService.getCurrentRoles();
    this.logger.info('MyOrdersPage ngOnInit', { currentUserId: this.currentUserId, currentUserRole: this.currentUserRole });
    this.ordersService.getOrdersByUserId(this.currentUserId).subscribe(data => {
      data.forEach((item: any) => {
        let order: any = {};
        this.addressService.getAddressById(item.addressId).subscribe(address => {
          item.address = address;
          this.orders = data;
          this.logger.info('User orders loaded', data);
        });
        item.orderItems.forEach((orderItem: any) => {
          this.authService.getUser(orderItem.product.sellerUserId).subscribe(user => {
            orderItem.product.sellerPhone = user.phoneNumber;
            this.logger.info('Seller loaded for order item', user);
          });
        });
      });
    });
    this.ordersService.getAllOrders().subscribe(data => {
      data.forEach((item: any) => {
        this.addressService.getAddressById(item.addressId).subscribe(address => {
          item.address = address;
        });
        item.orderItems = item.orderItems.filter((p: any) => p.product.sellerUserId == this.currentUserId);
        item.orderItems.forEach((orderItem: any) => {
          this.authService.getUser(orderItem.product.sellerUserId).subscribe(user => {
            orderItem.product.sellerPhone = user.phoneNumber;
            this.logger.info('Seller loaded for incoming order item', user);
          });
        });
        if (item.orderItems.length > 0) {
          this.incomingOrders.push(item);
        }
      });
      this.allOrders = data;
      this.logger.info('All orders loaded', data);
    });
  }

  orderShipped(order: Order | any, pid: number | undefined) {
    this.ordersService.updateOrderToShippedProductById(order.id, order, pid).subscribe(data => {
      order.status = 2;
      this.logger.info('Order shipped', { orderId: order.id });
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
          () => this.logger.info('Mail sent to buyer for shipped order', { orderId: order.id }),
          error => this.logger.error('Error sending mail to buyer for shipped order', error)
        );
      });
      this.alertController.create({
        header: 'Success!',
        message: 'Product has been shipped.',
        buttons: ['OK']
      }).then(successAlert => successAlert.present());
    });
  }

  orderDelivered(order: Order | any, pid: number | undefined) {
    this.ordersService.updateOrderToDeliveredProductById(order.id, order, pid).subscribe(data => {
      order.status = 3;
      this.logger.info('Order delivered', { orderId: order.id });
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
            () => this.logger.info('Mail sent to seller for delivered order', { orderId: order.id }),
            error => this.logger.error('Error sending mail to seller for delivered order', error)
          );
        });
      }
      this.alertController.create({
        header: 'Success!',
        message: 'Product has been delivered.',
        buttons: ['OK']
      }).then(successAlert => successAlert.present());
    });
  }
}
