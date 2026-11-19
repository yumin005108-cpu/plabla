import { languages } from "./options";
import type { LanguageId } from "./types";
import { ContinueButton, PhoneFrame, StepFooter, StepHeader } from "./ui";

export function LanguageStep({
  value,
  onChange,
  onBack,
  onNext,
}: {
  value: LanguageId | null;
  onChange: (value: LanguageId) => void;
  onBack: () => void;
  onNext: () => void;
}) {
  return (
    <PhoneFrame>
      <StepHeader
        title="Choose the language you want to learn."
        onBack={onBack}
      />
      <div className="flex flex-1 flex-col gap-3 overflow-y-auto px-6 pt-6">
        {languages.map((language) => {
          const selected = value === language.id;
          return (
            <button
              key={language.id}
              type="button"
              aria-pressed={selected}
              onClick={() => onChange(language.id)}
              className={`flex h-[4.25rem] items-center gap-4 rounded-3xl bg-white px-4 text-left ${
                selected
                  ? "border-2 border-[#BFFF00]"
                  : "border-2 border-transparent"
              }`}
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#F8F8F8] text-2xl">
                {language.flag}
              </span>
              <span className="text-lg font-semibold text-[#202020]">
                {language.label}
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
