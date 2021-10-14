import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable, throwError, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators'
import { environment } from 'src/environments/environment';

import { Product } from '../../models/products-model';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  private urlApi = `${environment.baseUrl}api/products`;
  private jsonHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });

  constructor(private http: HttpClient) { }

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.urlApi)
      .pipe(
      catchError(this.treatError));
  }

  getProduct(id: string): Observable<Product> {

  if (id === '') {
    return of(this.inicializeProduct());
  }

  const urlId = `${this.urlApi}/${id}`

  return this.http.get<Product>(urlId)
      .pipe(
      catchError(this.treatError));
  }

  createProduct(Product: Product) {
    return this.http.post<Product>(this.urlApi, Product, {headers: this.jsonHeaders})
      .pipe(
      catchError(this.treatError));
  }

  updateProduct(Product: Product) {
    const urlId = `${this.urlApi}/${Product.id}`;
    return this.http.put<Product>(urlId, Product, {headers: this.jsonHeaders})
      .pipe(
      catchError(this.treatError));
  }

  deleteProduct(id: string) {
    const urlId = `${this.urlApi}/${id}`;
    return this.http.delete<Product>(urlId, {headers: this.jsonHeaders})
      .pipe(
      catchError(this.treatError));
  }

  private treatError(err: any) {
    let msgErro: string;

    if (err.error instanceof ErrorEvent) {
      msgErro = `Ocorreu um erro: ${err.error.message}`;
    }
    else {
      msgErro = `Ocorreu um erro na API. StatusCode: ${err.status}, Desc.: ${err.body.error}`;
    }
    return throwError(msgErro);
  }

  private inicializeProduct(): Product {
    return {
      id: '',
      nome: '',
      descricao: '',
      unidadeMedida: '',
      ativo: true,
      custo: 0.0,
      margemLucro: 0.0,
      quantidade: 0,
    }
  }
}