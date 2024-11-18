/**
 * id	number
 * documentId	string
 * name	string
 * avatar	{
 * id	[...]
 * documentId	[...]
 * name	[...]
 * alternativeText	[...]
 * caption	[...]
 * width	[...]
 * height	[...]
 * formats	{...}
 * hash	[...]
 * ext	[...]
 * mime	[...]
 * size	[...]
 * url	[...]
 * previewUrl	[...]
 * provider	[...]
 * provider_metadata	{...}
 * related	[...]
 * folder	{...}
 * folderPath	[...]
 * createdAt	[...]
 * updatedAt	[...]
 * publishedAt	[...]
 * createdBy	{...}
 * updatedBy	{...}
 * locale	[...]
 * localizations	[...]
 * }
 * email	string
 * articles	[{
 * id	[...]
 * documentId	[...]
 * title	[...]
 * description	[...]
 * slug	[...]
 * cover	{...}
 * author	{...}
 * category	{...}
 * blocks	[...]
 * tags	[...]
 * createdAt	[...]
 * updatedAt	[...]
 * publishedAt	[...]
 * createdBy	{...}
 * updatedBy	{...}
 * locale	[...]
 * localizations	[...]
 * }]
 * createdAt	string($date-time)
 * updatedAt	string($date-time)
 * publishedAt	string($date-time)
 * createdBy	{
 * id	[...]
 * documentId	[...]
 * }
 * updatedBy	{
 * id	[...]
 * documentId	[...]
 * }
 * locale	string
 * localizations	[{
 * id	[...]
 * documentId	[...]
 * }]
 * }
 */

import {z} from "zod";
import {FileDTO} from "@/resources/File";
import {PostDTO} from "@/resources/Post";

export const AuthorDTO = z.object({
  id: z.number(),
  documentId: z.string(),
  name: z.string(),
  avatar: FileDTO,
  email: z.string(),
  articles: z.array(PostDTO),
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
  )
});
export type AuthorType = z.infer<typeof AuthorDTO>;