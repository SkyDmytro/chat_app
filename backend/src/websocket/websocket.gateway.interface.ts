import { Socket, Server } from 'socket.io';
import { SendMessageDto } from './dto/sendMessage.dto';
import { UserWithoutPassword } from 'src/authentication/types/userWithoutPassword';

export interface IWebsocketService {
  parseAndValidateMessage(data: string, client: Socket): SendMessageDto;
  getUserFromClient(client: Socket): UserWithoutPassword;
  parseChatId(chatIdRaw: string | number, client: Socket): number;
  assertUserInChat(
    chatId: number,
    userId: number,
    client: Socket,
  ): Promise<void>;
  createAndEmitMessage(
    chatId: number,
    parsedData: SendMessageDto,
    user: UserWithoutPassword,
    server: Server,
  ): Promise<void>;
}
