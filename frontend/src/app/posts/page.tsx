import Link from 'next/link'
import {getPosts} from "@/api/getPosts";
import {PostType} from "@/resources/Post";
import Card from "@/app/_components/Card";

function Post(props: { post: PostType }) {
  const {post} = props;
  return (
    <li>
      <Link href={`/posts/${post.slug}`}>
        <Card>
          <h2>{post.title}</h2>
          <p>{post.description}</p>
          <p className="link-styles">View Post &gt;&gt;</p>
        </Card>
      </Link>
    </li>
  )
}

async function PostList() {
  const posts = await getPosts();
  return (
    <ul>
      {posts.map(post => <Post key={post.id} post={post}/>)}
    </ul>
  )
}

export default async function Page() {
  return (
    <div className="px-4 sm:px-6 lg:px-8 max-w-screen-xl mx-auto">
      <h1>My Posts</h1>
      <PostList></PostList>
    </div>
  )
}