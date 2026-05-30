import {getProjects} from "@/api/getProjects";
import Link from "next/link";
import {PostType} from "@/resources/Post";
import Card from "@/app/_components/Card";
import {notFound} from "next/navigation";

export async function generateStaticParams() {
  const projects = await getProjects();
  if (projects.length === 0) {
    return [{ slug: "_placeholder" }];
  }
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
  const projects = await getProjects({
    filters: {slug: slug},
    populate: ["articles"],
  });
  const project = projects[0];

  if (!project) {
    notFound();
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 max-w-screen-xl mx-auto">
      <h1>{project.title}</h1>
      <p>{project.description}</p>
      <hr/>
      <h2>Posts</h2>
      <ul>
        {project.articles?.map((article: PostType) => {
          return (
            <li key={article.id}>
              <Link href={`/posts/${article.slug}`}>
                <Card>
                  <h3>{article.title}</h3>
                  <p>{article.description}</p>
                  <p className="link-styles">View Post &gt;&gt;</p>
                </Card>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}