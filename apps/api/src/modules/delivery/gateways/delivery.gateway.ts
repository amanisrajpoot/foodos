import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';

@WebSocketGateway({
  cors: { origin: '*' },
  namespace: '/delivery',
})
export class DeliveryGateway {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(DeliveryGateway.name);

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('subscribeToBranch')
  handleSubscribeToBranch(
    @MessageBody() data: { branchId: string },
    @ConnectedSocket() client: Socket,
  ) {
    client.join(`branch_${data.branchId}`);
    this.logger.log(`Client ${client.id} joined room branch_${data.branchId}`);
    return { event: 'subscribed', data };
  }

  @SubscribeMessage('subscribeToAssignment')
  handleSubscribeToAssignment(
    @MessageBody() data: { assignmentId: string },
    @ConnectedSocket() client: Socket,
  ) {
    client.join(`assignment_${data.assignmentId}`);
    this.logger.log(`Client ${client.id} joined room assignment_${data.assignmentId}`);
    return { event: 'subscribed', data };
  }

  // Listen to application events from DeliveryService
  @OnEvent('delivery.assignment.*')
  handleDeliveryAssignmentEvent(payload: any) {
    this.logger.log(`Broadcasting assignment event for ${payload.id}`);
    
    // Broadcast to the specific assignment room (e.g. for customer tracking or specific driver app)
    this.server.to(`assignment_${payload.id}`).emit('assignmentUpdated', payload);
    
    // Broadcast to the branch room (e.g. for the owner app map/list view)
    if (payload.branchId) {
      this.server.to(`branch_${payload.branchId}`).emit('assignmentUpdated', payload);
    }
  }
}
