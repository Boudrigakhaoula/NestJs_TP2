import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';

@Injectable()
export class ProductsService {
  private products: Product[] = []; // Typage explicite avec Product[]
  private idCounter = 1;

  // Ajouter un produit
  create(createProductDto: CreateProductDto): Product {
    const product: Product = {
      id: this.idCounter++,
      ...createProductDto,
      createdAt: new Date(),
    };
    this.products.push(product);
    return product;
  }

  // Récupérer tous les produits
  findAll(): Product[] {
    return this.products;
  }

  // Récupérer un produit par ID
  findOne(id: number): Product {
    const product = this.products.find((p) => p.id === id);
    if (!product) {
      throw new NotFoundException(`Produit avec l'ID ${id} non trouvé`);
    }
    return product;
  }

  // Mettre à jour un produit
  update(id: number, updateProductDto: UpdateProductDto): Product {
    const productIndex = this.products.findIndex((p) => p.id === id);
    if (productIndex === -1) {
      throw new NotFoundException(`Produit avec l'ID ${id} non trouvé`);
    }
    this.products[productIndex] = {
      ...this.products[productIndex],
      ...updateProductDto,
      updatedAt: new Date(),
    };
    return this.products[productIndex];
  }

  // Supprimer un produit
  remove(id: number): Product {
    const productIndex = this.products.findIndex((p) => p.id === id);
    if (productIndex === -1) {
      throw new NotFoundException(`Produit avec l'ID ${id} non trouvé`);
    }
    const product = this.products.splice(productIndex, 1)[0];
    return product;
  }
}
