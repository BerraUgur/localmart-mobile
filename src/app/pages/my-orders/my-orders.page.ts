import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { AddressService } from 'src/app/shared/services/address.service';
import { AuthService } from 'src/app/shared/services/auth.service';
import { Order } from 'src/app/shared/services/order';
import { OrdersService } from 'src/app/shared/services/orders.service';

@Component({
  selector: 'app-my-orders',
  templateUrl: './my-orders.page.html',
  styleUrls: ['./my-orders.page.scss'],
})
export class MyOrdersPage implements OnInit {

  incomingOrders: Order[] = [];
  orders: Order[] = [];
  allOrders:any = []

  currentUserId?: number;
  currentUserRole?: string;

  // incomingOrders = [
  //   {
  //     id: 1001,
  //     status: '1',
  //     note: 'Kapıya kadar getirilsin.',
  //     address: {
  //       district: 'Kadıköy',
  //       city: 'İstanbul',
  //       openAddress: 'Bahariye Cad. No: 15',
  //       postalCode: '34710'
  //     },
  //     orderItems: [
  //       {
  //         product: {
  //           name: 'El Yapımı Tandır Ekmeği',
  //           district: 'Selçuklu',
  //           city: 'Konya',
  //           description: 'Taze, taş fırında pişmiş tandır ekmeği.',
  //           mainImage: 'https://assets.mmsrg.com/isr/166325/c1/-/ASSET_MMS_144721927?x=280&y=190&format=jpg&quality=80&sp=yes&strip=yes&trim&ex=280&ey=190&align=center&resizesource&unsharp=1.5x1+0.7+0.02&cox=0&coy=0&cdx=280&cdy=190',
  //           discountedPrice: 45,
  //           sellerPhone: '+90 555 111 2233'
  //         }
  //       }
  //     ]
  //   },
  //   {
  //     id: 1002,
  //     status: '2',
  //     note: 'Zili çalmayın, arayın.',
  //     address: {
  //       district: 'Çankaya',
  //       city: 'Ankara',
  //       openAddress: 'Atatürk Blv. No: 25',
  //       postalCode: '06420'
  //     },
  //     orderItems: [
  //       {
  //         product: {
  //           name: 'Organik Bal',
  //           district: 'Ayvalık',
  //           city: 'Balıkesir',
  //           description: '100% doğal, katkısız çiçek balı.',
  //           mainImage: 'https://assets.mmsrg.com/isr/166325/c1/-/ASSET_MMS_133515701?x=280&y=190&format=jpg&quality=80&sp=yes&strip=yes&trim&ex=280&ey=190&align=center&resizesource&unsharp=1.5x1+0.7+0.02&cox=0&coy=0&cdx=280&cdy=190',
  //           discountedPrice: 120,
  //           sellerPhone: '+90 532 333 4455'
  //         }
  //       }
  //     ]
  //   },
  //   {
  //     id: 1003,
  //     status: '3',
  //     note: 'Komşuya bırakılabilir.',
  //     address: {
  //       district: 'Karşıyaka',
  //       city: 'İzmir',
  //       openAddress: 'Girne Bulvarı No: 78',
  //       postalCode: '35560'
  //     },
  //     orderItems: [
  //       {
  //         product: {
  //           name: 'Zeytinyağı',
  //           district: 'Edremit',
  //           city: 'Balıkesir',
  //           description: 'Soğuk sıkım natürel sızma zeytinyağı.',
  //           mainImage: 'https://assets.mmsrg.com/isr/166325/c1/-/ASSET_MMS_149860847?x=280&y=190&format=jpg&quality=80&sp=yes&strip=yes&trim&ex=280&ey=190&align=center&resizesource&unsharp=1.5x1+0.7+0.02&cox=0&coy=0&cdx=280&cdy=190',
  //           discountedPrice: 90,
  //           sellerPhone: '+90 555 666 7788'
  //         }
  //       }
  //     ]
  //   },
  //   {
  //     id: 1004,
  //     status: '1',
  //     note: 'Öğleden sonra teslim edilsin.',
  //     address: {
  //       district: 'Merkez',
  //       city: 'Eskişehir',
  //       openAddress: 'İsmet İnönü Cd. No: 34',
  //       postalCode: '26010'
  //     },
  //     orderItems: [
  //       {
  //         product: {
  //           name: 'Ev Yapımı Reçel',
  //           district: 'Mudanya',
  //           city: 'Bursa',
  //           description: 'Çilekli ev yapımı doğal reçel.',
  //           mainImage: 'https://assets.mmsrg.com/isr/166325/c1/-/ASSET_MMS_151160138?x=280&y=190&format=jpg&quality=80&sp=yes&strip=yes&trim&ex=280&ey=190&align=center&resizesource&unsharp=1.5x1+0.7+0.02&cox=0&coy=0&cdx=280&cdy=190',
  //           discountedPrice: 55,
  //           sellerPhone: '+90 533 999 0001'
  //         }
  //       }
  //     ]
  //   },
  //   {
  //     id: 1005,
  //     status: '2',
  //     note: 'Kargo firması ile iletişime geçilsin.',
  //     address: {
  //       district: 'Selçuk',
  //       city: 'İzmir',
  //       openAddress: 'Efes Yolu Üzeri No: 9',
  //       postalCode: '35920'
  //     },
  //     orderItems: [
  //       {
  //         product: {
  //           name: 'Kurutulmuş Domates',
  //           district: 'Tarsus',
  //           city: 'Mersin',
  //           description: 'Güneşte kurutulmuş doğal domates.',
  //           mainImage: 'https://assets.mmsrg.com/isr/166325/c1/-/ASSET_MMS_143826918?x=280&y=190&format=jpg&quality=80&sp=yes&strip=yes&trim&ex=280&ey=190&align=center&resizesource&unsharp=1.5x1+0.7+0.02&cox=0&coy=0&cdx=280&cdy=190',
  //           discountedPrice: 38,
  //           sellerPhone: '+90 544 111 2234'
  //         }
  //       }
  //     ]
  //   }
  // ];
  
  // orders = [
  //   {
  //     "id": 101,
  //     "status": "1",
  //     "note": "Lütfen kargoya dikkatli veriniz.",
  //     "address": {
  //       "district": "Kadıköy",
  //       "city": "İstanbul",
  //       "openAddress": "Bahariye Caddesi No:12",
  //       "postalCode": "34710"
  //     },
  //     "orderItems": [
  //       {
  //         "product": {
  //           "name": "Bluetooth Kulaklık",
  //           "description": "Kablosuz ve yüksek ses kalitesi.",
  //           "mainImage": "https://assets.mmsrg.com/isr/166325/c1/-/ASSET_MMS_144721927?x=280&y=190&format=jpg&quality=80&sp=yes&strip=yes&trim&ex=280&ey=190&align=center&resizesource&unsharp=1.5x1+0.7+0.02&cox=0&coy=0&cdx=280&cdy=190",
  //           "district": "Kadıköy",
  //           "city": "İstanbul",
  //           "sellerPhone": "0555 123 4567",
  //           "discountedPrice": 299.99
  //         }
  //       }
  //     ]
  //   },
  //   {
  //     "id": 102,
  //     "status": "2",
  //     "note": "",
  //     "address": {
  //       "district": "Çankaya",
  //       "city": "Ankara",
  //       "openAddress": "Atatürk Bulvarı No:24",
  //       "postalCode": "06680"
  //     },
  //     "orderItems": [
  //       {
  //         "product": {
  //           "name": "Akıllı Saat",
  //           "description": "Adım sayar ve kalp ritmi ölçer.",
  //           "mainImage": "https://assets.mmsrg.com/isr/166325/c1/-/ASSET_MMS_133515701?x=280&y=190&format=jpg&quality=80&sp=yes&strip=yes&trim&ex=280&ey=190&align=center&resizesource&unsharp=1.5x1+0.7+0.02&cox=0&coy=0&cdx=280&cdy=190",
  //           "district": "Çankaya",
  //           "city": "Ankara",
  //           "sellerPhone": "0533 987 6543",
  //           "discountedPrice": 449.90
  //         }
  //       }
  //     ]
  //   },
  //   {
  //     "id": 103,
  //     "status": "3",
  //     "note": "Ürün sorunsuz teslim alındı.",
  //     "address": {
  //       "district": "Konak",
  //       "city": "İzmir",
  //       "openAddress": "Cumhuriyet Blv. No:45",
  //       "postalCode": "35210"
  //     },
  //     "orderItems": [
  //       {
  //         "product": {
  //           "name": "Dizüstü Bilgisayar",
  //           "description": "i5 işlemci, 8GB RAM, SSD disk.",
  //           "mainImage": "https://assets.mmsrg.com/isr/166325/c1/-/ASSET_MMS_149860847?x=280&y=190&format=jpg&quality=80&sp=yes&strip=yes&trim&ex=280&ey=190&align=center&resizesource&unsharp=1.5x1+0.7+0.02&cox=0&coy=0&cdx=280&cdy=190",
  //           "district": "Konak",
  //           "city": "İzmir",
  //           "sellerPhone": "0542 888 1122",
  //           "discountedPrice": 7899.99
  //         }
  //       }
  //     ]
  //   },
  //   {
  //     "id": 104,
  //     "status": "1",
  //     "note": "",
  //     "address": {
  //       "district": "Osmangazi",
  //       "city": "Bursa",
  //       "openAddress": "Altıparmak Cd. No:6",
  //       "postalCode": "16010"
  //     },
  //     "orderItems": [
  //       {
  //         "product": {
  //           "name": "Oyuncu Mouse",
  //           "description": "RGB ışıklı, yüksek hassasiyet.",
  //           "mainImage": "https://assets.mmsrg.com/isr/166325/c1/-/ASSET_MMS_151160138?x=280&y=190&format=jpg&quality=80&sp=yes&strip=yes&trim&ex=280&ey=190&align=center&resizesource&unsharp=1.5x1+0.7+0.02&cox=0&coy=0&cdx=280&cdy=190",
  //           "district": "Osmangazi",
  //           "city": "Bursa",
  //           "sellerPhone": "0505 333 7788",
  //           "discountedPrice": 159.50
  //         }
  //       }
  //     ]
  //   },
  //   {
  //     "id": 105,
  //     "status": "2",
  //     "note": "Teslimat tarihi değiştirildi.",
  //     "address": {
  //       "district": "Selçuklu",
  //       "city": "Konya",
  //       "openAddress": "Mevlana Cd. No:19",
  //       "postalCode": "42060"
  //     },
  //     "orderItems": [
  //       {
  //         "product": {
  //           "name": "USB-C Şarj Kablosu",
  //           "description": "1.5 metre uzunluk, hızlı şarj destekli.",
  //           "mainImage": "https://assets.mmsrg.com/isr/166325/c1/-/ASSET_MMS_143826918?x=280&y=190&format=jpg&quality=80&sp=yes&strip=yes&trim&ex=280&ey=190&align=center&resizesource&unsharp=1.5x1+0.7+0.02&cox=0&coy=0&cdx=280&cdy=190",
  //           "district": "Selçuklu",
  //           "city": "Konya",
  //           "sellerPhone": "0532 111 2233",
  //           "discountedPrice": 49.90
  //         }
  //       }
  //     ]
  //   }
  // ]
  
  constructor(
    private alertController: AlertController,
    private ordersService: OrdersService,
    private addressService: AddressService,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.currentUserId = this.authService.getCurrentUserId();
    this.currentUserRole = this.authService.getCurrentRoles();
    // console.log(this.currentUserRole)

    this.ordersService.getOrdersByUserId(this.currentUserId).subscribe(data => {
      data.forEach((item:any) => {
        let order:any = {}
        this.addressService.getAddressById(item.addressId).subscribe(address => {
          item.address = address
          this.orders = data
          console.log(data)
        })
        item.orderItems.forEach((orderItem:any) => {
          this.authService.getUser(orderItem.product.sellerUserId).subscribe(user => {
            orderItem.product.sellerPhone = user.phoneNumber
          })
        })
      })
    })

    this.ordersService.getAllOrders().subscribe(data =>{
      data.forEach((item:any) => {
        this.addressService.getAddressById(item.addressId).subscribe(address => {
          item.address = address
          // console.log(data)
        })
        item.orderItems = item.orderItems.filter((p:any) => p.product.sellerUserId == this.currentUserId)
        item.orderItems.forEach((orderItem:any) => {
          this.authService.getUser(orderItem.product.sellerUserId).subscribe(user => {
            orderItem.product.sellerPhone = user.phoneNumber
          })
        })
        if (item.orderItems.length > 0) {
          this.incomingOrders.push(item)
        }
      })

      this.allOrders = data
      // console.log("this.allOrders => ", this.allOrders)
    })
  }
  

  orderShipped(order:Order | any){
    this.ordersService.updateOrderToShippedById(order.id, order).subscribe(data => {
      order.status = 2
      this.alertController.create({
        header: 'Başarılı!',
        message: 'Ürün Kargoya Verilmiştir',
        buttons: ['Tamam']
      }).then(successAlert => successAlert.present());
    })
  }

  orderDelivered(order:Order | any){
    this.ordersService.updateOrderToDeliveredById(order.id, order).subscribe(data => {
      order.status = 3
      this.alertController.create({
        header: 'Başarılı!',
        message: 'Ürün Teslim Alınmıştır',
        buttons: ['Tamam']
      }).then(successAlert => successAlert.present());
    })
  }


  // orderShipped(order: any){
  // }

  // orderDelivered(order: any){
    
  // }


}
