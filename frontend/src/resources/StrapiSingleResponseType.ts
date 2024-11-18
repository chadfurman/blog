import {z} from "zod";

export const StrapiSingleResponseDTO = z.object({
  data: z.any(),
})
export type StrapiSingleResponseType = z.infer<typeof StrapiSingleResponseDTO>;
