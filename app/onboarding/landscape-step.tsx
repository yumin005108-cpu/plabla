import { goals, labelFor, languages, levels, spaces } from "./options";
import type { OnboardingDraft } from "./types";

export function LandscapeStep({
  draft,
  onBack,
}: {
  draft: OnboardingDraft;
  onBack: () => void;
}) {
  const summary = [
    labelFor(languages, draft.language),
    labelFor(levels, draft.level),
    labelFor(goals, draft.goal),
  ]
    .filter(Boolean)
    .join(" · ");

  return (
    <div className="flex min-h-dvh items-center justify-center bg-[#F8F8F8] p-4">
      <main className="flex h-[min(100dvh-2rem,430px)] w-full max-w-[844px] flex-col justify-between rounded-[2rem] bg-white px-8 py-7">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold tracking-wide text-[#20D9C2]">
            Landscape
          </p>
          <button
            type="button"
            onClick={onBack}
            className="text-sm font-medium text-[#7A7A7A]"
          >
            Back
          </button>
        </div>
        <div>
          <h1 className="text-4xl font-semibold tracking-tight text-[#202020]">
            {labelFor(spaces, draft.space)}
          </h1>
          <p className="mt-3 text-lg text-[#5C5C5C]">{summary}</p>
        </div>
        <p className="text-sm text-[#8A8A8A]">
          The conversation space will open here.
        </p>
      </main>
    </div>
  );
}
