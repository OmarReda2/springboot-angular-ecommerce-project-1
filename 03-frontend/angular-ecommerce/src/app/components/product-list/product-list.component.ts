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
  searchMode: boolean = false;

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

    // now get the products for the given category
    this.productService.getProductList(this.currentCategoryId).subscribe(
      data => {
        this.products = data;
      }
    )

  }







}
