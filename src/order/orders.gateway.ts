import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { Order } from '../database/models/order.model';

@WebSocketGateway()
export class OrdersGateway {
  @WebSocketServer()
  server: Server;

  notifyOrderUpdate(order: Order) {
    this.server.emit('orderUpdated', order);
  }
}
