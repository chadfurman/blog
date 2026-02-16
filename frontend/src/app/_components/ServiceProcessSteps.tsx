interface Step {
  title: string;
  description: string;
}

interface ServiceProcessStepsProps {
  steps: Step[];
}

export default function ServiceProcessSteps({ steps }: ServiceProcessStepsProps) {
  return (
    <div className="relative max-w-2xl mx-auto">
      {/* Vertical connecting line */}
      {steps.length > 1 && (
        <div className="absolute left-6 top-6 bottom-6 w-0.5 bg-primary/20 hidden md:block" />
      )}

      <div className="space-y-8">
        {steps.map((step, i) => (
          <div key={step.title} className="flex gap-4 items-start">
            <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center text-lg font-semibold shrink-0 relative z-10">
              {i + 1}
            </div>
            <div className="pt-1">
              <h3 className="!mt-0 !mb-1">{step.title}</h3>
              <p className="text-sm text-muted !mt-0">{step.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
