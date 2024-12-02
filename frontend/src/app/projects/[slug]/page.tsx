import {BlockType} from "@/resources/Block";
import {SharedRichTextComponentType} from "@/resources/SharedRichTextComponent";
import {MDXRemote} from "next-mdx-remote/rsc";
import {getProjects} from "@/api/getProjects";
import {getMDXComponents} from "@/mdx-components";
import Link from "next/link";
import {PostType} from "@/resources/Post";
import NeumorphismContainer from "@/app/_components/NeumorphismContainer";

function SharedMediaBlock() {
  return (
    <div>
      SharedMediaBlock not supported yet!
    </div>
  )
}

function SharedQuoteBlock() {
  return (
    <div>
      SharedQuoteBlock not supported yet!
    </div>
  )
}

async function SharedRichTextBlock(props: { block: SharedRichTextComponentType }) {
  return (
    <div>
      <MDXRemote source={props.block.body} components={getMDXComponents()}/>
    </div>
  )
}

function ProjectBlock(props: { block: BlockType }) {
  switch (props.block.__component) {
    case "shared.media":
      return <SharedMediaBlock/>;
    case "shared.quote":
      return <SharedQuoteBlock/>;
    case "shared.rich-text":
      return <SharedRichTextBlock block={props.block}/>;
    default:
      return null;
  }
}

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
  // const blocks = project.blocks?.map((block: BlockType) => {
  //   return <ProjectBlock key={block.id} block={block}/>;
  // });
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