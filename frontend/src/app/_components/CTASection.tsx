import Link from "next/link";
import ExportedImage from "next-image-export-optimizer";
import { CardStatic } from "@/app/_components/Card";

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
    <section className="py-12">
      <CardStatic className="p-10 sm:p-16 text-center">
        <div className="flex justify-center mb-6">
          <ExportedImage
            src="/icon-cta.png"
            alt=""
            width={96}
            height={96}
            className="object-contain opacity-80"
          />
        </div>
        <h2 className="!mt-0 text-2xl">{headline}</h2>
        <p className="max-w-xl mx-auto mb-8 leading-relaxed">{description}</p>
        <Link
          href={linkHref}
          className="inline-block rounded-lg px-10 py-4 font-medium tracking-wide bg-primary text-white hover:opacity-90 transition-opacity text-lg"
        >
          {linkText}
        </Link>
      </CardStatic>
    </section>
  );
}
