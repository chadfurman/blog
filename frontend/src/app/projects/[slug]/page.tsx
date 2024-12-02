import {getProjects} from "@/api/getProjects";
import Link from "next/link";
import {PostType} from "@/resources/Post";
import NeumorphismContainer from "@/app/_components/NeumorphismContainer";

export async function generateStaticParams() {
  const projects = await getProjects();
  return projects.map(project => ({
    slug: project.slug
  }));
}

interface PageProps {
  params: Promise<{ slug: string }>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function Page({params}: PageProps) {
  const slug = (await params).slug;
  const project = (await getProjects({
    filters: {slug: slug},
    populate: ["articles"],
  }))[0];

  return (
    <div className="p-4">
      <h1>{project.title}</h1>
      <p>{project.description}</p>
      <hr/>
      <h2>Posts</h2>
      <ul>
        {project.articles?.map((article: PostType) => {
          return (
            <li key={article.id}>
              <NeumorphismContainer>
                <Link href={`/posts/${article.slug}`}>
                  <h3>{article.title}</h3>
                  <p>{article.description}</p>
                  <p className="link-styles">View Post &gt;&gt;</p>
                </Link>
              </NeumorphismContainer>
            </li>
          );
        })}
      </ul>
    </div>
  );
}