import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductStorageService } from 'src/app/core/services/product-storage.service';
import { Product } from 'src/app/core/models/product.model';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule, Location } from '@angular/common';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.css']
})
export class ProductFormComponent implements OnInit {
  product: Product = {
    id: Date.now(),
    name: '',
    sku: '',
    price: 0,
    stock: 0,
    description: '',
    category: '',
    tags: []
  };

  isEditMode = false;
  categories: string[] = ['Electronics', 'Clothing', 'Books', 'Furniture'];
  availableTags: string[] = ['New', 'On Sale', 'Popular'];

  constructor(
    private productService: ProductStorageService,
    private router: Router,
    private route: ActivatedRoute,
    private location: Location,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      const id = Number(idParam);
      const existing = this.productService.getProductById(id);
      if (existing) {
        this.product = { ...existing };
        this.isEditMode = true;
      } else {
        this.toastr.warning('Product not found.', 'Warning');
        this.router.navigate(['/']);
      }
    }
  }

  onTagToggle(tag: string, event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    if (!this.product.tags) this.product.tags = [];

    if (checked) {
      if (!this.product.tags.includes(tag)) {
        this.product.tags.push(tag);
      }
    } else {
      this.product.tags = this.product.tags.filter(t => t !== tag);
    }
  }

  saveProduct(form: NgForm): void {
    if (form.invalid) {
      this.toastr.error('Please correct errors before submitting.', 'Form Error');
      return;
    }

    const products = this.productService.getProducts();

    if (this.isEditMode) {
      const updated = products.map(p => p.id === this.product.id ? this.product : p);
      this.productService.saveProducts(updated);
      this.toastr.success('Product updated successfully');
    } else {
      this.productService.addProduct(this.product);
      this.toastr.success('Product added successfully');
    }

    this.router.navigate(['/']);
  }

  goBack(): void {
    this.location.back();
  }
}
