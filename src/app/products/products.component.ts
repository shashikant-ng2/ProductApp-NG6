import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { Products, Categories, CreateProductModel } from '../modal/products';
import { ProductService } from '../services/product.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {
  productLists: Products[];
  showViewProduct: boolean = false;
  showAddProductPanel: boolean = false;
  showSuccessBadge: boolean = false;
  msgBadge: string;
  submitType: string;
  product: Products;
  categories: Categories[];
  productForm: FormGroup;
  selectedCategories = [];
  dropdownSettings = {};
  selectedProductId: number;
  submitted: boolean = false;
  constructor(private productService: ProductService, private fb: FormBuilder) { }

  // getter for form controls
  get formControl() { return this.productForm.controls; }

  ngOnInit() {
    this.getProducts();
    this.getCategories();
    this.createProductForm();
    this.selectedCategories = [
      {
        CategoryId: 1,
        Name: "Accounting"
      },
      {
        CategoryId: 10,
        Name: "Collaboration and Communication"
      }
    ];
    this.dropdownSettings = {
      singleSelection: false,
      idField: 'CategoryId',
      textField: 'Name',
      selectAllText: 'Select All Categories',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
      allowSearchFilter: true
    };
  }


  closeModal() {
    document.getElementById('myModal').style.display = 'none';
  }

  getProducts(): void {
    this.productService.getProducts()
      .subscribe(products => this.productLists = products);
  }
  getCategories(): void {
    this.productService.getCategories()
      .subscribe(categories => {
        this.categories = categories;
      });
  }

  addNewProduct(): void {
    this.showViewProduct = false;
    this.product = new Products();
    this.submitType = 'Save';
    this.showAddProductPanel = true;
  }

  createProductForm() {
    this.productForm = this.fb.group({
      productName: ['', Validators.required],
      productDescription: [''],
      productURL: [''],
      categories: ['']
    });
  }

  viewProductDetail(productId: number) {
    this.submitted = false;
    this.showAddProductPanel = false;
    this.productService.getProductByID(productId)
      .subscribe(product => {
        this.product = product;
        this.showViewProduct = true;
        setTimeout(() => {
          document.getElementById('myModal').style.display = 'block';
        }, 500);
      });
  }

  editProductDetails(productId: number) {
    this.submitType = 'update';
    this.selectedProductId = productId;
    this.productService.getProductByID(productId)
      .subscribe(product => {
        this.product = product;
        this.productForm.setValue({
          productName: product.Name,
          productDescription: product.Description,
          productURL: product.Url,
          categories: product.Categories
        })
        this.selectedCategories = product.Categories;
        this.showViewProduct = false;
        this.showAddProductPanel = true;

      });
  }

  onSave() {
    this.submitted = true;
    if (this.productForm.valid) {
      const formValue = this.productForm.value;
      const productObj = new CreateProductModel();
      productObj.Name = formValue.productName;
      productObj.Description = formValue.productDescription;
      productObj.Url = formValue.productURL;
      productObj.CategoryIds = this.productService.getCategoriesIdByObject(formValue.categories);
      // Call the service to create the product
      if (this.submitType === 'update') {
        this.productService.updateProductDetail(this.selectedProductId, productObj).subscribe(product => {
          this.showAddProductPanel = false;
          this.showSuccessBadge = true;
          this.msgBadge = 'Product Updated Successfully!';
          setTimeout(() => {
            this.showSuccessBadge = false;
          }, 2000);
          this.getProducts();
        });;

      } else {
        this.productService.createProduct(productObj).subscribe(product => {
          this.showAddProductPanel = false;
          this.showSuccessBadge = true;
          this.msgBadge = 'Product Added Successfully!';
          setTimeout(() => {
            this.showSuccessBadge = false;
          }, 2000);
          this.getProducts();
        });
      }
    } else {
      console.log('form is invalid');
    }

  }

  onCancel() {
    this.showViewProduct = false;
    this.showAddProductPanel = false;
  }
}
