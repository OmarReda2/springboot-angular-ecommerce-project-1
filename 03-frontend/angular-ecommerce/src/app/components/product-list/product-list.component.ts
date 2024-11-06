import { Product } from 'src/app/common/product';
import { ProductService } from './../../services/product.service';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-product-list',
  // templateUrl: './product-list.component.html',
  // templateUrl: './product-list-table.component.html',
  templateUrl: './product-list-grid.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent {

  products: Product[] = [];
  currentCategoryId: number = 1;
  previousCategoryId: number = 1;
  searchMode: boolean = false;

  // new prop for pagination
  thePageNumber: number = 1;
  thePageSize: number = 10;
  theTotalElements: number = 0;

  constructor(private productService: ProductService,
    private route: ActivatedRoute) {

  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(() => {
      this.listProduct();
    })
  }


  listProduct() {
    this.searchMode = (this.route.snapshot.paramMap.has('keyword'))

    if (this.searchMode) {
      this.handleSearchProducts()
    } else {
      this.handleListProduct()
    }
  }

  handleSearchProducts() {
    const theKeyword = this.route.snapshot.paramMap.get('keyword')!;

    // now search for the products using keyword
    this.productService.searchProducts(theKeyword).subscribe(
      data => {
        this.products = data;
      }
    )
  }



  handleListProduct() {
    // check if "id" param is available
    const hasCategoryId: boolean = this.route.snapshot.paramMap.has('id');

    if (hasCategoryId) {
      // get the "id" param string. convert string to a number usingthe "+" symbol
      this.currentCategoryId = +this.route.snapshot.paramMap.get('id')!;
    }
    else {
      // not category id available ... defualt to category id 1
      this.currentCategoryId = 1;
    }



    //
    // if we have a different category than the previous 
    // Note: Angular wil reuse a component if it is being viewed 
    //

    // if we have different category id than previous 
    // then set the PageNumber back to 1
    if(this.previousCategoryId != this.currentCategoryId){
      this.thePageNumber = 1
    }

    this.previousCategoryId = this.currentCategoryId
    console.log(`currentCategoryId=${this.currentCategoryId}`, `thePageNumber=${this.thePageNumber}`);



    // // now get the products for the given category
    // this.productService.getProductList(this.currentCategoryId).subscribe(
    //   data => {
    //     this.products = data;
    //   }
    // )
    
    // now get the products for the given category
      this.productService.getProductListPaginate(this.thePageNumber - 1
        ,this.thePageSize
        ,this.currentCategoryId)
        .subscribe(
           data => {
             this.products = data._embedded.products,
             this.thePageNumber = data.page.number + 1,
             this.thePageSize = data.page.size,
             this.theTotalElements = data.page.totalElemnets
           }
         )

  }







}
