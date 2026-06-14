import {
  profile,
  experience,
  earlierRoles,
  education,
  projects,
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

  // Experience
  lines.push("== EXPERIENCE ==");
  for (const job of experience) {
    lines.push(`${job.role} at ${job.company} (${job.period})`);
    lines.push(`  ${job.detail}`);
    lines.push(`  Skills: ${job.tags.join(", ")}`);
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

  // Projects / Case Studies
  lines.push("== PROJECTS ==");
  for (const project of projects) {
    lines.push(`Project: ${project.title}`);
    lines.push(`  ${project.blurb}`);
    lines.push(`  Role: ${project.caseStudy.role}`);
    lines.push(`  Tagline: ${project.caseStudy.tagline}`);
    lines.push(serializeSections(project.caseStudy.sections));
    lines.push(`  Tech: ${project.caseStudy.tech.join(", ")}`);
    lines.push("");
  }

  return lines.join("\n");
}
