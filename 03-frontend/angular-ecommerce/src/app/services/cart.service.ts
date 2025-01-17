import { Injectable } from '@angular/core';
import { CartItem } from '../common/cart-item';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {


  cartItem: CartItem[] = [];

  totalPrice: Subject<number> = new Subject<number>();
  totalQuantity: Subject<number> = new Subject<number>();

  constructor() { }


  addToCart(theCartItem: CartItem) {

    //check if we already have the item in our cart
    let alreadyExistInCart: boolean = false;
    let existingCartItem: CartItem | undefined = undefined;

    if (this.cartItem.length > 0) {
      // find the item in the cart based on item id
      existingCartItem = this.cartItem.find(tempCartItem => tempCartItem.id === theCartItem.id);

    }

    //check if we found it
    alreadyExistInCart = (existingCartItem != undefined)
    if (alreadyExistInCart) {
      // increment the quantity
      existingCartItem!.quantity++;
    } else {
      // just add the item to the array
      this.cartItem.push(theCartItem);
    }


    // compute cart total price and quantity
    this.computeCartTotals()
  }



  computeCartTotals() {
    let totalPriceValue: number = 0;
    let totalQuantityValue: number = 0;

    for (let currentCartItem of this.cartItem) {
      totalPriceValue += currentCartItem.unitPrice * currentCartItem.quantity;
      totalQuantityValue += currentCartItem.quantity;
    }


    // publish the new values ... all subscribers wiil recieve the new data
    this.totalPrice.next(totalPriceValue);
    this.totalQuantity.next(totalQuantityValue);


    // log cart data just for debugging purpose
    this.logCartData(totalPriceValue, totalQuantityValue)

  }

  logCartData(totalPriceValue: number, totalQuantityValue: number) {

    console.log("Content of the cart ");
    for (const tempCartItem of this.cartItem) {
      const subtotalPrice = tempCartItem.quantity * tempCartItem.unitPrice;
      console.log(`name: ${tempCartItem.name}, quantity: ${tempCartItem.quantity},
                   unitPrice: ${tempCartItem.unitPrice}, subTotalPricer: ${subtotalPrice}`);

    }

    console.log(`totalPriceValue: ${totalPriceValue.toFixed(2)}, totalQuantityValue: ${totalQuantityValue}`);
  }



  decrementQuantity(cartItem: CartItem) {
    cartItem.quantity--;
    if (cartItem.quantity === 0) {
      this.remove(cartItem);
    } else {
      this.computeCartTotals();
    }
  }


  remove(cartItem: CartItem) {
    // get index of item in the array
    const itemIndex = this.cartItem.findIndex(tempCartItem => tempCartItem.id === cartItem.id);

    // if found, remove the item from the array at the given index
    if(itemIndex > -1){
      this.cartItem.splice(itemIndex, 1);

      this.computeCartTotals();
    }
  }

}
