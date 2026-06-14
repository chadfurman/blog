import {
  profile,
  experience,
  earlierRoles,
  education,
  projects,
  softSkills,
} from "../../frontend/src/data/portfolio.js";

function serializeSections(
  sections: { heading: string; body?: string; bullets?: string[] }[]
): string {
  return sections
    .map((s) => {
      const parts = [`  ${s.heading}:`];
      if (s.body) parts.push(`    ${s.body}`);
      if (s.bullets) parts.push(...s.bullets.map((b) => `    - ${b}`));
      return parts.join("\n");
    })
    .join("\n");
}

export function buildCorpus(): string {
  const lines: string[] = [];

  // Profile
  lines.push(`Name: ${profile.name}`);
  lines.push(`Title: ${profile.title}`);
  lines.push(`Location: ${profile.location}`);
  lines.push(`Tagline: ${profile.tagline}`);
  lines.push(`Email: ${profile.email}`);
  lines.push(`GitHub: ${profile.github}`);
  lines.push(`LinkedIn: ${profile.linkedin}`);
  lines.push("");

  // Helper: emit a project's case-study summary under whatever heading.
  const emitProject = (project: (typeof projects)[number]) => {
    lines.push(`  Project — ${project.title}: ${project.caseStudy.tagline}`);
    lines.push(`    ${project.blurb}`);
    lines.push(serializeSections(project.caseStudy.sections));
    lines.push(`    Tech: ${project.caseStudy.tech.join(", ")}`);
    lines.push(`    Case study page: /case-studies/${project.slug}`);
  };

  // Experience — everything tied to the specific role it came out of. Each job
  // carries its own detail, tech, accomplishments, and projects.
  lines.push("== EXPERIENCE (most recent first; projects are grouped under the role they came from) ==");
  for (const job of experience) {
    lines.push(`### ${job.role} at ${job.company} (${job.period})`);
    lines.push(`  ${job.detail}`);
    lines.push(`  Skills: ${job.tags.join(", ")}`);
    if (job.deepDive?.tech) lines.push(`  Tech & tools: ${job.deepDive.tech.join(", ")}`);
    if (job.deepDive?.notes) {
      for (const note of job.deepDive.notes) lines.push(`  - ${note}`);
    }
    for (const project of projects.filter((p) => p.company === job.company)) {
      emitProject(project);
    }
    lines.push("");
  }

  // Earlier roles
  lines.push("== EARLIER ROLES ==");
  for (const role of earlierRoles) {
    lines.push(`${role.role} at ${role.company} (${role.period})`);
    lines.push(`  ${role.detail}`);
    lines.push("");
  }

  // Education
  lines.push("== EDUCATION ==");
  for (const edu of education) {
    lines.push(`${edu.degree} — ${edu.school} (${edu.period})`);
  }
  lines.push("");

  // Independent / side projects — not tied to a specific employer.
  const jobCompanies = new Set(experience.map((j) => j.company));
  const sideProjects = projects.filter((p) => !p.company || !jobCompanies.has(p.company));
  if (sideProjects.length > 0) {
    lines.push("== OTHER PROJECTS (independent / side projects) ==");
    for (const project of sideProjects) {
      lines.push(`${project.caseStudy.role}`);
      emitProject(project);
      lines.push("");
    }
  }

  // Strengths & leadership — generalized, no confidential specifics; observed
  // across roles, primarily in his engineering-management work.
  lines.push("== STRENGTHS & LEADERSHIP (across roles, primarily as an engineering manager) ==");
  for (const skill of softSkills) lines.push(`- ${skill}`);
  lines.push("");

  return lines.join("\n");
}
