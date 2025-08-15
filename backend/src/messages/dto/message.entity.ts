export class MessageEntity {
  type: 'image' | 'text' = 'text';

  content: string;

  senderId: number;

  chatId: number;
}
