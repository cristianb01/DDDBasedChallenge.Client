import { AfterContentChecked, AfterViewChecked, Component, DoCheck, ElementRef, OnInit, ViewChildren } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CategoryResponseModel } from 'src/app/models/category.model';
import { ProductRequestModel, ProductResponseModel } from 'src/app/models/product.model';
import { CategoryService } from 'src/app/services/category.service';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-products-grid',
  templateUrl: './products-grid.component.html',
  styleUrls: ['./products-grid.component.scss']
})
export class ProductsGridComponent implements OnInit {

  public categories!: CategoryResponseModel[];

  public form!: FormGroup;
  
  isAddingNewProduct: boolean;

  constructor(private categoryService: CategoryService,
              private productService: ProductService,
              private formBuilder: FormBuilder) {
    this.isAddingNewProduct = false;  
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
      forms: this.createCategoriesFormArray()
    });
  }

  private createCategoriesFormArray(): FormArray {
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
        let form = this.createProductForm();
        form.setValue({
          productId: product.id,
          productName: product.name,
          quantityInPackage: product.quantityInPackage,
          categoryId: product.categoryId,
          isNew: product.isNew
        });
        return form;
      })
    )
  }

  private createProductForm(): FormGroup {
    return this.formBuilder.group({
      productId: null,
      productName: [null, Validators.required],
      quantityInPackage: [null, [Validators.required, Validators.pattern("^[0-9]*$")]],
      categoryId: null,
      isNew: null
    });
  }

  public async onSaveButtonClick(productForm: AbstractControl) {
    if (productForm.valid) {
      const mappedProduct = this.mapProductFormToModel(productForm as FormGroup);
      const productId = productForm.get('productId')?.value;

      if (productId === null) {
        await this.productService
          .createProduct(mappedProduct);
      }
      else {
        await this.productService
          .updateProduct(productId, mappedProduct);
      }
      this.categoryService.getAllCategories();
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

    const newForm = this.createProductForm();
    newForm.get('categoryId')?.setValue({ categoryId: categoryId });

    this.getProductFormArray(categoryFormIndex).push(newForm);

    this.isAddingNewProduct = true;
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
