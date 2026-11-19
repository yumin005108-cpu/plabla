import Image from "next/image";
import { spaces } from "./options";
import type { SpaceId } from "./types";
import {
  ContinueButton,
  PeopleCount,
  PhoneFrame,
  StepFooter,
  StepHeader,
} from "./ui";

export function SpaceStep({
  value,
  onChange,
  onBack,
  onNext,
}: {
  value: SpaceId | null;
  onChange: (value: SpaceId) => void;
  onBack: () => void;
  onNext: () => void;
}) {
  return (
    <PhoneFrame>
      <StepHeader
        title="Which space would you like to talk in?"
        onBack={onBack}
      />
      <div className="flex flex-1 flex-col gap-4 overflow-y-auto px-6 pt-5">
        {spaces.map((space) => {
          const selected = value === space.id;
          return (
            <button
              key={space.id}
              type="button"
              aria-pressed={selected}
              onClick={() => onChange(space.id)}
              className={`overflow-hidden rounded-[1.75rem] bg-white text-left ${
                selected
                  ? "border-2 border-[#BFFF00]"
                  : "border-2 border-transparent"
              }`}
            >
              <div className="relative mx-2 mt-2 aspect-[16/10] overflow-hidden rounded-[1.35rem]">
                <Image
                  src={space.image}
                  alt={space.label}
                  fill
                  sizes="400px"
                  className="object-cover"
                />
              </div>
              <div className="flex items-center justify-between px-4 py-3">
                <span className="text-base font-semibold text-[#202020]">
                  {space.label}
                </span>
                <PeopleCount count={space.occupancy} />
              </div>
            </button>
          );
        })}
      </div>
      <StepFooter>
        <ContinueButton label="Click" disabled={!value} onClick={onNext} />
      </StepFooter>
    </PhoneFrame>
  );
}
