import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Product } from 'src/app/core/models/product.model';
import { ProductStorageService } from 'src/app/core/services/product-storage.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PaginationComponent } from 'src/app/shared/pagination/pagination.component';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, FormsModule, PaginationComponent],
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  pagedProducts: Product[] = [];
  selectedProductIds: number[] = [];

  searchTerm: string = '';
  selectedCategory: string = '';
  minPrice: number = 0;
  maxPrice: number = 1000;
  selectedTags: string[] = [];

  sortKey: string = '';
sortDirection: 'asc' | 'desc' = 'asc';


  categories: string[] = ['Electronics', 'Clothing', 'Books', 'Furniture'];

  // Pagination
  currentPage: number = 1;
  itemsPerPage: number = 5;
  totalPages: number = 1;

  constructor(private productService: ProductStorageService, private router: Router) {}

  ngOnInit() {
    this.loadProducts();
  }

  loadProducts() {
    this.products = this.productService.getProducts();
    this.applyFilters();
  }

  applyFilters() {
    this.filteredProducts = this.products.filter(product =>
      this.filterBySearchTerm(product) &&
      this.filterByCategory(product) &&
      this.filterByPriceRange(product) &&
      this.filterByTags(product)
    );

    this.totalPages = Math.ceil(this.filteredProducts.length / this.itemsPerPage);
    this.currentPage = Math.min(this.currentPage, this.totalPages || 1);
    this.updatePagedProducts();
  }

  updatePagedProducts() {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    this.pagedProducts = this.filteredProducts.slice(start, end);
  }

  handlePageChange(page: number) {
    this.currentPage = page;
    this.updatePagedProducts();
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

  onTagToggle(tag: string, event: Event) {
    const checked = (event.target as HTMLInputElement).checked;
    if (checked) {
      if (!this.selectedTags.includes(tag)) {
        this.selectedTags.push(tag);
      }
    } else {
      this.selectedTags = this.selectedTags.filter(t => t !== tag);
    }
    this.applyFilters();
  }

  onSearchChange() {
    this.applyFilters();
  }

  onCategoryChange() {
    this.applyFilters();
  }

  onPriceChange() {
    this.applyFilters();
  }

  onTagsChange() {
    this.applyFilters();
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
      this.loadProducts();
    }
  }

  getStockBadgeClass(stock: number): string {
    if (stock === 0) return 'badge badge-red';
    if (stock < 5) return 'badge badge-yellow';
    return 'badge badge-green';
  }

  getStockText(stock: number): string {
    if (stock === 0) return 'Out of Stock';
    if (stock < 5) return 'Low Stock';
    return 'In Stock';
  }

  toggleProductSelection(id: number, event: Event) {
    const checked = (event.target as HTMLInputElement).checked;
    if (checked) {
      this.selectedProductIds.push(id);
    } else {
      this.selectedProductIds = this.selectedProductIds.filter(pid => pid !== id);
    }
  }
  
  isSelected(id: number): boolean {
    return this.selectedProductIds.includes(id);
  }
  
  deleteSelectedProducts() {
    const confirmed = confirm('Are you sure you want to delete selected products?');
    if (confirmed) {
      this.products = this.products.filter(p => !this.selectedProductIds.includes(p.id));
      this.productService.saveProducts(this.products);
      this.selectedProductIds = [];
      this.loadProducts();
    }
  }

  areAllSelected(): boolean {
    return this.filteredProducts.length > 0 && this.selectedProductIds.length === this.filteredProducts.length;
  }
  
  toggleSelectAll(event: Event) {
    const checked = (event.target as HTMLInputElement).checked;
    if (checked) {
      this.selectedProductIds = this.filteredProducts.map(p => p.id);
    } else {
      this.selectedProductIds = [];
    }
  }

  applyFilters() {
    this.filteredProducts = this.products.filter(product =>
      this.filterBySearchTerm(product) &&
      this.filterByCategory(product) &&
      this.filterByPriceRange(product) &&
      this.filterByTags(product)
    );
  
    this.sortFilteredProducts(); // ✅ Sort before pagination
  
    this.totalPages = Math.ceil(this.filteredProducts.length / this.itemsPerPage);
    this.currentPage = Math.min(this.currentPage, this.totalPages || 1);
    this.updatePagedProducts();
  }
  
  sortFilteredProducts() {
    if (!this.sortKey) return;
  
    this.filteredProducts.sort((a: any, b: any) => {
      const valueA = a[this.sortKey];
      const valueB = b[this.sortKey];
  
      if (typeof valueA === 'string') {
        return this.sortDirection === 'asc'
          ? valueA.localeCompare(valueB)
          : valueB.localeCompare(valueA);
      }
  
      return this.sortDirection === 'asc'
        ? valueA - valueB
        : valueB - valueA;
    });
  }
  
 
  onSort(key: string) {
    if (this.sortKey === key) {
      // Toggle direction
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortKey = key;
      this.sortDirection = 'asc';
    }
  
    this.applyFilters();
  }
  
}
