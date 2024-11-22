import {z} from "zod";

export const StrapiGetParams = z.object({
  pagination: z.object({
    page: z.number().optional(),
    pageSize: z.number().optional(),
    withCount: z.boolean().optional(),
    start: z.number().optional(),
    limit: z.number().optional(),
  }).optional(),
  filters: z.object({}).optional(),
  sort: z.string().optional(),
  populate: z.string().optional(),
  fields: z.string().optional(),
  locale: z.string().optional()
})
export type StrapiGetParamsType = z.infer<typeof StrapiGetParams>;