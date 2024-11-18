import {PostDTO, PostType} from "@/resources/Post";
import {StrapiCollectionResponseType} from "@/resources/StrapiCollectionResponseType";
import {StrapiSingleResponseType} from "@/resources/StrapiSingleResponseType";
import {z} from "zod";
import {stringify} from "qs";

const StrapiGetParams = z.object({
  pagination: z.object({
    page: z.number(),
    pageSize: z.number(),
    withCount: z.boolean(),
    start: z.number(),
    limit: z.number(),
  }).optional(),
  filters: z.object({}).optional(),
  sort: z.string().optional(),
  populate: z.string().optional(),
  fields: z.string().optional(),
  locale: z.string().optional()
})
type StrapiGetParamsType = z.infer<typeof StrapiGetParams>;

export async function getPosts(params?: StrapiGetParamsType): Promise<PostType[]> {
  if (params) {
    params = StrapiGetParams.parse(params);
  }
  const query = stringify(params);
  const response = await fetch(`${process.env.STRAPI_API}/articles${query ? `?${query}` : ''}`);
  return ((await response.json()) as StrapiCollectionResponseType)['data'].map((post: StrapiSingleResponseType) => {
    return PostDTO.parse(post);
  });
}