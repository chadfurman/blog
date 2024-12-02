import Link from 'next/link'
import {getPosts} from "@/api/getPosts";
import {PostType} from "@/resources/Post";
import NeumorphismContainer from "@/app/_components/NeumorphismContainer";

function Post(props: { post: PostType }) {
  const {post} = props;
  return (
    <li>
      <Link href={`/posts/${post.slug}`}>
        <NeumorphismContainer>
          <h2>{post.title}</h2>
          <p>{post.description}</p>
          <p className="link-styles">View Post &gt;&gt;</p>
        </NeumorphismContainer>
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
    <>
      <h1>My Posts</h1>
      <PostList></PostList>
    </>
  )
}