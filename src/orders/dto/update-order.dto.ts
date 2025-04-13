import { PartialType } from '@nestjs/mapped-types';
import { CreateOrderDto } from './create-order.dto';

export class UpdateOrderDto extends PartialType(CreateOrderDto) {
  userId?: number;
  productId?: number;
  quantity?: number;
  status?: string;
}
