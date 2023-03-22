import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { CategoryResponseModel } from 'src/app/models/category.model';
import { ProductResponseModel } from 'src/app/models/product.model';
import { CategoryService } from 'src/app/services/category.service';

@Component({
  selector: 'app-products-grid',
  templateUrl: './products-grid.component.html',
  styleUrls: ['./products-grid.component.scss']
})
export class ProductsGridComponent implements OnInit{

  public categories!: CategoryResponseModel[];

  public form!: FormGroup;

  constructor(private categoryService: CategoryService,
              private formBuilder: FormBuilder) {
    
  }
  
  ngOnInit(): void {
    this.getAllCategories()
    .then(categories => {
      this.categories = categories;
      this.form = this.initializeForm();
    });
  }

  private initializeForm(): FormGroup {
    return this.formBuilder.group({
      forms: this.createFormArray()
    });
  }

  private createFormArray(): FormArray {
    let categoryForms = this.categories.map(category => {
      return this.formBuilder.group({
        categoryId: category.id,
        categoryName: category.name,
        products: this.createProductsFormArray(category.products),
      });
    });
    return this.formBuilder.array(categoryForms);
  }

  private createProductsFormArray(products: ProductResponseModel[]): FormArray {
    return this.formBuilder.array(
      products.map(product => {
        return this.formBuilder.group({
          productId: product.id,
          productName: product.name,
          quantityInPackage: product.quantityInPackage,
          categoryId: product.categoryId
        });
      })
    )
  }

  public updateProduct(form: AbstractControl) {
    if (form.valid) {
      // TODO: implement updateProduct
      console.log(form.value);
    }
  }

  public deleteProduct(form: AbstractControl) {
    if (form.valid) {
      // TODO: implement deleteProduct
    }
  }
  private getAllCategories(): Promise<CategoryResponseModel[]> {
    return this.categoryService.getAllCategories();
  }

  public get getCategoryFormArray(): FormArray {
    return this.form.get('forms') as FormArray;
  }

  public getProductFormArray(index: number): FormArray {
    return this.getCategoryFormArray.at(index).get('products') as FormArray;
  }
}
