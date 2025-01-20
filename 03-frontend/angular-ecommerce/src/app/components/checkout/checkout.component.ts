import { ShopFormService } from './../../services/shop-form.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Country } from 'src/app/common/country';
import { State } from 'src/app/common/state';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {



  checkOutFormGroup: FormGroup = new FormGroup({});

  totalPrice:number=0;
  totalQuantity:number=0;

  creditCardYear:number[] = [];
  creditCardMonth:number[] = [];

  countries:Country[]=[];

  shippingAddressStates:State[]=[];
  BillingAddressStates:State[]=[];

  constructor(private formBuilder: FormBuilder,
              private shopFormService:ShopFormService) { }


  
  ngOnInit(): void {
    this.checkOutFormGroup = this.formBuilder.group({
      customer: this.formBuilder.group({
        firstName: [''],
        lastName: [''],
        email: ['']
      }),
      shippingAddress: this.formBuilder.group({
        street: [''],
        city: [''],
        state: [''],
        country: [''],
        zipCode: ['']
      }),
      billingAddress: this.formBuilder.group({
        street: [''],
        city: [''],
        state: [''],
        country: [''],
        zipCode: [''] 
      }),
      creditCard: this.formBuilder.group({
        cardType: [''],
        nameOnCard: [''],
        cardNumber: [''],
        securityCode: [''],
        expirationMonth: [''],
        expirationYear: [''],
      })

    });



    // populate credit card month
    const startMonth:number=new Date().getMonth()+1;
    console.log("startMonth: " + startMonth);

    this.shopFormService.getCreditCardMonths(startMonth).subscribe(
      data=>{
        console.log("Retrieved credit card months: " + JSON.stringify(data))
        this.creditCardMonth=data
      }
    )

    // populate credit card year
    this.shopFormService.getCreditCardYear().subscribe(
      data=>{
        console.log("Retrieved credit card year: " + JSON.stringify(data))
        this.creditCardYear=data;
      }
    )


    
    this.shopFormService.getCountries().subscribe(
      data =>{
        console.log("Retrieved Countries: " + JSON.stringify(data));
        this.countries=data 
      }
    )



  }




  onSubmit() {
    console.log("Handling the submit button");
    console.log(this.checkOutFormGroup.get('customer')?.value);
    console.log("The email address is " + this.checkOutFormGroup.get('customer')?.value.email);

    console.log("The shipping address country is " + this.checkOutFormGroup.get('shippingAddress')?.value.country.name);
    console.log("The shipping address country is " + this.checkOutFormGroup.get('billingAddress')?.value.country.name);
  }


  copyShippingToBilling(event: any) {
    {
      if (event.target.checked) {
        this.checkOutFormGroup.controls['billingAddress']
          .setValue(this.checkOutFormGroup.controls['shippingAddress'].value);

          this.BillingAddressStates=this.shippingAddressStates;
      }
      else{
        this.checkOutFormGroup.controls['billingAddress'].reset();
        this.BillingAddressStates=[];
      }

    }
  }


  handleMonthsAndYears() {
      const creditCardFormGroup=this.checkOutFormGroup.get('creditCard');

      const currentYear:number = new Date().getFullYear();
      const selectedYear:number = Number(creditCardFormGroup?.value.expirationYear);

      let startMonth:number;

      //if the current year equals to selected year, then start with the current month
      if(currentYear===selectedYear){
        startMonth = new Date().getMonth()+1;
      }else{
        startMonth=1;
      }

      this.shopFormService.getCreditCardMonths(startMonth).subscribe(
        data=>{
          console.log("Retrieved credit card months: " + JSON.stringify(data))
          this.creditCardMonth=data
        }
      )
    }
  

    getStates(formGroupName:string) {
        
      const formGroup = this.checkOutFormGroup.get(formGroupName);

      const countryCode = formGroup?.value.country.code;
      const countryName = formGroup?.value.country.name;

      console.log(`${formGroupName} country code: ${countryCode}`);
      console.log(`${formGroupName} country name: ${countryName}`);

      this.shopFormService.getStates(countryCode).subscribe(
        data => {
          if(formGroupName=="shippingAddress"){
            this.shippingAddressStates=data;
          }else{
            this.BillingAddressStates=data;
          }

          formGroup?.get('state')?.setValue(data[0])
        }
      )



    }
}
