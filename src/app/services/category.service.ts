import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CategoryResponseModel } from '../models/category.model';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  private readonly apiUrl: string;

  constructor(private httpClient: HttpClient) {
    this.apiUrl = environment.apiUrl;
  }

  public getAllCategories(): Promise<CategoryResponseModel[]> {
    return lastValueFrom(
      this.httpClient.get<CategoryResponseModel[]>(`${this.apiUrl}/get-all`)
    );
  }
}
