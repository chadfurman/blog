import {z} from "zod";
import {BlockDTO} from "@/resources/Block";

export const PostDTO  = z.object({
  id: z.number(),
  documentId: z.string(),
  title: z.string(),
  description: z.string(),
  slug: z.string(),
  publishedAt: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),

  // relationships
  author: z.any().optional(),
  category: z.any().optional(),
  tags: z.any().optional(),
  comments: z.any().optional(),
  blocks: z.array(BlockDTO).optional()
})
export type PostType = z.infer<typeof PostDTO>;

