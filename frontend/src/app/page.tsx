import SiteNav from "@/app/_components/portfolio/SiteNav";
import Hero from "@/app/_components/portfolio/Hero";
import Timeline from "@/app/_components/portfolio/Timeline";
import ProjectSpotlight from "@/app/_components/portfolio/ProjectSpotlight";
import SkillsCloud from "@/app/_components/portfolio/SkillsCloud";
import ContactCTA from "@/app/_components/portfolio/ContactCTA";
import SiteFooter from "@/app/_components/portfolio/SiteFooter";

export default function Home() {
  return (
    <div className="portfolio">
      <SiteNav />
      <main className="relative">
        <Hero />
        <Timeline />
        <ProjectSpotlight />
        <SkillsCloud />
        <ContactCTA />
      </main>
      <SiteFooter />
    </div>
  );
}
