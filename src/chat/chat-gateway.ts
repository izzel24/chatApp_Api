import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Socket, Server } from 'socket.io';


@WebSocketGateway(3002, { cors: 'http://localhost:5173' })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;
  handleConnection(client: Socket) {
    console.log('connected', client.id);
  }

  @SubscribeMessage('join')
  handleJoin(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { userId: number },
  ) {
    client.join(`user:${data.userId}`);
    console.log(`user ${data.userId} joined `);
  }

  @SubscribeMessage('typing')
  handleTyping(@MessageBody() data: { senderId: number; receiverId: number }) {
    this.server
      .to(`user:${data.receiverId}`)
      .emit('typing', { userId: data.senderId });
    console.log('typingg...');
  }

  @SubscribeMessage('stopTyping')
  handleStopTyping(
    @MessageBody()
    data: {
      senderId: number;
      receiverId: number;
    },
  ) {
    this.server.to(`user:${data.receiverId}`).emit('stopTyping', {
      userId: data.senderId,
    });
  }

  @SubscribeMessage('sendMessage')
  handleNewMessage(
    client: Socket,
    @MessageBody() message: {senderId: number; receiverId: number; content: string },
  ) {
    console.log(message);
    this.server.to(`user:${message.receiverId}`).emit('sendMessage', message);
    console.log(message.receiverId);
    
    const room = `user:${message.receiverId}`;

  const sockets = this.server.sockets.adapter.rooms.get(room);

  console.log('ROOM:', room);
  console.log('SOCKETS IN ROOM:', sockets);
  }
  handleDisconnect(client: Socket) {
    console.log('disconnect', client.id);
  }
}
