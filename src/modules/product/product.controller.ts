import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { ProductService } from './product.service';

@ApiTags('Products')
@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  async listProducts() {
    return this.productService.listProducts();
  }
}
