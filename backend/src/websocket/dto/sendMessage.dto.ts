import { z } from 'zod';

export const SendMessageDtoSchema = z.object({
  chatId: z.number(),
  content: z.string(),
});

export type SendMessageDto = z.infer<typeof SendMessageDtoSchema>;
