const steps = [
  {
    number: 1,
    title: "We Talk",
    description:
      "Tell me about your business, goals, and budget. I\u2019ll recommend a plan that fits.",
  },
  {
    number: 2,
    title: "I Build the Plan",
    description:
      "I handle the setup \u2014 hosting, security, store config, whatever you need.",
  },
  {
    number: 3,
    title: "You Grow",
    description:
      "Your site runs smoothly. You get monthly reports. I\u2019m a text away.",
  },
];

export default function ProcessSteps() {
  return (
    <div className="relative">
      {/* Connecting line (desktop only) */}
      <div className="hidden md:block absolute top-6 left-[16.67%] right-[16.67%] h-0.5 bg-primary/20" />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {steps.map((step) => (
          <div key={step.number} className="flex flex-col items-center text-center relative">
            <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center text-lg font-semibold mb-4 relative z-10">
              {step.number}
            </div>
            <h3 className="!mt-0 !mb-2">{step.title}</h3>
            <p className="text-sm text-muted max-w-xs !mt-0">{step.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
