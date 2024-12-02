import {PostType} from "@/resources/Post";
import {getPosts} from "@/api/getPosts";
import Link from "next/link";
import {getProjects} from "@/api/getProjects";
import {ProjectType} from "@/resources/Project";
import ChadImage from "../../public/chad-no-circle.png"
import NeumorphismCard from "@/app/_components/NeumorphismContainer";
import ExportedImage from "next-image-export-optimizer";

function Post(props: { post: PostType }) {
  const {post} = props;
  const cta = <p className="link-styles">View Post &gt;&gt;</p>
  return (
    <NeumorphismCard className="p-4 min-w-72">
      <h2>{post.title}</h2>
      <p>{post.description}</p>
      {cta}
    </NeumorphismCard>
  );
}

function Hero() {
  const headline = <h2
    className="my-2 mx-auto sm:mx-0 w-fit tracking-[.1em] lg:mt-8 sm:text-2xl md:text-4xl lg:text-8xl">Hi!</h2>
  const subhead = <h3
    className="w-fit mx-auto sm:mx-0 tracking-[.1em] my-1 text-highlight/[.9] sm:text-xl md:text-2xl lg:text-4xl">Welcome,
    traveler
  </h3>
  const visual = <div className="p-20 relative"><ExportedImage alt="Chad Furman" src={ChadImage} fill
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
  const title = <h2>{props.project.title}</h2>
  const description = <p>{props.project.description}</p>
  const visual = props.project?.cover ? (<ExportedImage src={props.project.cover.url} width={props.project.cover.width}
                                                        height={props.project.cover.height} alt={props.project.title}
                                                        className="max-w-full"/>) : null;
  const cta = <p className="link-styles">View Project &gt;&gt;</p>
  return (
    <NeumorphismCard className="p-4 min-w-72">
      <Link href={`/projects/${props.project.slug}`}>
        {title}
        {description}
        {visual}
        {cta}
      </Link>
    </NeumorphismCard>
  );
}

async function FeaturedProjects() {
  const header = <h2>What I&apos;m Building</h2>
  const projects = (await getProjects({})).map((project: ProjectType) =>
    <li key={project.id} className="snap-center"><FeaturedProject project={project}/></li>
  )

  return <HorizontalScrollList header={header}>{projects}</HorizontalScrollList>;
}

async function BlogHighlights() {
  const header = <h2>Blog Highlights</h2>
  const posts = (await getPosts({pagination: {limit: 10}})).map((post: PostType) => {
    return (
      <li key={post.id} className="snap-center">
        <Link href={`/posts/${post.slug}`}>
          <Post post={post}/>
        </Link>
      </li>
    );
  });
  return <HorizontalScrollList header={header}>{posts}</HorizontalScrollList>;
}

function HorizontalScrollList(props: { header: React.ReactNode, children: React.ReactNode }) {
  const header = props.header;
  return (<>
    {header}
    <ul
      className="grid grid-rows-1 grid-flow-col gap-8 overflow-x-auto overflow-y-hidden overscroll-x-auto scroll-mx-4 snap-x snap-mandatory p-8">{props.children}</ul>
  </>)

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
    </div>
  );
}
