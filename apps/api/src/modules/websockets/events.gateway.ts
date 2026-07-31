import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class EventsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);

    // For Sprint 3, clients can specify their organization or branch in query params to join rooms
    const branchId = client.handshake.query.branchId as string;
    if (branchId) {
      client.join(`branch_${branchId}`);
      console.log(`Client ${client.id} joined room branch_${branchId}`);
    }
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  // Helper method to emit events to a specific branch room
  emitToBranch(branchId: string, eventName: string, payload: any) {
    this.server.to(`branch_${branchId}`).emit(eventName, payload);
  }
}
