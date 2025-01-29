import { CartItem } from "./cart-item";

export class OrderItem {

    imageUrl:string;
    unitPrice:number;
    quantity:number;
    productId:string|number;

    constructor(cartItem:CartItem){
        this.imageUrl=cartItem.imageUrl;
        this.unitPrice=cartItem.unitPrice;
        this.quantity=cartItem.quantity;
        this.productId=cartItem.id;
    }

}
