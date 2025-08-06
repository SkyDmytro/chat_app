import { z } from 'zod';

export const SendMessageDtoSchema = z.object({
  chatId: z.number(),
  content: z.string(),
  type: z.enum(['text', 'image']).optional().default('text'),
});

export type SendMessageDto = z.infer<typeof SendMessageDtoSchema>;
