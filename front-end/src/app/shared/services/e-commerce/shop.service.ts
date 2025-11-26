import { Injectable } from '@angular/core';
import { ShopDataState } from 'src/app/components/page/ecommerce/products/products.component';

@Injectable({
  providedIn: 'root',
})
export class ShopService {
  constructor() {}

  allData = [
    {
      id: 'product-image-1',
      src: './assets/img/ecommerce/product-details/1.png',
      Quantity: 1,
    },
    {
      id: 'product-image-1',
      src: './assets/img/ecommerce/product-details/1.png',
      Quantity: 1,
    },
    {
      id: 'product-image-1',
      src: './assets/img/ecommerce/product-details/1.png',
      Quantity: 1,
    },
    {
      id: 'product-image-1',
      src: './assets/img/ecommerce/product-details/1.png',
      Quantity: 1,
    },
    {
      id: 'product-image-1',
      src: './assets/img/ecommerce/product-details/1.png',
      Quantity: 1,
    },
  ];

  gettingData(data: any) {
    this.allData.push(...data);
    return data;
  }

  retunData() {
    return this.allData;
  }

  addingQuantity(id: string) {
    this.allData[0].Quantity++;
  }

  decreaseQuantity(id: string) {
    if (this.allData[0].Quantity > 0) {
      this.allData[0].Quantity--;
    }
  }

  delectItem(id: string) {
    const data = this.allData.filter((x) => {
      return x.id != id;
    });
    this.allData = data;
  }

  getPosta() {
    const DATA: ShopDataState[] = [
      {
        id: '1',
        src: './assets/img/ecommerce/product-details/1.png',
        children: [
          { img: './assets/img/ecommerce/product-details/1.png' },
          { img: './assets/img/ecommerce/product-details/2.png' },
          { img: './assets/img/ecommerce/product-details/3.png' },
        ],
      },
    ];
    return DATA;
  }
}
