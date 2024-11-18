import {z} from "zod";

export const FileDTO = z.object({
  id: z.number(),
  documentId: z.string(),
  name: z.string(),
  alternativeText: z.string(),
  caption: z.string(),
  width: z.number().int(),
  height: z.number().int(),
  formats: z.any(),
  hash: z.string(),
  ext: z.string(),
  mime: z.string(),
  size: z.number(),
  url: z.string(),
  previewUrl: z.string(),
  provider: z.string(),
  provider_metadata: z.any(),
  related: z.array(
    z.object({
      id: z.number(),
      documentId: z.string(),
    })
  ),
  folder: z.object({
    id: z.number(),
    documentId: z.string(),
  }),
  folderPath: z.string(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  publishedAt: z.string().datetime(),
  createdBy: z.object({
    id: z.number(),
    documentId: z.string(),
  }),
  updatedBy: z.object({
    id: z.number(),
    documentId: z.string(),
  }),
  locale: z.string(),
  localizations: z.array(
    z.object({
      id: z.number(),
      documentId: z.string(),
    })
  ),
})

export type FileType = z.infer<typeof FileDTO>;