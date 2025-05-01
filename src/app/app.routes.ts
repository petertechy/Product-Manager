import { Routes } from '@angular/router';
import { ProductListComponent } from './products/pages/product-list/product-list.component';
import { ProductFormComponent } from './products/pages/product-form/product-form.component';
import { ProductDetailComponent } from './products/pages/product-detail/product-detail.component';

export const routes: Routes = [
  { path: '', component: ProductListComponent },
  { path: 'add', component: ProductFormComponent },
  { path: 'edit/:id', component: ProductFormComponent },
  { path: 'product/:id', component: ProductDetailComponent },
];
