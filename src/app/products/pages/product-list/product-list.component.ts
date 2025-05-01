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

  editProduct(id: number) {
    this.router.navigate(['/edit', id]);
  }
  
  deleteProduct(id: number) {
    const confirmed = confirm('Are you sure you want to delete this product?');
    if (confirmed) {
      const updated = this.products.filter(p => p.id !== id);
      this.productService.saveProducts(updated);
      this.products = updated;
    }
  }

  isLowStock(stock: number): boolean {
    return stock < 5; // Threshold for low stock
  }
  
  
}
