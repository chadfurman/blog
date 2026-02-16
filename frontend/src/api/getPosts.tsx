import {PostDTO, PostType} from "@/resources/Post";
import {StrapiCollectionResponseType} from "@/resources/StrapiCollectionResponseType";
import {StrapiSingleResponseType} from "@/resources/StrapiSingleResponseType";
import {stringify} from "qs";
import {StrapiGetParams, StrapiGetParamsType} from "@/api/strapiGetParams";

export async function getPosts(params?: StrapiGetParamsType): Promise<PostType[]> {
  if (!process.env.STRAPI_API) return [];
  try {
    if (params) {
      params = StrapiGetParams.parse(params);
    }
    const query = stringify(params);
    const response = await fetch(`${process.env.STRAPI_API}/articles${query ? `?${query}` : ''}`);
    const results = ((await response.json()) as StrapiCollectionResponseType)?.data
    let parsedResults: PostType[] = [];
    if (results) {
      parsedResults = results.map((post: StrapiSingleResponseType) => {
          return PostDTO.parse(post);
        });
    }
    return parsedResults || [];
  } catch {
    return [];
  }
}