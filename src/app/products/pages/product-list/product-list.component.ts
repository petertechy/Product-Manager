import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Product } from 'src/app/core/models/product.model';
import { ProductStorageService } from 'src/app/core/services/product-storage.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  
  searchTerm: string = '';      // For searching by name/SKU
  selectedCategory: string = '';  // For filtering by category
  minPrice: number = 0;        // For price filter
  maxPrice: number = 1000;     // For price filter
  selectedTags: string[] = []; // For filtering by tags

  categories: string[] = ['Electronics', 'Clothing', 'Books', 'Furniture']; // Example categories

  constructor(private productService: ProductStorageService, private router: Router) {}

  ngOnInit() {
    this.loadProducts();
  }

  loadProducts() {
    const allProducts = this.productService.getProducts();

    // Apply search and filter logic
    this.filteredProducts = allProducts.filter(product => 
      this.filterBySearchTerm(product) &&
      this.filterByCategory(product) &&
      this.filterByPriceRange(product) &&
      this.filterByTags(product)
    );
  }

  filterBySearchTerm(product: Product): boolean {
    const term = this.searchTerm.toLowerCase();
    return product.name.toLowerCase().includes(term) || product.sku.toLowerCase().includes(term);
  }

  filterByCategory(product: Product): boolean {
    return this.selectedCategory ? product.category === this.selectedCategory : true;
  }

  filterByPriceRange(product: Product): boolean {
    return product.price >= this.minPrice && product.price <= this.maxPrice;
  }

  filterByTags(product: Product): boolean {
    if (this.selectedTags.length === 0) return true;
    return this.selectedTags.every(tag => product.tags?.includes(tag));
  }

  // Update filters
  onSearchChange() {
    this.loadProducts();
  }

  onCategoryChange() {
    this.loadProducts();
  }

  onPriceChange() {
    this.loadProducts();
  }

  onTagsChange() {
    this.loadProducts();
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
