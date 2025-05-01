import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ProductStorageService } from 'src/app/core/services/product-storage.service';
import { Product } from 'src/app/core/models/product.model';
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

  constructor(private productService: ProductStorageService, private router: Router) {}

  saveProduct() {
    this.productService.addProduct(this.product);
    this.router.navigate(['/']);
  }
}
