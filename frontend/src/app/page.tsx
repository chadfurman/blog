import SiteNav from "@/app/_components/portfolio/SiteNav";
import Hero from "@/app/_components/portfolio/Hero";
import EngineeringCreed from "@/app/_components/portfolio/EngineeringCreed";
import Timeline from "@/app/_components/portfolio/Timeline";
import ProjectSpotlight from "@/app/_components/portfolio/ProjectSpotlight";
import SkillsCloud from "@/app/_components/portfolio/SkillsCloud";
import ContactCTA from "@/app/_components/portfolio/ContactCTA";
import SiteFooter from "@/app/_components/portfolio/SiteFooter";
import ScrollReveal from "@/app/_components/portfolio/ScrollReveal";
import CommandPalette from "@/app/_components/portfolio/CommandPalette";
import AskConsole from "@/app/_components/portfolio/AskConsole";

export default function Home() {
  return (
    <div className="portfolio">
      {/* Without JS, scroll-reveal never fires — keep content visible. */}
      <noscript>
        <style>{`.portfolio [data-reveal]{opacity:1;transform:none;}`}</style>
      </noscript>
      <SiteNav />
      <main className="relative">
        <Hero />
        <AskConsole />
        <EngineeringCreed />
        <Timeline />
        <ProjectSpotlight />
        <SkillsCloud />
        <ContactCTA />
      </main>
      <SiteFooter />
      <ScrollReveal />
      <CommandPalette />
    </div>
  );
}
