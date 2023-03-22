import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ProductRequestModel, ProductResponseModel } from '../models/product.model';
import { CategoryService } from './category.service';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private readonly apiUrl: string;

  constructor(private httpClient: HttpClient) {
    this.apiUrl = `${environment.apiUrl}/product`;
  }

  public createProduct(product: ProductRequestModel): Promise<ProductResponseModel> {
    return lastValueFrom(
      this.httpClient.post<ProductResponseModel>(this.apiUrl, product)
    );
  }

  public deleteProduct(productId: number): Promise<boolean> {
    return lastValueFrom(
      this.httpClient.delete<boolean>(`${this.apiUrl}/${productId}`)
    );
  }
}
