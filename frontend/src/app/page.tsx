import {PostType} from "@/resources/Post";
import {getPosts} from "@/api/getPosts";
import Link from "next/link";
import Image from "next/image";
import {getProjects} from "@/api/getProjects";
import {ProjectType} from "@/resources/Project";
import ChadImage from "../../public/chad.png"

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
      </li>
    );
  });

  return <ul>{postListItems}</ul>;
}

function Hero() {
  const headline = <h2>Headline</h2>
  const subhead = <h3>Subheadline</h3>
  const visual = <div className="p-20 relative"><Image alt="Chad Furman" src={ChadImage} fill
                                                       className="object-contain"/></div>
  const cta = <p>do the thing</p>
  return (
    <div className="sm:h-[30rem] lg:h-[40rem] grid grid-rows-2 sm:grid-rows-1 sm:grid-cols-2  grid-flow-dense">
      <div className="row-start-2 sm:col-start-2 sm:row-start-1">
        {headline}
        {subhead}
        {cta}
      </div>
      {visual}
    </div>
  );
}

function FeaturedProject(props: { project: ProjectType }) {
  const title = <h3>props.project.title</h3>
  const description = <p>props.project.description</p>
  const visual = <Image src={props.project.cover.url} width={props.project.cover.width}
                        height={props.project.cover.height} alt={props.project.title} className="max-w-full"/>
  const cta = <Link href={`/projects/${props.project.slug}`}>View Project</Link>
  return (
    <div className="w-1/3">
      {title}
      {description}
      {visual}
      {cta}
    </div>
  );
}

async function FeaturedProjects() {
  const header = <h2>What I&apos;m Building</h2>
  const projects = (await getProjects({})).map((project: ProjectType) =>
    <li key={project.id}><FeaturedProject project={project}/></li>
  )

  return (
    <>
      {header}
      <ul>{projects}</ul>
    </>
  );
}

async function BlogHighlights() {
  const header = <h2>Blog Highlights</h2>
  const posts = (await getPosts({pagination: {limit: 10}})).map((post: PostType) => {
    return (
      <li key={post.id}>
        <Link href={`/posts/${post.slug}`}>
          <Post post={post}/>
        </Link>
      </li>
    );
  });
  return (
    <>
      {header}
      <ul>{posts}</ul>
    </>

  );
}

function AboutMe() {
  return null;
}

function NewsletterSignup() {
  return null;
}

export default async function Home() {
  return (
    <div className="">
      <Hero/>
      <FeaturedProjects/>
      <BlogHighlights/>
      <AboutMe/>
      <NewsletterSignup/>
      <PostList/>
    </div>
  );
}
