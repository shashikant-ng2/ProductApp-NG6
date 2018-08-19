import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { Products, Categories, CreateProductModel } from '../modal/products';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9zaWQiOiIxMiIsInVuaXF1ZV9uYW1lIjoiaW50ZXJ2aWV3YXBpQGdhcnRuZXIuY29tIiwiZW1haWwiOiJpbnRlcnZpZXdhcGlAZ2FydG5lci5jb20iLCJuYmYiOjE1MzMxNDE2MDUsImV4cCI6MTU5MzE0MTU0NSwiaWF0IjoxNTMzMTQxNjA1fQ.rI_TI4MXXqcInmbOYRlRdvpkL6-MQdRJWDKdJkFm2rA'
  })
};

@Injectable({ providedIn: 'root' })
export class ProductService {

  private productBaseAPIURL = 'https://gdm-interview-api.azurewebsites.net/';  // URL to web api

  constructor(private http: HttpClient) { }

  /** GET products from the server */
  getProducts(): Observable<Products[]> {
    return this.http.get<Products[]>(this.productBaseAPIURL + '/api/v1/Products', httpOptions)
      .pipe(
        tap(products => this.log('fetched product')),
        catchError(this.handleError('get Products', []))
      );
  }

  /** GET products by id. Will 404 if id not found */
  getProductByID(id: number): Observable<Products> {
    const url = `${this.productBaseAPIURL}/api/v1/Products/${id}`;
    return this.http.get<Products>(url, httpOptions).pipe(
      tap(products => this.log(`fetched product id=${id}`)),
      catchError(this.handleError<Products>(`getproduct id=${id}`))
    );
  }

  /** GET Categories from serve*/
  getCategories(): Observable<Categories[]> {
    const url = `${this.productBaseAPIURL}/api/v1/Categories`;
    return this.http.get<Categories[]>(url, httpOptions).pipe(
      tap(categories => this.log(`fetched Categories`)),
      catchError(this.handleError<Categories[]>(`getcategories`))
    );
  }

  getCategoriesIdByObject(categories: Categories[]): Array<number> {
    const catIds: Array<number> = [];
    categories.forEach(element => {
      catIds.push(element.CategoryId)
    });
    return catIds;
  }

  //// Save methods //////////

  /** POST: add a new hero to the server */
  createProduct(products: CreateProductModel): Observable<Products> {
    return this.http.post<Products>(this.productBaseAPIURL + '/api/v1/Products', products, httpOptions).pipe(
      tap((products: Products) => {
        this.log(`added Product w/ id=${products.ProductId}`);
        console.log(products);
      }),
      catchError(this.handleError<Products>('Add Products'))
    );
  }



  /** PUT: Update selected product details */
  updateProductDetail(productId:number, product: CreateProductModel): Observable<any> {
    const url = `${this.productBaseAPIURL}/api/v1/Products/${productId}`;
    return this.http.put(url, product, httpOptions).pipe(
      tap((products: Products) => {
        this.log(`updated Product w/ id=${products.ProductId}`);
        console.log(products);
      }),
      catchError(this.handleError<any>('updateHero'))
    );
  }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  /** Log a HeroService message with the MessageService */
  private log(message: string) {
    console.log(message);
  }
}
