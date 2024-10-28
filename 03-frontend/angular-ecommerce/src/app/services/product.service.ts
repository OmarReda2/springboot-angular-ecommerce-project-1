import { ProductCategory } from './../common/product-category';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Product } from '../common/product';

@Injectable({
  providedIn: 'root'
})
export class ProductService {


  private baseUrl = 'http://localhost:8080/api/products'
  private categoryUrl = 'http://localhost:8080/api/product-category'

  constructor(private httpClient: HttpClient) { }



  getProduct(theProductId:number):Observable<Product>{
    return this.httpClient.get<Product>(`${this.baseUrl}/${theProductId}`)
  }







  getProductList(theCategoryId: number): Observable<Product[]> {

    //need t0 build URL based on category id
    const searchUrl = `${this.baseUrl}/search/findByCategoryId?id=${theCategoryId}`

    return this.getProducts(searchUrl)
  }







  getProductCategories(): Observable<ProductCategory[]> {

    return this.httpClient.get<GetProductCategoryResponse>(this.categoryUrl).pipe(
      map(response => response._embedded.productCategory)
    );
  }





  searchProducts(theKeyWord: string): Observable<Product[]> {

    //need t0 build URL based on category keyword
    const searchUrl = `${this.baseUrl}/search/findByNameContaining?name=${theKeyWord}`

    return this.getProducts(searchUrl)
  }

  private getProducts(searchUrl: string): Observable<Product[]> {
    return this.httpClient.get<GetProductResponse>(searchUrl).pipe(
      map(response => response._embedded.products)
    );
  }





}







// .pipe: used to combine 2 functions and the parameter is the function before
// we use this interfece to make sure that get function in "this.httpClient.get" will return the same structurfor interface
// this interface is the same for structure dor the data returned so we shiuld check the structure before. 
interface GetProductResponse {
  _embedded: {
    products: Product[];
  }
}

interface GetProductCategoryResponse {
  _embedded: {
    productCategory: ProductCategory[];
  }
}