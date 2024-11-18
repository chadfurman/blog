/**
 * SharedRichTextComponent{
 * id	number
 * __component	string
 * Enum:
 * [ shared.rich-text ]
 * body	string
 * }
 */
import {z} from "zod";

export const SharedRichTextComponentDTO = z.object({
  id: z.number(),
  __component: z.literal("shared.rich-text"),
  body: z.string(),
});
export type SharedRichTextComponentType = z.infer<typeof SharedRichTextComponentDTO>;