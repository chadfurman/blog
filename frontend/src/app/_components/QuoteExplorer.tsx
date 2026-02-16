"use client";

import { useState, FormEvent } from "react";
import { CardStatic } from "@/app/_components/Card";
import {
  GOALS,
  GOAL_DETAILS,
  REVENUE_OPTIONS,
  getRecommendation,
  getTotalSteps,
  GoalId,
  QuoteRecommendation,
} from "@/data/quoteLogic";
import { getPrice, getSetup } from "@/data/services";
import { useBilling } from "@/app/_components/BillingToggle";

function StepIndicator({
  current,
  total,
  onStepClick,
}: {
  current: number;
  total: number;
  onStepClick: (step: number) => void;
}) {
  return (
    <div className="flex items-center justify-center gap-2 mb-8">
      {Array.from({ length: total }, (_, i) => (
        <div key={i} className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => i + 1 < current && onStepClick(i + 1)}
            disabled={i + 1 >= current}
            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
              i + 1 === current
                ? "bg-primary text-white"
                : i + 1 < current
                  ? "bg-primary/20 text-primary cursor-pointer hover:bg-primary/30"
                  : "bg-foreground/10 text-muted"
            } ${i + 1 >= current ? "" : ""}`.trim()}
            aria-label={i + 1 < current ? `Go back to step ${i + 1}` : `Step ${i + 1}`}
          >
            {i + 1}
          </button>
          {i < total - 1 && (
            <div
              className={`w-8 h-0.5 ${
                i + 1 < current ? "bg-primary/30" : "bg-foreground/10"
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
}

function OptionButton({
  label,
  selected,
  onClick,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full p-4 rounded-lg border text-left transition-all ${
        selected
          ? "border-primary bg-primary/10 text-highlight"
          : "border-foreground/10 hover:border-primary/30"
      }`}
    >
      <span className="text-sm font-medium">{label}</span>
    </button>
  );
}

export default function QuoteExplorer() {
  const [step, setStep] = useState(1);
  const [goal, setGoal] = useState<GoalId | "">("");
  const [otherText, setOtherText] = useState("");
  const [detail, setDetail] = useState("");
  const [detailOther, setDetailOther] = useState("");
  const [revenue, setRevenue] = useState("");
  const [recommendation, setRecommendation] =
    useState<QuoteRecommendation | null>(null);
  const [email, setEmail] = useState("");
  const [newsletter, setNewsletter] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const totalSteps = goal ? getTotalSteps(goal) : 4;

  function selectGoal(id: GoalId) {
    setGoal(id);
    setDetail("");
    setDetailOther("");
    setRevenue("");
    setRecommendation(null);

    if (id === "other") {
      // Show text input on step 1 — don't auto-advance
      return;
    }

    // All non-other goals have a detail step
    setStep(2);
  }

  function advanceOther() {
    const rec = getRecommendation("other");
    setRecommendation(rec);
    setStep(2);
  }

  function selectDetail(id: string) {
    setDetail(id);
    // Advance to revenue step (step 3)
    setStep(3);
  }

  function selectDetailOther() {
    setDetail("other");
    setStep(3);
  }

  function selectRevenue(id: string) {
    setRevenue(id);
    // Compute recommendation and advance to final step
    if (goal) {
      const rec = getRecommendation(goal, detail || undefined);
      setRecommendation(rec);
    }
    setStep(4);
  }

  function handleBack() {
    if (goal === "other") {
      // "Other" flow: step 2 → step 1
      setStep(1);
      return;
    }
    if (step === 4) {
      setStep(3);
    } else if (step === 3) {
      setStep(2);
    } else {
      setStep(1);
    }
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!recommendation) return;

    setSubmitting(true);
    const data = new FormData(e.currentTarget);

    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: data,
      });
      if (res.ok) {
        setSubmitted(true);
      }
    } finally {
      setSubmitting(false);
    }
  }

  function reset() {
    setStep(1);
    setGoal("");
    setOtherText("");
    setDetail("");
    setDetailOther("");
    setRevenue("");
    setRecommendation(null);
    setEmail("");
    setNewsletter(true);
    setSubmitted(false);
    setSubmitting(false);
  }

  const { period } = useBilling();
  const goalDetail = goal && goal !== "other" ? GOAL_DETAILS[goal] : null;

  return (
    <CardStatic className="p-6 sm:p-8 max-w-2xl mx-auto">
      <StepIndicator current={step} total={totalSteps} onStepClick={(s) => setStep(s)} />

      <div className="min-h-[280px]">
        {/* Step 1: What can I help with? */}
        {step === 1 && (
          <div>
            <h3 className="!mt-0 !mb-2 text-center">
              What can I help with?
            </h3>
            <p className="text-sm text-muted text-center mb-6">
              Pick the one that fits best
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {GOALS.map((g) => (
                <OptionButton
                  key={g.id}
                  label={g.label}
                  selected={goal === g.id}
                  onClick={() => selectGoal(g.id)}
                />
              ))}
            </div>

            {/* Other: show text input */}
            {goal === "other" && (
              <div className="mt-4">
                <input
                  type="text"
                  value={otherText}
                  onChange={(e) => setOtherText(e.target.value)}
                  placeholder="Tell me a bit about what you need..."
                  className="w-full"
                />
                <div className="text-center mt-4">
                  <button
                    type="button"
                    onClick={advanceOther}
                    className="px-6 py-2 rounded-lg text-sm font-medium bg-primary text-white hover:opacity-90 transition-opacity"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Step 2: Detail question (for 4-step flows) */}
        {step === 2 && goalDetail && (
          <div>
            <h3 className="!mt-0 !mb-2 text-center">
              {goalDetail.question}
            </h3>
            <p className="text-sm text-muted text-center mb-6">
              This helps me tailor your recommendation
            </p>
            <div className="flex flex-col gap-3 max-w-sm mx-auto">
              {goalDetail.options.map((opt) => (
                <OptionButton
                  key={opt.id}
                  label={opt.label}
                  selected={detail === opt.id}
                  onClick={() => selectDetail(opt.id)}
                />
              ))}
              {goalDetail.allowOtherText && (
                <div>
                  <input
                    type="text"
                    value={detailOther}
                    onChange={(e) => setDetailOther(e.target.value)}
                    placeholder="Something else..."
                    className="w-full"
                  />
                  {detailOther && (
                    <div className="text-center mt-3">
                      <button
                        type="button"
                        onClick={selectDetailOther}
                        className="px-6 py-2 rounded-lg text-sm font-medium bg-primary text-white hover:opacity-90 transition-opacity"
                      >
                        Next
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Step 3: Revenue (for 4-step flows) */}
        {step === 3 && goal !== "other" && (
          <div>
            <h3 className="!mt-0 !mb-2 text-center">
              What&apos;s your annual revenue?
            </h3>
            <p className="text-sm text-muted text-center mb-6">
              This helps me recommend the right scope
            </p>
            <div className="flex flex-col gap-3 max-w-sm mx-auto">
              {REVENUE_OPTIONS.map((opt) => (
                <OptionButton
                  key={opt.id}
                  label={opt.label}
                  selected={revenue === opt.id}
                  onClick={() => selectRevenue(opt.id)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Final Step: Recommendation + Email Capture */}
        {step === totalSteps && recommendation && !submitted && (
          <div>
            <h3 className="!mt-0 !mb-4 text-center">
              Your Recommended Plan
            </h3>

            <div className="p-4 rounded-lg border border-primary/20 bg-primary/5 mb-6">
              <h4 className="!mt-0 !mb-1 font-semibold text-center">
                {recommendation.service.name}
              </h4>
              <p className="text-sm text-muted !my-0 text-center">
                {recommendation.reason}
              </p>
              <div className="text-center mt-3">
                <p className="text-lg font-semibold text-accent !my-0">
                  {getPrice(recommendation.service, period)}
                </p>
                {getSetup(recommendation.service, period) && (
                  <p className="text-xs text-muted !my-0">
                    {getSetup(recommendation.service, period)}
                  </p>
                )}
              </div>
            </div>

            <form onSubmit={handleSubmit} className="mt-6">
              <input
                type="hidden"
                name="access_key"
                value={process.env.NEXT_PUBLIC_WEB3FORMS_KEY || ""}
              />
              <input type="checkbox" name="botcheck" className="hidden" />
              <input
                type="hidden"
                name="subject"
                value={`Quote Request: ${recommendation.service.name}`}
              />
              <input
                type="hidden"
                name="service"
                value={recommendation.service.id}
              />
              <input type="hidden" name="goal" value={goal} />
              {detail && (
                <input type="hidden" name="detail" value={detail} />
              )}
              {detailOther && (
                <input
                  type="hidden"
                  name="detail_other"
                  value={detailOther}
                />
              )}
              {otherText && (
                <input type="hidden" name="other_details" value={otherText} />
              )}
              {revenue && (
                <input type="hidden" name="revenue" value={revenue} />
              )}
              <input
                type="hidden"
                name="newsletter_optin"
                value={newsletter ? "yes" : "no"}
              />

              <label className="block mb-3">
                <span className="text-sm font-medium">
                  Enter your email for your custom quote
                </span>
                <input
                  type="email"
                  name="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full"
                />
              </label>

              <label className="flex items-start gap-2 text-sm text-muted cursor-pointer mb-4">
                <input
                  type="checkbox"
                  checked={newsletter}
                  onChange={(e) => setNewsletter(e.target.checked)}
                  className="mt-1 accent-primary"
                />
                <span>
                  Subscribe to my newsletter for design, performance, and
                  marketing tips (and get 10% off your first year)
                </span>
              </label>

              <div className="text-center">
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-block rounded-lg px-8 py-3 font-medium tracking-wide bg-primary text-white hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  {submitting ? "Sending..." : "Get My Custom Quote"}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Success state */}
        {submitted && (
          <div className="text-center py-8">
            <h3 className="!mt-0 !mb-2">Thank you!</h3>
            <p className="text-muted">
              I&apos;ll review your request and send a custom quote within 1-2
              business days.
            </p>
          </div>
        )}
      </div>

      {/* Navigation */}
      {step > 1 && !submitted && (
        <div className="flex justify-between mt-8">
          <button
            type="button"
            onClick={handleBack}
            className="px-4 py-2 rounded-lg text-sm font-medium text-muted hover:text-highlight transition-colors"
          >
            Back
          </button>
          <div />
        </div>
      )}

      {(step === totalSteps || submitted) && (
        <div className="text-center mt-4">
          <button
            type="button"
            onClick={reset}
            className="text-sm text-muted hover:text-highlight transition-colors"
          >
            Start Over
          </button>
        </div>
      )}
    </CardStatic>
  );
}
