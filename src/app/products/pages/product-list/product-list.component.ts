import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Product } from 'src/app/core/models/product.model';
import { ProductStorageService } from 'src/app/core/services/product-storage.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent {
  products: Product[] = [];

  constructor(private productService: ProductStorageService, private router: Router) {
    this.products = this.productService.getProducts();
  }

  viewDetails(id: number) {
    this.router.navigate(['/product', id]);
  }

  addProduct() {
    this.router.navigate(['/add']);
  }
}
