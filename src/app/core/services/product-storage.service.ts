import { Injectable } from '@angular/core';
import { Product } from '../models/product.model';

@Injectable({ providedIn: 'root' })
export class ProductStorageService {
  private storageKey = 'products';

  getProducts(): Product[] {
    const data = localStorage.getItem(this.storageKey);
    return data ? JSON.parse(data) : [];
  }

  saveProducts(products: Product[]): void {
    localStorage.setItem(this.storageKey, JSON.stringify(products));
  }

  addProduct(product: Product): void {
    const products = this.getProducts();
    products.push(product);
    this.saveProducts(products);
  }

  getProductById(id: number): Product | undefined {
    return this.getProducts().find(p => p.id === id);
  }
}
