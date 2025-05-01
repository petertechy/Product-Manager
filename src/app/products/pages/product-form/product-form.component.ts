import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductStorageService } from 'src/app/core/services/product-storage.service';
import { Product } from 'src/app/core/models/product.model';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.css']
})
export class ProductFormComponent {
  product: Product = {
    id: Date.now(),
    name: '',
    sku: '',
    price: 0,
    stock: 0,
    description: '',
  };

  isEditMode = false;

  constructor(
    private productService: ProductStorageService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      const id = Number(idParam);
      const existing = this.productService.getProductById(id);
      if (existing) {
        this.product = { ...existing };
        this.isEditMode = true;
      }
    }
  }

  saveProduct() {
    const products = this.productService.getProducts();
    if (this.isEditMode) {
      const updated = products.map(p => p.id === this.product.id ? this.product : p);
      this.productService.saveProducts(updated);
    } else {
      this.productService.addProduct(this.product);
    }
    this.router.navigate(['/']);
  }
}
