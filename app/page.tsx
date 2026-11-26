"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import * as THREE from "three";

import { Canvas, useLoader } from "@react-three/fiber";
import { Center, OrbitControls } from "@react-three/drei";
import { MTLLoader } from "three/examples/jsm/loaders/MTLLoader.js";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";

/* =====================================================
   TYPES
===================================================== */

type Step =
  | "start"
  | "language"
  | "info"
  | "character"
  | "space"
  | "landscape";

type Language =
  | "Korean"
  | "English"
  | "Japanese"
  | "Chinese"
  | "Spanish"
  | "French";

type Level = "Beginner" | "Intermediate" | "Advanced";

type Goal = "Conversation" | "Travel" | "Study" | "Culture";

type Space =
  | "Mafia"
  | "Escape Room"
  | "Describe & Guess"
  | "Shadowing"
  | "Balance Game"
  | "Free Talk";

type CharacterTab = "color" | "eyes";
type EyeTarget = "left" | "right";

/* =====================================================
   DATA
===================================================== */

const languages: { name: Language; symbol: string }[] = [
  { name: "Korean", symbol: "한" },
  { name: "English", symbol: "A" },
  { name: "Japanese", symbol: "あ" },
  { name: "Chinese", symbol: "中" },
  { name: "Spanish", symbol: "Ñ" },
  { name: "French", symbol: "É" },
];

const levels: Level[] = ["Beginner", "Intermediate", "Advanced"];
const goals: Goal[] = ["Conversation", "Travel", "Study", "Culture"];

const bodyColors = [
  { name: "Lime", value: "#C7F238" },
  { name: "Mint", value: "#74DDD1" },
  { name: "Blue", value: "#78C0F0" },
  { name: "Pink", value: "#EE98CF" },
  { name: "Yellow", value: "#F7E66A" },
  { name: "Purple", value: "#B8A4F4" },
  { name: "Peach", value: "#FFB58E" },
];

const eyeSuggestions = ["P", "B", "の", "中", "あ", "ㅎ", "Ω", "丸"];

const spaces: {
  name: Space;
  image: string;
  people: string;
  description: string;
}[] = [
  {
    name: "Mafia",
    image: "/mafia.png",
    people: "6 / 8",
    description: "Discuss, suspect, and defend.",
  },
  {
    name: "Escape Room",
    image: "/escape-room.png",
    people: "4 / 6",
    description: "Find clues and solve together.",
  },
  {
    name: "Describe & Guess",
    image: "/describe-guess.png",
    people: "5 / 8",
    description: "Describe it and let others guess.",
  },
  {
    name: "Shadowing",
    image: "/shadowing.png",
    people: "4 / 6",
    description: "Listen, repeat, and practice together.",
  },
  {
    name: "Balance Game",
    image: "/balance-game.png",
    people: "6 / 10",
    description: "Choose a side and explain why.",
  },
  {
    name: "Free Talk",
    image: "/free-talk.png",
    people: "7 / 10",
    description: "Relax and talk freely.",
  },
];

/* =====================================================
   FONT HELPERS
===================================================== */

function getFredokaFont() {
  if (typeof window === "undefined") {
    return "Arial";
  }

  const value = getComputedStyle(document.documentElement)
    .getPropertyValue("--font-fredoka")
    .trim();

  return value || '"Arial Rounded MT Bold"';
}

function getPretendardFont() {
  if (typeof window === "undefined") {
    return "sans-serif";
  }

  return '"Pretendard Variable", Pretendard, sans-serif';
}

/* =====================================================
   EYE TEXTURE
===================================================== */

function createEyeTexture(text: string, fredokaFont: string) {
  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 1024;

  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  ctx.clearRect(0, 0, 1024, 1024);
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.lineJoin = "round";
  ctx.lineCap = "round";

  const isLatin = /^[A-Za-z0-9]$/.test(text);
  const isJapanese = /[\u3040-\u30ff]/.test(text);
  const isChinese = /[\u3400-\u9fff]/.test(text);
  const isKorean = /[\uac00-\ud7af\u3130-\u318f]/.test(text);

  let fontFamily = getPretendardFont();
  let fontSize = 520;
  let fontWeight = 620;
  let fillColor = "#2f2f2f";
  let strokeColor = "#3b3b3b";
  let strokeWidth = 0;

  // 영어/숫자
  if (isLatin) {
    fontFamily = fredokaFont;
    fontSize = 560;
    fontWeight = 540;
    fillColor = "#323232";
    strokeColor = "#3a3a3a";
    strokeWidth = 1.6;
  }

  // 일본어
  if (isJapanese) {
    fontFamily = getPretendardFont();
    fontSize = 540;
    fontWeight = 650;
    fillColor = "#2f2f2f";
    strokeColor = "#393939";
    strokeWidth = 1.2;
  }

  // 한자
  if (isChinese) {
    fontFamily = getPretendardFont();
    fontSize = 520;
    fontWeight = 680;
    fillColor = "#2f2f2f";
    strokeColor = "#393939";
    strokeWidth = 1.1;
  }

  // 한글
  if (isKorean) {
    fontFamily = getPretendardFont();
    fontSize = 530;
    fontWeight = 670;
    fillColor = "#2f2f2f";
    strokeColor = "#393939";
    strokeWidth = 1.1;
  }

  ctx.font = `${fontWeight} ${fontSize}px ${fontFamily}`;

  // 살짝 부드러운 느낌
  ctx.shadowColor = "rgba(0,0,0,0.08)";
  ctx.shadowBlur = 2;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 1;

  if (strokeWidth > 0) {
    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = strokeWidth;
    ctx.strokeText(text || " ", 512, 536);
  }

  ctx.fillStyle = fillColor;
  ctx.fillText(text || " ", 512, 536);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.generateMipmaps = true;
  texture.needsUpdate = true;

  return texture;
}

/* =====================================================
   EYE MESH
===================================================== */

function Eye3D({
  text,
  position,
  rotation,
  scale = 1,
}: {
  text: string;
  position: [number, number, number];
  rotation: [number, number, number];
  scale?: number;
}) {
  const [texture, setTexture] = useState<THREE.CanvasTexture | null>(null);

  useEffect(() => {
    let active = true;

    async function buildTexture() {
      await document.fonts.ready;

      const fredoka = getFredokaFont();

      try {
        await document.fonts.load(`540 64px ${fredoka}`);
        await document.fonts.load(`650 64px ${getPretendardFont()}`);
      } catch {
        //
      }

      if (!active) return;

      const nextTexture = createEyeTexture(text, fredoka);
      setTexture((prev) => {
        prev?.dispose();
        return nextTexture;
      });
    }

    buildTexture();

    return () => {
      active = false;
    };
  }, [text]);

  useEffect(() => {
    return () => {
      texture?.dispose();
    };
  }, [texture]);

  if (!texture) return null;

  return (
    <mesh position={position} rotation={rotation} renderOrder={50} scale={scale}>
      <planeGeometry args={[0.28, 0.28]} />
      <meshBasicMaterial
        map={texture}
        transparent
        alphaTest={0.01}
        depthWrite={false}
        depthTest
        side={THREE.DoubleSide}
        polygonOffset
        polygonOffsetFactor={-4}
        polygonOffsetUnits={-4}
      />
    </mesh>
  );
}

/* =====================================================
   CHARACTER
===================================================== */

function CharacterModel({
  bodyColor,
  leftEye,
  rightEye,
}: {
  bodyColor: string;
  leftEye: string;
  rightEye: string;
}) {
  const materials = useLoader(MTLLoader, "/mbd_character_eyeX.mtl");
  materials.preload();

  const object = useLoader(OBJLoader, "/mbd_character_eyeX.obj", (loader) => {
    loader.setMaterials(materials);
  });

  const model = useMemo(() => {
    const cloned = object.clone(true);

    cloned.traverse((child) => {
      if (!(child instanceof THREE.Mesh)) return;

      if (Array.isArray(child.material)) {
        child.material = child.material.map((material) => {
          const copy = material.clone();
          if (copy.name === "bodyColor_Green") {
            copy.color.set(bodyColor);
          }
          return copy;
        });
      } else if (child.material) {
        const copy = child.material.clone();
        if (copy.name === "bodyColor_Green") {
          copy.color.set(bodyColor);
        }
        child.material = copy;
      }
    });

    return cloned;
  }, [object, bodyColor]);

  /*
    viewer 기준
    왼쪽 눈 / 오른쪽 눈
    간격 너무 넓지 않게 다시 좁힘
    곡면에 맞게 미세하게 각도 조정
  */
  const viewerLeftEyePosition: [number, number, number] = [-27.60, 1.43, -23.72];
  const viewerRightEyePosition: [number, number, number] = [-27.72, 1.43, -23.72];

  const viewerLeftEyeRotation: [number, number, number] = [0, Math.PI - 0.055, 0];
  const viewerRightEyeRotation: [number, number, number] = [0, Math.PI + 0.055, 0];

  return (
    <Center>
      <group scale={0.64} position={[0, 0.18, 0]} rotation={[0, Math.PI, 0]}>
        <primitive object={model} />

        <Eye3D
          text={leftEye}
          position={viewerLeftEyePosition}
          rotation={viewerLeftEyeRotation}
          scale={1}
        />

        <Eye3D
          text={rightEye}
          position={viewerRightEyePosition}
          rotation={viewerRightEyeRotation}
          scale={1}
        />
      </group>
    </Center>
  );
}

/* =====================================================
   MAIN
===================================================== */

export default function Home() {
  const [step, setStep] = useState<Step>("start");
  const [language, setLanguage] = useState<Language | null>(null);
  const [level, setLevel] = useState<Level | null>(null);
  const [goal, setGoal] = useState<Goal | null>(null);
  const [space, setSpace] = useState<Space | null>(null);

  const [bodyColor, setBodyColor] = useState("#C7F238");

  const [leftEye, setLeftEye] = useState("P");
  const [rightEye, setRightEye] = useState("B");

  const [characterTab, setCharacterTab] = useState<CharacterTab>("color");
  const [eyeTarget, setEyeTarget] = useState<EyeTarget>("left");

  const MobileFrame = ({ children }: { children: React.ReactNode }) => (
    <div className="flex min-h-dvh items-center justify-center bg-[#F2F2F2]">
      <main className="relative flex h-dvh w-full max-w-[430px] flex-col overflow-hidden bg-[#F8F8F8] sm:h-[min(100dvh,844px)] sm:rounded-[2.5rem] sm:shadow-[0_24px_60px_rgba(32,32,32,0.08)]">
        {children}
      </main>
    </div>
  );

  const BackButton = ({ onClick }: { onClick: () => void }) => (
    <button
      type="button"
      onClick={onClick}
      aria-label="Back"
      className="mb-6 flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-white/70 shadow-[0_10px_30px_rgba(0,0,0,0.08)] backdrop-blur-xl transition active:scale-95"
      style={{
        background:
          "linear-gradient(135deg, rgba(255,255,255,0.82), rgba(255,255,255,0.35))",
      }}
    >
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path
          d="M14.5 6.5L9 12L14.5 17.5"
          stroke="#202020"
          strokeWidth="2.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );

  const BottomButton = ({
    children,
    disabled,
    onClick,
  }: {
    children: React.ReactNode;
    disabled?: boolean;
    onClick: () => void;
  }) => (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={`font-fredoka h-14 w-full rounded-full text-lg font-medium transition ${
        disabled
          ? "cursor-not-allowed bg-[#E4E4E4] text-[#999999]"
          : "bg-[#BFFF00] text-[#202020] active:scale-[0.98]"
      }`}
    >
      {children}
    </button>
  );

  const headingClass =
    "font-fredoka text-[35px] font-medium leading-[1.04] tracking-[-0.02em] text-[#202020]";
  const subTextClass =
    "text-[15px] leading-6 tracking-[-0.01em] text-[#202020]/45";

  if (step === "start") {
    return (
      <MobileFrame>
        <div className="flex flex-1 items-center justify-center px-8">
          <Image
            src="/plabla-logo-transparent.svg"
            alt="PlaBla"
            width={280}
            height={180}
            priority
            className="h-auto w-[210px]"
          />
        </div>

        <div className="px-6 pb-[max(2rem,env(safe-area-inset-bottom))]">
          <BottomButton onClick={() => setStep("language")}>Start</BottomButton>
        </div>
      </MobileFrame>
    );
  }

  if (step === "language") {
    return (
      <MobileFrame>
        <div className="hide-scrollbar flex flex-1 flex-col overflow-y-auto px-6 pt-8">
          <BackButton onClick={() => setStep("start")} />

          <h1 className={headingClass}>
            Choose the language
            <br />
            you want to learn.
          </h1>

          <p className={`mb-8 mt-3 ${subTextClass}`}>Select one language to continue.</p>

          <div className="flex flex-col gap-3">
            {languages.map((item) => {
              const selected = language === item.name;

              return (
                <button
                  key={item.name}
                  type="button"
                  onClick={() => setLanguage(item.name)}
                  className={`flex h-[68px] shrink-0 items-center gap-4 rounded-[22px] border-2 px-4 text-left transition ${
                    selected ? "border-[#BFFF00] bg-[#F7FFE5]" : "border-transparent bg-white"
                  }`}
                >
                  <div
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-lg font-semibold ${
                      selected ? "bg-[#BFFF00]" : "bg-[#F1F1F1]"
                    }`}
                  >
                    {item.symbol}
                  </div>

                  <span className="font-fredoka text-[18px] font-medium text-[#202020]">
                    {item.name}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="h-6 shrink-0" />
        </div>

        <div className="px-6 pt-5 pb-[max(2rem,env(safe-area-inset-bottom))]">
          <BottomButton disabled={!language} onClick={() => setStep("info")}>
            Next
          </BottomButton>
        </div>
      </MobileFrame>
    );
  }

  if (step === "info") {
    return (
      <MobileFrame>
        <div className="hide-scrollbar flex flex-1 flex-col overflow-y-auto px-6 pt-8">
          <BackButton onClick={() => setStep("language")} />

          <h1 className={headingClass}>
            Tell us about
            <br />
            your learning.
          </h1>

          <p className={`mb-8 mt-3 ${subTextClass}`}>
            This helps us find the right experience for you.
          </p>

          <section className="mb-8">
            <h2 className="mb-3 font-semibold tracking-[-0.01em] text-[#202020]">
              Your level
            </h2>

            <div className="grid grid-cols-3 gap-3">
              {levels.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setLevel(item)}
                  className={`font-fredoka h-[76px] rounded-[22px] border-2 text-sm font-medium ${
                    level === item
                      ? "border-[#BFFF00] bg-[#F7FFE5]"
                      : "border-transparent bg-white"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </section>

          <section>
            <h2 className="mb-3 font-semibold tracking-[-0.01em] text-[#202020]">
              Learning goal
            </h2>

            <div className="grid grid-cols-2 gap-3">
              {goals.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setGoal(item)}
                  className={`font-fredoka h-[76px] rounded-[22px] border-2 font-medium ${
                    goal === item
                      ? "border-[#BFFF00] bg-[#F7FFE5]"
                      : "border-transparent bg-white"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </section>
        </div>

        <div className="px-6 pt-5 pb-[max(2rem,env(safe-area-inset-bottom))]">
          <BottomButton disabled={!level || !goal} onClick={() => setStep("character")}>
            Next
          </BottomButton>
        </div>
      </MobileFrame>
    );
  }

  if (step === "character") {
    return (
      <MobileFrame>
        <div className="hide-scrollbar flex-1 overflow-y-auto overscroll-y-contain px-6 pt-8 pb-8">
          <BackButton onClick={() => setStep("info")} />

          <h1 className={headingClass}>Make it yours.</h1>

          <p className={`mt-3 ${subTextClass}`}>Create your PlaBla character.</p>

          <div className="relative mt-5 h-[300px] w-full overflow-hidden rounded-[30px] bg-white">
            <Canvas
              camera={{
                position: [0, 0.18, 3.8],
                fov: 32,
              }}
              gl={{ antialias: true }}
            >
              <ambientLight intensity={2.45} />
              <directionalLight position={[4, 6, 6]} intensity={2.5} />
              <directionalLight position={[-4, 2, 3]} intensity={1.2} />

              <CharacterModel
                bodyColor={bodyColor}
                leftEye={leftEye}
                rightEye={rightEye}
              />

              <OrbitControls
                enablePan={false}
                enableZoom={false}
                minPolarAngle={Math.PI / 2}
                maxPolarAngle={Math.PI / 2}
                minAzimuthAngle={-0.78}
                maxAzimuthAngle={0.78}
                target={[0, 0.2, 0]}
              />
            </Canvas>
          </div>

          <p className="mt-2 text-center text-xs tracking-[-0.01em] text-[#202020]/30">
            Drag left or right to rotate
          </p>

          <div className="mt-5 grid grid-cols-2 rounded-full bg-[#EEEEEE] p-1">
            <button
              type="button"
              onClick={() => setCharacterTab("color")}
              className={`font-fredoka rounded-full py-2.5 font-medium transition ${
                characterTab === "color"
                  ? "bg-white text-[#202020] shadow-sm"
                  : "text-[#202020]/40"
              }`}
            >
              Color
            </button>

            <button
              type="button"
              onClick={() => setCharacterTab("eyes")}
              className={`font-fredoka rounded-full py-2.5 font-medium transition ${
                characterTab === "eyes"
                  ? "bg-white text-[#202020] shadow-sm"
                  : "text-[#202020]/40"
              }`}
            >
              Eyes
            </button>
          </div>

          {characterTab === "color" && (
            <div className="mt-6">
              <p className="mb-4 font-semibold tracking-[-0.01em] text-[#202020]">Body color</p>

              <div className="flex flex-wrap gap-4 px-1 py-1">
                {bodyColors.map((color) => (
                  <button
                    key={color.value}
                    type="button"
                    aria-label={color.name}
                    onClick={() => setBodyColor(color.value)}
                    className={`h-12 w-12 shrink-0 rounded-full transition ${
                      bodyColor === color.value
                        ? "ring-2 ring-[#202020] ring-offset-2 ring-offset-[#F8F8F8]"
                        : ""
                    }`}
                    style={{ backgroundColor: color.value }}
                  />
                ))}
              </div>
            </div>
          )}

          {characterTab === "eyes" && (
            <div className="mt-6">
              <p className="font-fredoka mb-1 text-[18px] font-medium text-[#202020]">Eyes</p>

              <p className="mb-5 text-xs leading-5 tracking-[-0.01em] text-[#202020]/40">
                Left and right are based on what you see on the screen.
              </p>

              <div className="mb-4 grid grid-cols-2 rounded-[20px] bg-[#ECECEC] p-1">
                <button
                  type="button"
                  onClick={() => setEyeTarget("left")}
                  className={`font-fredoka rounded-[17px] py-2.5 text-sm font-medium transition ${
                    eyeTarget === "left"
                      ? "bg-white text-[#202020] shadow-sm"
                      : "text-[#202020]/40"
                  }`}
                >
                  Left eye
                </button>

                <button
                  type="button"
                  onClick={() => setEyeTarget("right")}
                  className={`font-fredoka rounded-[17px] py-2.5 text-sm font-medium transition ${
                    eyeTarget === "right"
                      ? "bg-white text-[#202020] shadow-sm"
                      : "text-[#202020]/40"
                  }`}
                >
                  Right eye
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-2 block text-sm font-semibold tracking-[-0.01em] text-[#202020]">
                    Left
                  </label>

                  <input
                    value={leftEye}
                    onFocus={() => setEyeTarget("left")}
                    onChange={(event) => {
                      const value = Array.from(event.target.value);
                      setLeftEye(value.slice(-1).join(""));
                    }}
                    inputMode="text"
                    autoComplete="off"
                    className={`h-16 w-full rounded-[20px] border-2 bg-white text-center text-2xl font-semibold text-[#202020] outline-none transition ${
                      eyeTarget === "left" ? "border-[#BFFF00]" : "border-transparent"
                    }`}
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold tracking-[-0.01em] text-[#202020]">
                    Right
                  </label>

                  <input
                    value={rightEye}
                    onFocus={() => setEyeTarget("right")}
                    onChange={(event) => {
                      const value = Array.from(event.target.value);
                      setRightEye(value.slice(-1).join(""));
                    }}
                    inputMode="text"
                    autoComplete="off"
                    className={`h-16 w-full rounded-[20px] border-2 bg-white text-center text-2xl font-semibold text-[#202020] outline-none transition ${
                      eyeTarget === "right" ? "border-[#BFFF00]" : "border-transparent"
                    }`}
                  />
                </div>
              </div>

              <p className="font-fredoka mb-3 mt-6 text-sm font-medium text-[#202020]">
                Suggestions
              </p>

              <div className="grid grid-cols-4 gap-2">
                {eyeSuggestions.map((eye) => (
                  <button
                    key={eye}
                    type="button"
                    onClick={() => {
                      if (eyeTarget === "left") {
                        setLeftEye(eye);
                      } else {
                        setRightEye(eye);
                      }
                    }}
                    className="flex h-14 items-center justify-center rounded-[18px] bg-white text-xl font-semibold text-[#202020] transition active:scale-95"
                  >
                    {eye}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="mt-8 pb-[max(1rem,env(safe-area-inset-bottom))]">
            <BottomButton onClick={() => setStep("space")}>Continue</BottomButton>
          </div>
        </div>
      </MobileFrame>
    );
  }

  if (step === "space") {
    return (
      <MobileFrame>
        <div className="hide-scrollbar flex flex-1 flex-col overflow-y-auto px-6 pt-8">
          <BackButton onClick={() => setStep("character")} />

          <h1 className={headingClass}>
            What would you
            <br />
            like to do?
          </h1>

          <p className={`mb-6 mt-3 ${subTextClass}`}>Choose a space and start talking.</p>

          <div className="flex flex-col gap-4 pb-5">
            {spaces.map((item) => {
              const selected = space === item.name;

              return (
                <button
                  key={item.name}
                  type="button"
                  onClick={() => setSpace(item.name)}
                  className="overflow-hidden rounded-[26px] bg-white text-left"
                >
                  <div className="relative h-[155px]">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  </div>

                  <div
                    className={`flex items-center justify-between px-5 py-4 transition ${
                      selected ? "bg-[#BFFF00]" : "bg-white"
                    }`}
                  >
                    <div>
                      <p className="font-fredoka text-[18px] font-medium text-[#202020]">
                        {item.name}
                      </p>

                      <p className="mt-1 text-xs tracking-[-0.01em] text-[#202020]/50">
                        {item.description}
                      </p>
                    </div>

                    <div className="rounded-full bg-white/75 px-3 py-2 text-xs font-semibold text-[#202020]">
                      👥 {item.people}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="px-6 pt-4 pb-[max(2rem,env(safe-area-inset-bottom))]">
          <BottomButton disabled={!space} onClick={() => setStep("landscape")}>
            Enter Space
          </BottomButton>
        </div>
      </MobileFrame>
    );
  }

  return (
    <div className="flex min-h-dvh items-center justify-center bg-[#202020]">
      <div className="text-center">
        <p className="text-sm text-white/50">PlaBla Space</p>

        <h1 className="font-fredoka mt-2 text-4xl font-medium tracking-[-0.02em] text-white">
          {space}
        </h1>

        <p className="mt-4 text-sm text-white/50">
          {language} {" · "} {level} {" · "} {goal}
        </p>

        <button
          type="button"
          onClick={() => setStep("space")}
          className="font-fredoka mt-10 rounded-full bg-[#BFFF00] px-8 py-3 font-medium text-[#202020]"
        >
          Back
        </button>
      </div>
    </div>
  );
}