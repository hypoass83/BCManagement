import { createReducer, on } from '@ngrx/store';
import { addShopData, deleteShopData } from './shop.action';

export interface DataState {
  data: ReadonlyArray<any>;
}

const initialSate = [
  {
    Quantity: 1,
    id: '1',
    name: 'Black Heals For Women',
    offerprice: '$699',
    src: './assets/img/ecommerce/products/1.png',
    price: '$999',
    color: 'Brown Color',
    size: 'Size : M',
    discount: '30%',
  },
  {
    Quantity: 2,
    id: '2',
    name: 'Sun Glasses',
    offerprice: '$699',
    src: './assets/img/ecommerce/products/7.png',
    price: '$1,198',
    color: 'White Color',
    size: 'Adjustable',
    discount: '10%',
  },
  {
    Quantity: 0,
    id: '3',
    name: 'Leather Wallet For Girls',
    offerprice: '$150',
    src: './assets/img/ecommerce/products/10.png',
    price: '$500',
    color: 'White Color',
    discount: '5%',
  },
  {
    Quantity: 0,
    id: '4',
    name: 'Dolor Rose Frangrance Perfume',
    offerprice: '$299',
    src: './assets/img/ecommerce/products/5.png',
    price: '$199',
    color: 'Jasmine Fragrance',
    size: '500 ML',
    discount: '10%',
  },
  {
    Quantity: 0,
    id: '5',
    name: 'Dolor Wireless Airpods ',
    offerprice: '$499',
    src: './assets/img/ecommerce/products/4.png',
    price: '$499',
    color: 'White',
    size: 'Bluetooth',
    discount: '0%',
  },
 
];

export const dataReaducer = createReducer(
  initialSate,
  on(addShopData, (state, { data }) => {
    return [...state, data[0]];
  }),
  on(deleteShopData, (state, { id }) => {
    const updatedPosts = state.filter((post) => {
      return post.id !== id;
    });
    return (state = updatedPosts);
  })
);
