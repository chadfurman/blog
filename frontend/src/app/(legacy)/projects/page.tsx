import Link from 'next/link'
import {getProjects} from "@/api/getProjects";
import {ProjectType} from "@/resources/Project";
import Card from "@/app/_components/Card";

function Project(props: { project: ProjectType }) {
  const {project} = props;
  return (
    <li>
      <Link href={`/projects/${project.slug}`}>
        <Card>
          <h2>{project.title}</h2>
          <p>{project.description}</p>
          <p className="link-styles">View Project &gt;&gt;</p>
        </Card>
      </Link>
    </li>
  )
}

async function ProjectList() {
  const projects = await getProjects();
  return (
    <ul>
      {projects.map(project => <Project key={project.id} project={project}/>)}
    </ul>
  )
}

export default async function Page() {
  return (
    <div className="px-4 sm:px-6 lg:px-8 max-w-screen-xl mx-auto">
      <h1>My Projects</h1>
      <ProjectList></ProjectList>
    </div>
  )
}