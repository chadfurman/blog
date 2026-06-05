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

// Engineering creed — what good work optimizes for. Shown as a band under the hero.
export const creed = {
  label: "What I optimize for",
  points: ["Ships", "Scales", "Works", "Lasts"],
} as const;

// Marquee of technologies under the hero.
export const techTicker = [
  "Kubernetes", "Terraform", "Anthropic", "Rust", "Go", "SRE",
  "Reliability", "Scale", "Kafka", "OpenSearch", "Agentic Workflows",
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
      "Applied AI & SRE. Spearheaded AI adoption across the company and led the Applied AI team from prototype to public beta. Product owner of fossabot (New Horizons), an agentic framework for automated dependency updates and vulnerability remediation. Founded and manage the SRE team; modernized our Kubernetes platform by migrating from kops to EKS.",
    period: "Oct 2024 — Present",
    current: true,
    tags: ["Agentic AI", "AWS", "Kafka", "TypeScript", "React", "Node.js", "GraphQL", "SOC2"],
  },
  {
    company: "Klaviyo",
    role: "Senior Software Engineer",
    detail:
      "Core platform engineering for marketing-automation infrastructure handling billions of emails a day. Built and optimized high-throughput data pipelines and the reliability of distributed systems behind millions of customer interactions. A founding member of the API committee, where I championed JSON:API standards across the org.",
    period: "Jan 2021 — Mar 2024",
    tags: ["Python", "RabbitMQ", "JSON:API"],
  },
  {
    company: "Clevertech",
    role: "Technical Lead",
    detail:
      "Led the engineering of Evercast, a real-time WebRTC collaboration platform for film and TV production used by major studios. The work helped raise $4M and earned an Engineering Emmy® for delivering 4K/60fps, 10-bit 4:4:4 color and 7.1 surround over the web.",
    period: "Jul 2016 — Jan 2021",
    tags: ["Real-time Video", "Engineering Emmy", "Pentesting", "TypeScript", "Node.js", "GraphQL"],
  },
];

// Compact "earlier" roles — shown below the headline timeline, less visual weight.
export type EarlierRole = {
  company: string;
  role: string;
  period: string;
  detail: string;
};

export const earlierRoles: EarlierRole[] = [
  {
    company: "Fuzz Productions",
    role: "Senior Web Developer",
    period: "2013 — 2015",
    detail: "Built REST APIs across MVC frameworks — Laravel, CakePHP, Sails, Rails, Django.",
  },
  {
    company: "KathodeRay Media",
    role: "Web Developer",
    period: "2012 — 2013",
    detail: "Delivered client projects, including legacy Joomla 1.5 systems, with direct client communication.",
  },
];

export type Education = {
  school: string;
  degree: string;
  period: string;
};

export const education: Education[] = [
  {
    school: "University at Albany, SUNY",
    degree: "B.S., Mathematics & Computer Science",
    period: "2008 — 2012",
  },
  {
    school: "Hudson Valley Community College",
    degree: "A.S., Computer Information Systems",
    period: "2006 — 2008",
  },
];

export type CaseStudySection = {
  heading: string;
  body?: string;
  bullets?: string[];
};

export type CaseStudy = {
  tagline: string; // one-line subtitle under the title
  role: string; // "Role · Company · dates"
  sections: CaseStudySection[];
  tech: string[];
};

export type Project = {
  slug: string;
  title: string;
  blurb: string;
  image: string;
  imageAlt: string;
  tags: { label: string; tone: "primary" | "secondary" }[];
  cta: string;
  feature?: boolean; // large bento cell
  caseStudy: CaseStudy;
};

export const projects: Project[] = [
  {
    slug: "fossabot",
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
    caseStudy: {
      tagline: "Agentic AI that keeps software dependencies current — safely, automatically.",
      role: "Engineering Manager, Applied AI & SRE · FOSSA · 2024–present",
      sections: [
        {
          heading: "The problem",
          body:
            "Modern software runs on hundreds of open-source dependencies, and keeping them current is a thankless, never-ending tax on engineering teams. Updates break builds, introduce behavioral changes, and pile up until a backlog of outdated, vulnerable packages becomes a real security and maintenance liability. Most teams either fall behind or burn senior-engineer time triaging upgrades one at a time.",
        },
        {
          heading: "What I led",
          body:
            "I built and led the Applied AI team that created fossabot — an agentic AI product that automates dependency updates and vulnerability remediation directly inside developers' pull-request workflows. I owned the effort from early prototype through public beta: standing up the team from scratch (mission, hiring, mentorship), driving the architecture, and staying hands-on across the stack. In parallel I founded and led the SRE function that stabilized and scaled the production environment, including a migration from kops to managed EKS.",
        },
        {
          heading: "What we built",
          bullets: [
            "An AI agent that opens pull requests, bumps versions, reads CI logs, and verifies impact in a sandbox before recommending a change — so updates are safe, not just automatic.",
            "Code-aware change & impact detection with a caching layer for faster, cheaper analysis.",
            "Static-analysis (SAST) checks surfaced as part of the PR review.",
            "Support across the languages teams actually use — JavaScript/TypeScript, Java, Python, Go, and Ruby.",
            "Integrations beyond GitHub, including GitLab, to meet enterprises where they already work.",
            "A dependency-intelligence data layer (GraphQL API, event bus, OpenSearch) powering faster vulnerability data and future agentic capabilities.",
          ],
        },
        {
          heading: "Impact",
          body:
            "fossabot carried FOSSA from its license-compliance roots into agentic AI — a new product line taken from idea to public beta, adopted by enterprise design partners, and shaped into a multi-agent roadmap (detection → prioritization → autonomous remediation → advisory) presented to company and board leadership. The throughline: give engineers enough confidence in automated updates that they stop doing the work by hand.",
        },
      ],
      tech: [
        "LLM orchestration",
        "Agentic workflows",
        "Sandboxed code analysis",
        "Kubernetes / EKS",
        "Kafka",
        "OpenSearch",
        "GraphQL",
        "Go",
        "TypeScript",
      ],
    },
  },
  {
    slug: "evercast",
    title: "Evercast — WebRTC for Hollywood",
    blurb:
      "The real-time creative-collaboration platform used by major studios. Led the engineering of the core WebRTC streaming engine delivering 4K/60fps, 10-bit 4:4:4 color precision and 7.1 surround sound — earning an Engineering Emmy®.",
    image: "/projects/evercast.png",
    imageAlt:
      "High-speed data visualized as glowing light paths through optical fibers in a dark server room, tech-blue and cyan hues.",
    tags: [{ label: "Engineering Emmy®", tone: "secondary" }],
    cta: "Technical Details",
    caseStudy: {
      tagline: "Real-time, studio-grade video collaboration for film & television.",
      role: "Technical Lead · Clevertech / Evercast · 2016–2021",
      sections: [
        {
          heading: "The problem",
          body:
            "Film and television production had no secure, studio-grade way for editors, directors, and producers to work on footage together remotely. Reviewing a cut meant being in the same room — and unreleased intellectual property couldn't leave it. The industry needed real-time, frame-accurate collaboration over the internet without compromising security.",
        },
        {
          heading: "What I did",
          body:
            "I took Evercast from pre-seed to a fully funded, functioning business. I started as a team of one — teaching myself C, WebRTC, SIP, RTP, and the Janus media server — and grew it into the engineering team that built the product. Along the way I worked directly with industry experts: the Meetecho team behind Janus, Cosmo Software and the Alliance for Open Media, and members of the IETF shaping the real-time-media standards we were building on.",
        },
        {
          heading: "What we built",
          body:
            "A browser-based platform delivering encrypted 4K streaming at 60fps, 10-bit color, and multichannel audio — fast and faithful enough for professional color and sound work. Under the hood: a custom WebRTC signaling protocol (VP8 / VP9 / AV1, Opus, SRTP), an SFU tuned at the OS level, simulcast / scalable video coding, and an OBS-based broadcast application — deployed on Kubernetes (EKS) with security designed for Hollywood IP (role-based access, stateless JWT sessions, routine third-party pentests). We contributed engine improvements back to OBS's WebRTC implementation and the Janus Gateway.",
        },
        {
          heading: "Impact",
          bullets: [
            "Scaled to 250+ real-time virtual editing rooms and up to 256 concurrent teams.",
            "Adopted by major studios for productions including Godzilla: King of the Monsters.",
            "Recognized with an Engineering Emmy® and WebRTC patents.",
            "Became a standard for remote creative collaboration — helping reinvent how movies are made.",
          ],
        },
      ],
      tech: [
        "WebRTC (VP8 / VP9 / AV1)",
        "SRTP",
        "SIP / RTP",
        "Janus Gateway",
        "OBS",
        "C",
        "Kubernetes / EKS",
      ],
    },
  },
];

export type SkillGroup = { icon: string; title: string; skills: string[] };

export const skillGroups: SkillGroup[] = [
  {
    icon: "psychology",
    title: "AI Engineering",
    skills: ["LLM Orchestration", "RAG Systems", "Agentic Workflows", "Anthropic"],
  },
  {
    icon: "cloud_done",
    title: "SRE & Infrastructure",
    skills: ["Kubernetes", "Terraform", "AWS / GCP", "CI/CD Pipelines", "EKS", "Kafka", "OpenSearch"],
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
