// Real résumé content for the Applied AI & SRE portfolio.
// Timeline/dates corroborated 2026-05-30 from LinkedIn + getprog.ai; do not invent claims here.

export const profile = {
  name: "Chad Furman",
  title: "Engineering Manager | Applied AI & SRE",
  availability: "Available for Technical Leadership",
  tagline:
    "Building scalable infrastructure and agentic AI products. Specialized in bridging the gap between robust systems engineering and cutting-edge intelligence.",
  location: "South Hadley, Massachusetts",
  email: "chad@chadfurman.com",
  github: "https://github.com/chadfurman",
  linkedin: "https://linkedin.com/in/chadfurman",
} as const;

// Marquee of technologies under the hero.
export const techTicker = [
  "Kubernetes", "Terraform", "OpenAI", "PyTorch", "Rust", "Go", "SRE",
  "Reliability", "Scale", "Neural Nets", "Agentic Workflows",
  "Distributed Systems", "Emmy Winning Tech",
] as const;

export type Experience = {
  company: string;
  role: string;
  detail: string;
  period: string;
  current?: boolean;
  tags: string[];
};

export const experience: Experience[] = [
  {
    company: "FOSSA",
    role: "Engineering Manager",
    detail:
      "Applied AI & SRE. Spearheaded AI adoption across the company and led the Applied AI team from prototype to public beta. Product owner of fossabot (New Horizons), an agentic framework for automated dependency updates and vulnerability remediation. Founded and manage the SRE team; modernized cloud infrastructure by migrating from kops to EKS.",
    period: "Oct 2024 — Present",
    current: true,
    tags: ["LLMs", "Agentic AI", "SRE", "Kubernetes", "EKS"],
  },
  {
    company: "Klaviyo",
    role: "Senior Software Engineer",
    detail:
      "Core platform engineering for marketing-automation infrastructure operating at massive scale. Built and optimized high-throughput data pipelines and the reliability of systems behind millions of customer interactions.",
    period: "Jan 2021 — Mar 2024",
    tags: ["Python", "Distributed Systems", "Scale"],
  },
  {
    company: "Clevertech",
    role: "Technical Lead",
    detail:
      "Led the engineering of Evercast, a real-time WebRTC collaboration platform for film and TV production used by major studios. The work helped raise $4M and earned an Engineering Emmy® for delivering 4K/60fps, 10-bit 4:4:4 color and 7.1 surround over the web. Championed JSON:API standards across the org.",
    period: "Jul 2016 — Jan 2021",
    tags: ["WebRTC", "Real-time Video", "Engineering Emmy"],
  },
];

export type Project = {
  title: string;
  blurb: string;
  image: string;
  imageAlt: string;
  tags: { label: string; tone: "primary" | "secondary" }[];
  cta: string;
  href?: string;
  feature?: boolean; // large bento cell
};

export const projects: Project[] = [
  {
    title: "fossabot (New Horizons AI)",
    blurb:
      "An industry-first agentic AI framework for automated dependency updates and vulnerability remediation. fossabot uses deep, code-aware analysis to verify impact, suggest fixes, and automate migrations — saving engineering teams weeks of triage.",
    image: "/projects/fossabot.png",
    imageAlt:
      "Dark AI dashboard with neural-network graphs and real-time compliance metrics in deep navy and glowing blue tones.",
    tags: [
      { label: "FOSSA", tone: "primary" },
      { label: "Applied AI", tone: "secondary" },
    ],
    cta: "Project Case Study",
    feature: true,
  },
  {
    title: "Evercast — WebRTC for Hollywood",
    blurb:
      "The real-time creative-collaboration platform used by major studios. Led the engineering of the core WebRTC streaming engine delivering 4K/60fps, 10-bit 4:4:4 color precision and 7.1 surround sound — earning an Engineering Emmy®.",
    image: "/projects/evercast.png",
    imageAlt:
      "High-speed data visualized as glowing light paths through optical fibers in a dark server room, tech-blue and cyan hues.",
    tags: [{ label: "Engineering Emmy®", tone: "secondary" }],
    cta: "Technical Details",
  },
];

export type SkillGroup = { icon: string; title: string; skills: string[] };

export const skillGroups: SkillGroup[] = [
  {
    icon: "psychology",
    title: "AI Engineering",
    skills: ["LLM Orchestration", "RAG Systems", "Agentic Workflows", "PyTorch", "OpenAI"],
  },
  {
    icon: "cloud_done",
    title: "SRE & Infrastructure",
    skills: ["Kubernetes", "Terraform", "AWS / GCP", "CI/CD Pipelines", "EKS"],
  },
  {
    icon: "layers",
    title: "Full-Stack Dev",
    skills: ["Go", "Rust", "React / Next.js", "PostgreSQL", "WebRTC"],
  },
];

export const navLinks = [
  { label: "Home", href: "#top" },
  { label: "Experience", href: "#experience" },
  { label: "Projects", href: "#projects" },
  { label: "Contact", href: "#contact" },
] as const;
