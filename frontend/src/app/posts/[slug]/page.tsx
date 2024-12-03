import {BlockType} from "@/resources/Block";
import remarkGfm from 'remark-gfm'
import {SharedRichTextComponentType} from "@/resources/SharedRichTextComponent";
import {MDXRemote} from "next-mdx-remote/rsc";
import {getPosts} from "@/api/getPosts";
import {getMDXComponents} from "@/mdx-components";

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
      <MDXRemote options={{mdxOptions: {remarkPlugins: [remarkGfm]}}} source={props.block.body}
                 components={getMDXComponents()}/>
    </div>
  )
}

function PostBlock(props: { block: BlockType }) {
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
  const posts = await getPosts();
  return posts.map(post => ({
    slug: post.slug
  }));
}

interface PageProps {
  params: Promise<{ slug: string }>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function Page({params}: PageProps) {
  const slug = (await params).slug;
  const post = (await getPosts({
    filters: {slug: slug},
    populate: "blocks",
  }))[0];
  const blocks = post.blocks?.map((block: BlockType) => {
    return <PostBlock key={block.id} block={block}/>;
  });
  return (
    <div className="p-4">
      <h1>{post.title}</h1>
      <p>{post.description}</p>
      {blocks}
    </div>
  );
}