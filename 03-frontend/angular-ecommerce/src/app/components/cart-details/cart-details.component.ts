import { Component, OnInit } from '@angular/core';
import { CartItem } from 'src/app/common/cart-item';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-cart-details',
  templateUrl: './cart-details.component.html',
  styleUrls: ['./cart-details.component.css']
})
export class CartDetailsComponent implements OnInit {


  
  cartItem: CartItem[] = [];
  totalPrice: number = 0.00;
  totalQuantity: number = 0;
  
  constructor(private cartService:CartService) { }

  ngOnInit(): void {
    this.listCartDetails();
  }
  
  listCartDetails() {
    // get a handle to the cart items
    this.cartItem = this.cartService.cartItem;
    
    // subscribe to the cart totalPrice
    this.cartService.totalPrice.subscribe(
      data => this.totalPrice =data
    )
    // subscribe to the cart totalQuantity
    this.cartService.totalQuantity.subscribe(
      data=> this.totalQuantity = data
    )
    
    // compute cart total price and quantity
    this.cartService.computeCartTotals();
    
  }
  


  incrementQuantity(cartItem: CartItem) {
    this.cartService.addToCart(cartItem);
  }



  decrementQuantity(cartItem: CartItem) {
    this.cartService.decrementQuantity(cartItem);
  }


  removeItem(cartItem: CartItem) {
    this.cartService.remove(cartItem);
    }
}
