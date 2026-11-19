import { Fredoka } from "next/font/google";

const fredoka = Fredoka({
  subsets: ["latin"],
  weight: ["600"],
});

export function PlaBlaLogo() {
  return (
    <div className="flex flex-col items-center">
      <svg
        viewBox="0 0 300 196"
        className="h-40 w-[15.5rem] overflow-visible"
        role="img"
        aria-label="PlaBla"
      >
        <defs>
          <filter id="soft-glow" x="-30%" y="-30%" width="160%" height="170%">
            <feDropShadow
              dx="0"
              dy="12"
              stdDeviation="10"
              floodColor="#b7e7c8"
              floodOpacity="0.55"
            />
          </filter>
        </defs>
        <g filter="url(#soft-glow)">
          <path
            fill="#4FE6C8"
            d="M176 24c46-12 104 2 112 42 8 40-22 72-70 78-8 10-12 28-18 40-8-16-22-28-40-30-48-6-84-36-80-72 4-38 48-50 96-58Z"
          />
          <path
            fill="#D4FF4A"
            style={{ mixBlendMode: "multiply" }}
            d="M124 74c48-16 104 4 108 40 4 34-30 60-78 62-10 12-16 30-28 42-6-16-18-26-36-28-40-6-70-32-64-62 6-32 50-42 98-54Z"
          />
        </g>
        <ellipse
          cx="198"
          cy="58"
          rx="8"
          ry="13"
          fill="#fff"
          transform="rotate(-18 198 58)"
        />
        <ellipse
          cx="238"
          cy="74"
          rx="22"
          ry="10"
          fill="#fff"
          transform="rotate(-12 238 74)"
        />
        <ellipse
          cx="86"
          cy="122"
          rx="8"
          ry="14"
          fill="#fff"
          transform="rotate(-22 86 122)"
        />
        <ellipse
          cx="128"
          cy="138"
          rx="20"
          ry="10"
          fill="#fff"
          transform="rotate(-14 128 138)"
        />
      </svg>
      <p
        className={`${fredoka.className} text-[4.25rem] leading-none font-semibold tracking-tight`}
      >
        <span className="text-[#B6F000]">Pla</span>
        <span className="text-[#3AD9C2]">Bla</span>
      </p>
    </div>
  );
}
