export interface Product {
    id: number;
    name: string;
    sku: string;
    price: number;
    stock: number;
    description: string;
    category?: string;
    tags?: string[];
  }  