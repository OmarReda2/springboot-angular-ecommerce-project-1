import { Router } from '@angular/router';
import { CartService } from 'src/app/services/cart.service';
import { ShopFormService } from './../../services/shop-form.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Country } from 'src/app/common/country';
import { State } from 'src/app/common/state';
import { ShopValidators } from 'src/app/validators/shop-validators';
import { CheckoutService } from 'src/app/services/checkout.service';
import { Order } from 'src/app/common/order';
import { OrderItem } from 'src/app/common/order-item';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {



  checkOutFormGroup: FormGroup = new FormGroup({});

  totalPrice: number = 0.00;
  totalQuantity: number = 0;

  creditCardYear: number[] = [];
  creditCardMonth: number[] = [];

  countries: Country[] = [];

  shippingAddressStates: State[] = [];
  BillingAddressStates: State[] = [];

  constructor(private formBuilder: FormBuilder,
    private shopFormService: ShopFormService,
    private cartService: CartService,
    private checkoutService: CheckoutService,
    private router: Router) { }



  ngOnInit(): void {

    //subscribe to the cart totalPrice
    this.reviewCartDetails();


    this.checkOutFormGroup = this.formBuilder.group({
      customer: this.formBuilder.group({
        firstName: new FormControl('',
          [Validators.required,
          Validators.minLength(2),
          ShopValidators.notOnlyWhiteSpaces]),

        lastName: new FormControl('',
          [Validators.required,
          Validators.minLength(2),
          ShopValidators.notOnlyWhiteSpaces]),

        email: new FormControl('',
          [Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')])
      }),

      shippingAddress: this.formBuilder.group({
        street: new FormControl('',
          [Validators.required,
          Validators.minLength(2),
          ShopValidators.notOnlyWhiteSpaces]),

        city: new FormControl('',
          [Validators.required,
          Validators.minLength(2),
          ShopValidators.notOnlyWhiteSpaces]),

        state: new FormControl('', [Validators.required]),

        country: new FormControl('', [Validators.required]),

        zipCode: new FormControl('',
          [Validators.required,
          Validators.minLength(2),
          ShopValidators.notOnlyWhiteSpaces]),

      }),

      billingAddress: this.formBuilder.group({
        street: new FormControl('',
          [Validators.required,
          Validators.minLength(2),
          ShopValidators.notOnlyWhiteSpaces]),

        city: new FormControl('',
          [Validators.required,
          Validators.minLength(2),
          ShopValidators.notOnlyWhiteSpaces]),

        state: new FormControl('', [Validators.required]),

        country: new FormControl('', [Validators.required]),

        zipCode: new FormControl('',
          [Validators.required,
          Validators.minLength(2),
          ShopValidators.notOnlyWhiteSpaces]),
      }),

      creditCard: this.formBuilder.group({
        cardType: new FormControl('', [Validators.required]),

        nameOnCard: new FormControl('',
          [Validators.required,
          Validators.minLength(2),
          ShopValidators.notOnlyWhiteSpaces]),

        cardNumber: new FormControl('', [Validators.required, Validators.pattern('[0-9]{16}')]),

        securityCode: new FormControl('', [Validators.required, Validators.pattern('[0-9]{3}')]),
        expirationMonth: [''],
        expirationYear: [''],
      })

    });



    // populate credit card month
    const startMonth: number = new Date().getMonth() + 1;
    console.log("startMonth: " + startMonth);

    this.shopFormService.getCreditCardMonths(startMonth).subscribe(
      data => {
        console.log("Retrieved credit card months: " + JSON.stringify(data))
        this.creditCardMonth = data
      }
    )

    // populate credit card year
    this.shopFormService.getCreditCardYear().subscribe(
      data => {
        console.log("Retrieved credit card year: " + JSON.stringify(data))
        this.creditCardYear = data;
      }
    )



    this.shopFormService.getCountries().subscribe(
      data => {
        console.log("Retrieved Countries: " + JSON.stringify(data));
        this.countries = data
      }
    )
  }


  reviewCartDetails(): void {
    this.cartService.totalPrice.subscribe(
      data => {
        this.totalPrice = data;
        console.log("=========>> " + data);

      }
    );

    // subscribe to the cart totalQuantity
    this.cartService.totalQuantity.subscribe(
      data => this.totalQuantity = data
    );
  }

  get firstName() { return this.checkOutFormGroup.get('customer.firstName') }
  get lastName() { return this.checkOutFormGroup.get('customer.lastName') }
  get email() { return this.checkOutFormGroup.get('customer.email') }

  get shippingAddressStreet() { return this.checkOutFormGroup.get('shippingAddress.street') }
  get shippingAddressCity() { return this.checkOutFormGroup.get('shippingAddress.city') }
  get shippingAddressState() { return this.checkOutFormGroup.get('shippingAddress.state') }
  get shippingAddressZipCode() { return this.checkOutFormGroup.get('shippingAddress.zipCode') }
  get shippingAddressCountry() { return this.checkOutFormGroup.get('shippingAddress.country') }

  get billingAddressStreet() { return this.checkOutFormGroup.get('billingAddress.street') }
  get billingAddressCity() { return this.checkOutFormGroup.get('billingAddress.city') }
  get billingAddressState() { return this.checkOutFormGroup.get('billingAddress.state') }
  get billingAddressZipCode() { return this.checkOutFormGroup.get('billingAddress.zipCode') }
  get billingAddressCountry() { return this.checkOutFormGroup.get('billingAddress.country') }

  get creditCardType() { return this.checkOutFormGroup.get('creditCard.cardType') }
  get creditCardNameOnCard() { return this.checkOutFormGroup.get('creditCard.nameOnCard') }
  get creditCardCardNumber() { return this.checkOutFormGroup.get('creditCard.cardNumber') }
  get creditCardSecurityCode() { return this.checkOutFormGroup.get('creditCard.securityCode') }





  onSubmit() {

    console.log("Handling the submit button");
    if (this.checkOutFormGroup.invalid) {
      this.checkOutFormGroup.markAllAsTouched();
      return;
    }


    // set up order
    let order = new Order()
    order.totalPrice = this.totalPrice;
    order.totalQuantity = this.totalQuantity;

    // get cart items
    const cartItems = this.cartService.cartItem;

    // create orderItems from cartItems
/* 
    // - long way
    let orderItems : OrderItem[] = [];
    for(let i = 0; i<cartItems.length; i++){
        orderItems[i] = new OrderItem(cartItems[i])
    }
*/
    // - short way of doing the same thing
    let orderItems: OrderItem[] = cartItems.map(tempCartItem => new OrderItem(tempCartItem))

    // set up purchase

    // populate purchase - customer

    // populate purchase - shipping address

    // populate purchase - billing address

    // populate purchase - order and orderItems

    // call REST API via the CheckoutService


  }


  copyShippingToBilling(event: any) {
    {
      if (event.target.checked) {
        this.checkOutFormGroup.controls['billingAddress']
          .setValue(this.checkOutFormGroup.controls['shippingAddress'].value);

        this.BillingAddressStates = this.shippingAddressStates;
      }
      else {
        this.checkOutFormGroup.controls['billingAddress'].reset();
        this.BillingAddressStates = [];
      }

    }
  }


  handleMonthsAndYears() {
    const creditCardFormGroup = this.checkOutFormGroup.get('creditCard');

    const currentYear: number = new Date().getFullYear();
    const selectedYear: number = Number(creditCardFormGroup?.value.expirationYear);

    let startMonth: number;

    //if the current year equals to selected year, then start with the current month
    if (currentYear === selectedYear) {
      startMonth = new Date().getMonth() + 1;
    } else {
      startMonth = 1;
    }

    this.shopFormService.getCreditCardMonths(startMonth).subscribe(
      data => {
        console.log("Retrieved credit card months: " + JSON.stringify(data))
        this.creditCardMonth = data
      }
    )
  }


  getStates(formGroupName: string) {

    const formGroup = this.checkOutFormGroup.get(formGroupName);

    const countryCode = formGroup?.value.country.code;
    const countryName = formGroup?.value.country.name;

    console.log(`${formGroupName} country code: ${countryCode}`);
    console.log(`${formGroupName} country name: ${countryName}`);

    this.shopFormService.getStates(countryCode).subscribe(
      data => {
        if (formGroupName == "shippingAddress") {
          this.shippingAddressStates = data;
        } else {
          this.BillingAddressStates = data;
        }

        formGroup?.get('state')?.setValue(data[0])
      }
    )



  }
}
