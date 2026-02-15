import Link from "next/link";
import NeumorphismCard from "@/app/_components/NeumorphismContainer";

interface CTASectionProps {
  headline: string;
  description: string;
  linkText: string;
  linkHref: string;
}

export default function CTASection({
  headline,
  description,
  linkText,
  linkHref,
}: CTASectionProps) {
  return (
    <section className="my-16">
      <NeumorphismCard className="p-8 sm:p-12 text-center">
        <h2 className="!mt-0">{headline}</h2>
        <p className="max-w-xl mx-auto">{description}</p>
        <Link href={linkHref} className="link-styles text-lg">
          {linkText} &gt;&gt;
        </Link>
      </NeumorphismCard>
    </section>
  );
}
