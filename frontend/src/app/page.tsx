import {PostType} from "@/resources/Post";
import {getPosts} from "@/api/getPosts";
import Link from "next/link";
import {getProjects} from "@/api/getProjects";
import {ProjectType} from "@/resources/Project";
import ChadImage from "../../public/chad-no-circle.png"
import NeumorphismCard from "@/app/_components/NeumorphismContainer";
import ExportedImage from "next-image-export-optimizer";
import {services} from "@/data/services";
import ServiceCard from "@/app/_components/ServiceCard";
import CTASection from "@/app/_components/CTASection";

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
    className="my-2 mx-auto sm:mx-0 w-fit tracking-[.1em] lg:mt-8 sm:text-2xl md:text-4xl lg:text-8xl">Hi! I&apos;m Chad.</h2>
  const subhead = <h3
    className="w-fit mx-auto sm:mx-0 tracking-[.1em] my-1 text-highlight/[.9] sm:text-xl md:text-2xl lg:text-4xl">I help small businesses grow online.
  </h3>
  const visual = <div className="p-20 relative"><ExportedImage alt="Chad Furman" src={ChadImage} fill
                                                               className="object-contain"/></div>
  const cta = <p className="text-center sm:text-left leading-6">
    Fast, secure WordPress sites. Smart email marketing. E-commerce that converts.
    I handle the tech so you can focus on your business.
    <br/>
    <Link href="/services" className="link-styles">See My Services &gt;&gt;</Link>
  </p>
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

function ServiceHighlights() {
  return (
    <section>
      <h2>What I Do</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 my-8">
        {services.map((service) => (
          <ServiceCard key={service.id} service={service} variant="summary"/>
        ))}
      </div>
    </section>
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
    <Link href={`/projects/${props.project.slug}`}>
      <NeumorphismCard className="p-4 min-w-72">
        {title}
        {description}
        {visual}
        {cta}
      </NeumorphismCard>
    </Link>
  );
}

async function FeaturedProjects() {
  const header = <h2>What I&apos;ve Built</h2>
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

export default async function Home() {
  return (
    <div className="">
      <Hero/>
      <ServiceHighlights/>
      <FeaturedProjects/>
      <BlogHighlights/>
      <CTASection
        headline="Ready to grow your business?"
        description="Let's talk about what you need — whether it's a new WordPress site, better SEO, or email marketing that actually converts."
        linkText="Contact Me"
        linkHref="/contact"
      />
    </div>
  );
}
