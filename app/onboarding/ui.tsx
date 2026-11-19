import type { ReactNode } from "react";

export function PhoneFrame({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-dvh items-center justify-center bg-[#F2F2F2]">
      <main className="relative flex h-dvh w-full max-w-[430px] flex-col overflow-hidden bg-[#F8F8F8] sm:h-[min(100dvh,844px)] sm:rounded-[2.5rem]">
        {children}
      </main>
    </div>
  );
}

export function StepHeader({
  title,
  onBack,
}: {
  title: string;
  onBack: () => void;
}) {
  return (
    <header className="px-6 pt-6">
      <button
        type="button"
        onClick={onBack}
        className="text-sm font-medium text-[#7A7A7A]"
      >
        Back
      </button>
      <h1 className="mt-5 text-[1.7rem] leading-snug font-semibold tracking-tight text-[#202020]">
        {title}
      </h1>
    </header>
  );
}

export function StepFooter({ children }: { children: ReactNode }) {
  return (
    <div className="px-6 pt-3 pb-[max(1.5rem,env(safe-area-inset-bottom))]">
      {children}
    </div>
  );
}

export function ContinueButton({
  label,
  disabled,
  onClick,
}: {
  label: string;
  disabled?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className="h-14 w-full rounded-full bg-[#BFFF00] text-lg font-bold tracking-tight text-[#202020] transition-transform duration-150 enabled:active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-[#E6E6E6] disabled:text-[#9A9A9A]"
    >
      {label}
    </button>
  );
}

export function PeopleCount({ count }: { count: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-sm font-medium text-[#5C5C5C]">
      <svg
        viewBox="0 0 24 24"
        aria-hidden="true"
        className="h-4 w-4"
        fill="none"
        stroke="#20D9C2"
        strokeWidth="1.8"
        strokeLinecap="round"
      >
        <circle cx="9" cy="8" r="2.4" fill="#20D9C2" stroke="none" />
        <circle cx="16.2" cy="9" r="1.8" fill="#59B8FF" stroke="none" />
        <path d="M4.2 18.2c.7-2.6 2.6-4 4.8-4s4.1 1.4 4.8 4" />
        <path d="M14.4 14.6c1.5.3 2.8 1.4 3.4 3.4" />
      </svg>
      {count}
    </span>
  );
}
