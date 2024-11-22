import {z} from "zod";
import {FileDTO} from "@/resources/File";

export const ProjectDTO  = z.object({
  id: z.number(),
  documentId: z.string(),
  title: z.string(),
  description: z.string(),
  slug: z.string(),
  publishedAt: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),

  // relationships
  cover: FileDTO
})
export type ProjectType = z.infer<typeof ProjectDTO>;

