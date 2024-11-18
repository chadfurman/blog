import {z} from "zod";

export const SharedQuoteComponentDTO = z.object({
  id: z.number(),
  __component: z.literal("shared.quote"),
  title: z.string(),
  body: z.string(),
});
export type SharedQuoteComponentType = z.infer<typeof SharedQuoteComponentDTO>;