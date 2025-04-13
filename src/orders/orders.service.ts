import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Order } from './entities/order.entity';

@Injectable()
export class OrdersService {
  private orders: Order[] = []; // Typage explicite avec Order[]
  private idCounter = 1;

  // Créer une commande
  create(createOrderDto: CreateOrderDto): Order {
    const order: Order = {
      id: this.idCounter++,
      ...createOrderDto,
      createdAt: new Date(),
    };
    this.orders.push(order);
    return order;
  }

  // Récupérer toutes les commandes
  findAll(): Order[] {
    return this.orders;
  }

  // Récupérer une commande par ID
  findOne(id: number): Order {
    const order = this.orders.find((o) => o.id === id);
    if (!order) {
      throw new NotFoundException(`Commande avec l'ID ${id} non trouvée`);
    }
    return order;
  }

  // Mettre à jour une commande
  update(id: number, updateOrderDto: UpdateOrderDto): Order {
    const orderIndex = this.orders.findIndex((o) => o.id === id);
    if (orderIndex === -1) {
      throw new NotFoundException(`Commande avec l'ID ${id} non trouvée`);
    }
    this.orders[orderIndex] = {
      ...this.orders[orderIndex],
      ...updateOrderDto,
      updatedAt: new Date(),
    };
    return this.orders[orderIndex];
  }

  // Annuler une commande (suppression)
  remove(id: number): Order {
    const orderIndex = this.orders.findIndex((o) => o.id === id);
    if (orderIndex === -1) {
      throw new NotFoundException(`Commande avec l'ID ${id} non trouvée`);
    }
    const order = this.orders.splice(orderIndex, 1)[0];
    return order;
  }
}
