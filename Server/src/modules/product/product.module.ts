import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { Product } from './entities/product.entity';
import { TypeOrmModule } from '@nestjs/typeorm/dist';
import { Category } from '../category/entities/category.entity';
import { CategoryService } from '../category/category.service';

@Module({
  imports: [TypeOrmModule.forFeature([Product, Category])],
  controllers: [ProductController],
  providers: [ProductService, CategoryService],
  exports: [ProductService],
})
export class ProductModule {}
