import { HttpClient} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Product } from '../common/product';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private baseUrl = 'http://localhost:8080/api/products'

  constructor(private httpClient:HttpClient) { }

  getProductList(theCategoryId: number): Observable<Product[]> {
    const searchUrl = `${this.baseUrl}/search/findByCategoryId?id=${theCategoryId}`

    //need t0 build URL based on category id

    return this.httpClient.get<GetResponse>(searchUrl).pipe(
      map(response => response._embedded.products)
    )
  }
}


// .pipe: used to combine 2 functions and the parameter is the function before
// we use this interfece to make sure that get function in "this.httpClient.get" will return the same structurfor interface
// this interface is the same for structure dor the data returned so we shiuld check the structure before. 
interface GetResponse {
  _embedded: {
    products: Product[];
  }
}