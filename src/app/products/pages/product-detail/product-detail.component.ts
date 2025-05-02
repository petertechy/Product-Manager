import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ProductStorageService } from 'src/app/core/services/product-storage.service';
import { Product } from 'src/app/core/models/product.model';
import { Location } from '@angular/common';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css']
})
export class ProductDetailComponent {
  product?: Product;

  constructor(
    route: ActivatedRoute,
    private productService: ProductStorageService,
    private location: Location // ✅ Inject Location
  ) {
    const id = Number(route.snapshot.paramMap.get('id'));
    this.product = this.productService.getProductById(id);
  }

  goBack() {
    this.location.back(); // ✅ Go to previous page
  }
}
