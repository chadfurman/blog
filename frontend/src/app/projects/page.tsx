import Link from 'next/link'
import {getProjects} from "@/api/getProjects";
import {ProjectType} from "@/resources/Project";
import NeumorphismContainer from "@/app/_components/NeumorphismContainer";

function Project(props: { project: ProjectType }) {
  const {project} = props;
  return (
    <li>
      <Link href={`/projects/${project.slug}`}>
        <NeumorphismContainer>
          <h2>{project.title}</h2>
          <p>{project.description}</p>
          <p className="link-styles">View Project &gt;&gt;</p>
        </NeumorphismContainer>
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
    <>
      <h1>My Projects</h1>
      <ProjectList></ProjectList>
    </>
  )
}