import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { CategoryResponseModel } from 'src/app/models/category.model';
import { ProductRequestModel, ProductResponseModel } from 'src/app/models/product.model';
import { CategoryService } from 'src/app/services/category.service';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-products-grid',
  templateUrl: './products-grid.component.html',
  styleUrls: ['./products-grid.component.scss']
})
export class ProductsGridComponent implements OnInit{

  public categories!: CategoryResponseModel[];

  public form!: FormGroup;

  constructor(private categoryService: CategoryService,
              private productService: ProductService,
              private formBuilder: FormBuilder) {
    
  }
  
  ngOnInit(): void {
    this.categoryService.categories
      .subscribe(categories => {
        this.categories = categories;
        this.form = this.initializeForm();
      });
    this.categoryService.getAllCategories();  
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
          categoryId: product.categoryId,
          isNew: product.isNew
        });
      })
    )
  }

  public async onSaveButtonClick(productForm: AbstractControl) {
    if (productForm.valid) {
      if (productForm.get('productId')?.value === null) {
        await this.productService
          .createProduct(this.mapProductFormToModel(productForm as FormGroup));
        this.categoryService.getAllCategories();
      }
      else {
        // call update
      }
      console.log(productForm.value);
    }
  }

  public async deleteProduct(productForm: AbstractControl) {
    if (productForm.valid) {
      await this.productService.deleteProduct(productForm.get('productId')?.value);
      this.categoryService.getAllCategories();
    }
  }

  public onAddProductButtonClick(categoryFormIndex: number) {
    const categoryId = this.getCategoryFormArray
      .at(categoryFormIndex).get('categoryId')?.value;

    const newForm = this.formBuilder.group({
      productId: null,
      productName: null,
      quantityInPackage: null,
      categoryId: categoryId
    });

    this.getProductFormArray(categoryFormIndex).push(newForm);
  }

  public get getCategoryFormArray(): FormArray {
    return this.form.get('forms') as FormArray;
  }

  public getProductFormArray(index: number): FormArray {
    return this.getCategoryFormArray.at(index).get('products') as FormArray;
  }

  private mapProductFormToModel(productForm: FormGroup): ProductRequestModel {
    return {
      categoryId: productForm.get('categoryId')?.value,
      name: productForm.get('productName')?.value,
      quantityInPackage: productForm.get('quantityInPackage')?.value,
      creationDate: new Date()
    } as ProductRequestModel
  }
}
