import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, lastValueFrom } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CategoryResponseModel } from '../models/category.model';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  private readonly apiUrl: string;

  private _categories: BehaviorSubject<CategoryResponseModel[]> = new BehaviorSubject<CategoryResponseModel[]>([]);

  public categories = this._categories.asObservable();

  constructor(private httpClient: HttpClient) {
    this.apiUrl = `${environment.apiUrl}/category`;
  }

  public getAllCategories(): void {
    lastValueFrom(
      this.httpClient.get<CategoryResponseModel[]>(`${this.apiUrl}/get-all`)
    ).then(response => this._categories.next(response));
  }
}
