import { goals } from "./options";
import type { GoalId } from "./types";
import { ContinueButton, PhoneFrame, StepFooter, StepHeader } from "./ui";

export function GoalStep({
  value,
  onChange,
  onBack,
  onNext,
}: {
  value: GoalId | null;
  onChange: (value: GoalId) => void;
  onBack: () => void;
  onNext: () => void;
}) {
  return (
    <PhoneFrame>
      <StepHeader title="What's your learning goal?" onBack={onBack} />
      <div className="grid flex-1 grid-cols-2 content-center gap-3 px-6">
        {goals.map((goal) => {
          const selected = value === goal.id;
          return (
            <button
              key={goal.id}
              type="button"
              aria-pressed={selected}
              onClick={() => onChange(goal.id)}
              className={`flex h-36 flex-col items-start justify-between rounded-[1.75rem] bg-white p-5 text-left ${
                selected
                  ? "border-2 border-[#BFFF00]"
                  : "border-2 border-transparent"
              }`}
            >
              <span
                className="h-3.5 w-3.5 rounded-full"
                style={{ backgroundColor: goal.accent }}
              />
              <span className="text-lg font-semibold text-[#202020]">
                {goal.label}
              </span>
            </button>
          );
        })}
      </div>
      <StepFooter>
        <ContinueButton label="Next" disabled={!value} onClick={onNext} />
      </StepFooter>
    </PhoneFrame>
  );
}
