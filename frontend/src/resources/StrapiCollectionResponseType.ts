import {z} from "zod";

export const StrapiCollectionResponseDTO = z.object({
  data: z.array(z.any()),
  meta: z.object({
    pagination: z.object({
      page: z.number(),
      pageSize: z.number(),
      pageCount: z.number(),
      total: z.number(),
    }),
  }),
})
export type StrapiCollectionResponseType = z.infer<typeof StrapiCollectionResponseDTO>;
