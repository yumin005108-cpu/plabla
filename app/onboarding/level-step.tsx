import { levels } from "./options";
import type { LevelId } from "./types";
import { ContinueButton, PhoneFrame, StepFooter, StepHeader } from "./ui";

export function LevelStep({
  value,
  onChange,
  onBack,
  onNext,
}: {
  value: LevelId | null;
  onChange: (value: LevelId) => void;
  onBack: () => void;
  onNext: () => void;
}) {
  return (
    <PhoneFrame>
      <StepHeader title="What's your level?" onBack={onBack} />
      <div className="flex flex-1 flex-col justify-center gap-3 px-6">
        {levels.map((level) => {
          const selected = value === level.id;
          return (
            <button
              key={level.id}
              type="button"
              aria-pressed={selected}
              onClick={() => onChange(level.id)}
              className={`h-16 rounded-full text-lg font-semibold ${
                selected
                  ? "border-2 border-[#BFFF00] bg-white text-[#202020]"
                  : "border-2 border-transparent bg-white text-[#202020]"
              }`}
            >
              {level.label}
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
