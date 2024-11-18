import {PostType} from "@/resources/Post";
import {BlockType} from "@/resources/Block";
import {SharedMediaComponentType} from "@/resources/SharedMediaComponent";
import {SharedQuoteComponentType} from "@/resources/SharedQuoteComponent";
import {SharedRichTextComponentType} from "@/resources/SharedRichTextComponent";
import {MDXRemote} from "next-mdx-remote/rsc";
import {getPosts} from "@/api/getPosts";

function SharedMediaBlock(props: {block: SharedMediaComponentType}) {
  return (
    <div>
      SharedMediaBlock not supported yet!
    </div>
  )
}

function SharedQuoteBlock(props: { block: SharedQuoteComponentType}) {
  return (
    <div>
      SharedQuoteBlock not supported yet!
    </div>
  )
}

async function SharedRichTextBlock(props: { block: SharedRichTextComponentType }) {
  return (
    <div>
      <MDXRemote  source={props.block.body} />
    </div>
  )
}

function PostBlock(props: { block: BlockType }) {
  switch (props.block.__component) {
    case "shared.media":
      return <SharedMediaBlock block={props.block} />;
    case "shared.quote":
      return <SharedQuoteBlock block={props.block} />;
    case "shared.rich-text":
      return <SharedRichTextBlock block={props.block} />;
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

export default async function Page(params: {
  slug: Promise<PostType>
}) {
  const slug = (await params.slug);
  const post = (await getPosts({
    filters: {slug: slug},
    populate: "blocks",
  }))[0];
  const blocks = post.blocks?.map((block: BlockType) => {
    return <PostBlock key={block.id} block={block} />;
  });
  return (
    <div className="p-4">
      <h1>{post.title}</h1>
      <p>{post.description}</p>
      {blocks}
    </div>
  );
}