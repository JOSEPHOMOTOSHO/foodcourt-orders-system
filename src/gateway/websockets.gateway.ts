import {
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
    OnGatewayInit,
    OnGatewayConnection,
    OnGatewayDisconnect,
  } from '@nestjs/websockets';
  import { Socket, Server } from 'socket.io';
  
  @WebSocketGateway(3001, {})
  export class WebsocketsGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer() server: Server;  
    private clients: Set<Socket> = new Set();
  
    afterInit(server: Server) {
      console.log('WebSocket Gateway initialized');
    }
  
    handleConnection(client: Socket) {
      console.log(`Client connected: ${client.id}`);
      this.clients.add(client); 
    }
  
    handleDisconnect(client: Socket) {
      console.log(`Client disconnected: ${client.id}`);
      this.clients.delete(client); 
    }
  
    @SubscribeMessage('messageToServer')
    handleMessage(client: Socket, payload: any): void {
      console.log(`Message from client ${client.id}: ${payload}`);
      this.server.emit('messageToClient', payload);
    }
  
    notifyOrderUpdate(order: any) {
      this.server.emit('orderUpdates', order);
    }
  }
  