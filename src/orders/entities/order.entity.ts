export interface Order {
    id: number;
    userId: number;
    productId: number;
    quantity: number;
    status: string;
    createdAt: Date;
    updatedAt?: Date;
  }
  