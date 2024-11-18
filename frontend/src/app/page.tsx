import {PostType} from "@/resources/Post";
import {getPosts} from "@/api/getPosts";
import Link from "next/link";

function Post(props: { post: PostType }) {
  const {post} = props;
  return (
    <div className="p-4">
      <h1>{post.title}</h1>
      <p>{post.description}</p>
    </div>
  );
}

async function PostList() {
  const posts = await getPosts();

  const postListItems = posts.map((post) => {
    return (
      <li key={post.id}>
        <Link href={`/posts/${post.slug}`}>
          <Post post={post} />
        </Link>
      </li>
    );
  });

  return <ul>{postListItems}</ul>;
}

export default async function Home() {
  return (
    <div className="h-screen w-screen">
      <PostList />
    </div>
  );
}
