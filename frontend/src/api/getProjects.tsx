import {ProjectDTO, ProjectType} from "@/resources/Project";
import {StrapiCollectionResponseType} from "@/resources/StrapiCollectionResponseType";
import {StrapiSingleResponseType} from "@/resources/StrapiSingleResponseType";
import {stringify} from "qs";
import {StrapiGetParams, StrapiGetParamsType} from "@/api/strapiGetParams";

export async function getProjects(params?: StrapiGetParamsType): Promise<ProjectType[]> {
  if (params) {
    params = StrapiGetParams.parse(params);
  }
  const query = stringify(params);
  const response = await fetch(`${process.env.STRAPI_API}/projects${query ? `?${query}` : ''}`);
  const results = ((await response.json()) as StrapiCollectionResponseType)?.data
  let parsedResults: ProjectType[] = [];
  if (results) {
    parsedResults = results.map((project: StrapiSingleResponseType) => {
        return ProjectDTO.parse(project);
      });
  }
  return parsedResults || [];
}