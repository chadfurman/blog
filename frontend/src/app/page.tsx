import {PostType} from "@/resources/Post";
import {getPosts} from "@/api/getPosts";
import Link from "next/link";
import Image from "next/image";
import {getProjects} from "@/api/getProjects";
import {ProjectType} from "@/resources/Project";
import ChadImage from "../../public/chad-no-circle.png"

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
  const headline = <h2
    className="my-2 mx-auto sm:mx-0 w-fit tracking-[.1em] lg:mt-8 sm:text-2xl md:text-4xl lg:text-8xl">Hi!</h2>
  const subhead = <h3
    className="w-fit mx-auto sm:mx-0 tracking-[.1em] my-1 text-highlight/[.9] sm:text-xl md:text-2xl lg:text-4xl">Welcome,
    traveler
  </h3>
  const visual = <div className="p-20 relative"><Image alt="Chad Furman" src={ChadImage} fill
                                                       className="object-contain"/></div>
  const cta = <p className="text-center sm:text-left leading-4">This is a place where I talk about my projects.</p>
  return (
    <div className="sm:h-[30rem] lg:h-[40rem] grid grid-cols-2  grid-flow-dense">
      <div className="my-auto col-start-2 sm:pl-16 md:pl-32 lg:pl-48">
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
      <ul className="overflow-x-scroll flex  flex-">{projects}</ul>
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
