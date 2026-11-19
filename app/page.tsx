"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
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
  | "English"
  | "Japanese"
  | "Chinese"
  | "Spanish"
  | "French";

type Level =
  | "Beginner"
  | "Intermediate"
  | "Advanced";

type Goal =
  | "Conversation"
  | "Travel"
  | "Study"
  | "Culture";

type Space =
  | "Mafia"
  | "Escape Room"
  | "Describe & Guess"
  | "Shadowing"
  | "Balance Game"
  | "Free Talk";

/* =====================================================
   DATA
===================================================== */

const languages: {
  name: Language;
  symbol: string;
}[] = [
  { name: "English", symbol: "A" },
  { name: "Japanese", symbol: "あ" },
  { name: "Chinese", symbol: "中" },
  { name: "Spanish", symbol: "Ñ" },
  { name: "French", symbol: "É" },
];

const levels: Level[] = [
  "Beginner",
  "Intermediate",
  "Advanced",
];

const goals: Goal[] = [
  "Conversation",
  "Travel",
  "Study",
  "Culture",
];

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

const bodyColors = [
  { name: "Lime", value: "#BFFF00" },
  { name: "Mint", value: "#20D9C2" },
  { name: "Blue", value: "#59B8FF" },
  { name: "Pink", value: "#FD7FC6" },
  { name: "Yellow", value: "#FFFA2E" },
];

const eyeSuggestions = [
  "の",
  "中",
  "ก",
  "ع",
  "Ω",
  "๖",
];

/* =====================================================
   EYE TEXTURE
===================================================== */

function createEyeTexture(text: string) {
  const canvas = document.createElement("canvas");

  canvas.width = 512;
  canvas.height = 512;

  const context = canvas.getContext("2d");

  if (!context) {
    return null;
  }

  context.clearRect(
    0,
    0,
    canvas.width,
    canvas.height
  );

  context.textAlign = "center";
  context.textBaseline = "middle";

  context.font =
    '700 310px Arial, "Apple SD Gothic Neo", sans-serif';

  context.fillStyle = "#202020";
  context.strokeStyle = "#202020";

  context.lineWidth = 16;
  context.lineJoin = "round";
  context.miterLimit = 2;

  context.strokeText(
    text || " ",
    256,
    278
  );

  context.fillText(
    text || " ",
    256,
    278
  );

  const texture =
    new THREE.CanvasTexture(canvas);

  texture.colorSpace =
    THREE.SRGBColorSpace;

  texture.needsUpdate = true;

  return texture;
}

/* =====================================================
   3D EYE
===================================================== */

function Eye3D({
  text,
  position,
  rotation,
}: {
  text: string;
  position: [number, number, number];
  rotation: [number, number, number];
}) {
  const texture = useMemo(
    () => createEyeTexture(text),
    [text]
  );

  if (!texture) {
    return null;
  }

  return (
    <mesh
      position={position}
      rotation={rotation}
    >
      <planeGeometry
        args={[0.38, 0.38]}
      />

      <meshBasicMaterial
        map={texture}
        transparent
        alphaTest={0.02}
        depthWrite={false}
        side={THREE.DoubleSide}
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
  const materials = useLoader(
    MTLLoader,
    "/mbd_character_eyeX.mtl"
  );

  materials.preload();

  const object = useLoader(
    OBJLoader,
    "/mbd_character_eyeX.obj",
    (loader) => {
      loader.setMaterials(materials);
    }
  );

  const model = useMemo(() => {
    const cloned =
      object.clone(true);

    cloned.traverse((child) => {
      if (!(child instanceof THREE.Mesh)) {
        return;
      }

      if (Array.isArray(child.material)) {
        child.material =
          child.material.map((material) => {
            const copy =
              material.clone();

            if (
              copy.name ===
              "bodyColor_Green"
            ) {
              copy.color.set(
                bodyColor
              );
            }

            return copy;
          });
      } else if (child.material) {
        const copy =
          child.material.clone();

        if (
          copy.name ===
          "bodyColor_Green"
        ) {
          copy.color.set(
            bodyColor
          );
        }

        child.material = copy;
      }
    });

    return cloned;
  }, [object, bodyColor]);

  /* 화면 기준 왼쪽 위치 */
  const screenLeftEyePosition: [
    number,
    number,
    number
  ] = [
    -27.42,
    1.42,
    -23.73,
  ];

  /* 화면 기준 오른쪽 위치 */
  const screenRightEyePosition: [
    number,
    number,
    number
  ] = [
    -27.90,
    1.42,
    -23.73,
  ];

  /* 곡률 */
  const screenLeftEyeRotation: [
    number,
    number,
    number
  ] = [
    0,
    Math.PI - 0.18,
    0,
  ];

  const screenRightEyeRotation: [
    number,
    number,
    number
  ] = [
    0,
    Math.PI + 0.18,
    0,
  ];

  return (
    <Center>
      <group
        scale={0.64}
        position={[0, 0.18, 0]}
        rotation={[
          0,
          Math.PI,
          0,
        ]}
      >
        <primitive object={model} />

        {/* 화면에서 봤을 때 왼쪽 */}
        <Eye3D
          text={leftEye}
          position={screenLeftEyePosition}
          rotation={screenLeftEyeRotation}
        />

        {/* 화면에서 봤을 때 오른쪽 */}
        <Eye3D
          text={rightEye}
          position={screenRightEyePosition}
          rotation={screenRightEyeRotation}
        />
      </group>
    </Center>
  );
}

/* =====================================================
   MAIN
===================================================== */

export default function Home() {
  const [step, setStep] =
    useState<Step>("start");

  const [language, setLanguage] =
    useState<Language | null>(
      null
    );

  const [level, setLevel] =
    useState<Level | null>(
      null
    );

  const [goal, setGoal] =
    useState<Goal | null>(
      null
    );

  const [space, setSpace] =
    useState<Space | null>(
      null
    );

  const [
    bodyColor,
    setBodyColor,
  ] =
    useState("#BFFF00");

  const [
    leftEye,
    setLeftEye,
  ] =
    useState("の");

  const [
    rightEye,
    setRightEye,
  ] =
    useState("中");

  const [
    characterTab,
    setCharacterTab,
  ] = useState<
    "color" | "eyes"
  >("color");

  /* =====================================================
     COMMON UI
  ===================================================== */

  const MobileFrame = ({
    children,
  }: {
    children:
      React.ReactNode;
  }) => (
    <div className="flex min-h-dvh items-center justify-center bg-[#F2F2F2]">
      <main className="relative flex h-dvh w-full max-w-[430px] flex-col overflow-hidden bg-[#F8F8F8] sm:h-[min(100dvh,844px)] sm:rounded-[2.5rem] sm:shadow-[0_24px_60px_rgba(32,32,32,0.08)]">
        {children}
      </main>
    </div>
  );

  const BackButton = ({
    onClick,
  }: {
    onClick: () => void;
  }) => (
    <button
      type="button"
      onClick={onClick}
      aria-label="Go back"
      className="mb-6 flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-white/70 shadow-[0_10px_30px_rgba(0,0,0,0.08)] backdrop-blur-xl transition active:scale-95"
      style={{
        background:
          "linear-gradient(135deg, rgba(255,255,255,0.82), rgba(255,255,255,0.35))",
      }}
    >
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
      >
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
    children:
      React.ReactNode;
    disabled?: boolean;
    onClick: () => void;
  }) => (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={`h-14 w-full rounded-full text-lg font-bold transition ${
        disabled
          ? "cursor-not-allowed bg-[#E4E4E4] text-[#999999]"
          : "bg-[#BFFF00] text-[#202020] active:scale-[0.98]"
      }`}
    >
      {children}
    </button>
  );

  /* =====================================================
     START
  ===================================================== */

  if (step === "start") {
    return (
      <MobileFrame>
        <div className="flex flex-1 items-center justify-center px-8">

          <Image
            src="/plabla-logo-transparent.svg"
            alt="PlaBla Logo"
            width={280}
            height={180}
            priority
            className="h-auto w-[210px]"
          />

        </div>

        <div className="px-6 pb-[max(2rem,env(safe-area-inset-bottom))]">

          <BottomButton
            onClick={() =>
              setStep("language")
            }
          >
            Start
          </BottomButton>

        </div>
      </MobileFrame>
    );
  }

  /* =====================================================
     LANGUAGE
  ===================================================== */

  if (step === "language") {
    return (
      <MobileFrame>

        <div className="flex flex-1 flex-col overflow-y-auto px-6 pt-8">

          <BackButton
            onClick={() =>
              setStep("start")
            }
          />

          <h1 className="mb-2 text-3xl font-bold text-[#202020]">
            Choose the language
            <br />
            you want to learn.
          </h1>

          <p className="mb-8 text-sm text-[#202020]/45">
            Select one language to continue.
          </p>

          <div className="flex flex-col gap-3">

            {languages.map((item) => {
              const selected =
                language === item.name;

              return (
                <button
                  key={item.name}
                  type="button"
                  onClick={() =>
                    setLanguage(
                      item.name
                    )
                  }
                  className={`flex h-[72px] items-center gap-4 rounded-[22px] border-2 px-4 text-left ${
                    selected
                      ? "border-[#BFFF00] bg-[#F7FFE5]"
                      : "border-transparent bg-white"
                  }`}
                >
                  <div
                    className={`flex h-11 w-11 items-center justify-center rounded-full text-lg font-bold ${
                      selected
                        ? "bg-[#BFFF00]"
                        : "bg-[#F1F1F1]"
                    }`}
                  >
                    {item.symbol}
                  </div>

                  <span className="font-semibold text-[#202020]">
                    {item.name}
                  </span>
                </button>
              );
            })}

          </div>

        </div>

        <div className="px-6 pt-5 pb-[max(2rem,env(safe-area-inset-bottom))]">

          <BottomButton
            disabled={!language}
            onClick={() =>
              setStep("info")
            }
          >
            Next
          </BottomButton>

        </div>

      </MobileFrame>
    );
  }

  /* =====================================================
     INFO
  ===================================================== */

  if (step === "info") {
    return (
      <MobileFrame>

        <div className="flex flex-1 flex-col overflow-y-auto px-6 pt-8">

          <BackButton
            onClick={() =>
              setStep("language")
            }
          />

          <h1 className="mb-2 text-3xl font-bold text-[#202020]">
            Tell us about
            <br />
            your learning.
          </h1>

          <p className="mb-8 text-sm text-[#202020]/45">
            This helps us find the right experience for you.
          </p>

          <section className="mb-8">

            <h2 className="mb-3 font-bold">
              Your level
            </h2>

            <div className="grid grid-cols-3 gap-3">

              {levels.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() =>
                    setLevel(item)
                  }
                  className={`h-[76px] rounded-[22px] border-2 text-sm font-semibold ${
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

            <h2 className="mb-3 font-bold">
              Learning goal
            </h2>

            <div className="grid grid-cols-2 gap-3">

              {goals.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() =>
                    setGoal(item)
                  }
                  className={`h-[76px] rounded-[22px] border-2 font-semibold ${
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

          <BottomButton
            disabled={!level || !goal}
            onClick={() =>
              setStep("character")
            }
          >
            Next
          </BottomButton>

        </div>

      </MobileFrame>
    );
  }

  /* =====================================================
     CHARACTER
  ===================================================== */

  if (step === "character") {
    return (
      <MobileFrame>

        <div className="flex-1 overflow-y-auto overscroll-y-contain px-6 pt-8 pb-8">

          <BackButton
            onClick={() =>
              setStep("info")
            }
          />

          <h1 className="text-3xl font-bold text-[#202020]">
            Make it yours.
          </h1>

          <p className="mt-2 text-sm text-[#202020]/45">
            Create your PlaBla character.
          </p>

          <div className="relative mt-5 h-[285px] w-full overflow-hidden rounded-[30px] bg-white sm:h-[330px]">

            <Canvas
              camera={{
                position: [
                  0,
                  0.18,
                  3.8,
                ],
                fov: 32,
              }}
            >

              <ambientLight
                intensity={2.7}
              />

              <directionalLight
                position={[
                  4,
                  6,
                  6,
                ]}
                intensity={2.8}
              />

              <directionalLight
                position={[
                  -4,
                  2,
                  3,
                ]}
                intensity={1.4}
              />

              <CharacterModel
                bodyColor={bodyColor}
                leftEye={leftEye}
                rightEye={rightEye}
              />

              <OrbitControls
                enablePan={false}
                enableZoom={false}
                enableRotate={true}
                target={[
                  0,
                  0.2,
                  0,
                ]}
              />

            </Canvas>

          </div>

          <p className="mt-2 text-center text-xs text-[#202020]/30">
            Drag to rotate
          </p>

          <div className="mt-5 grid grid-cols-2 rounded-full bg-[#EEEEEE] p-1">

            <button
              type="button"
              onClick={() =>
                setCharacterTab(
                  "color"
                )
              }
              className={`rounded-full py-2.5 font-semibold transition ${
                characterTab ===
                "color"
                  ? "bg-white text-[#202020] shadow-sm"
                  : "text-[#202020]/40"
              }`}
            >
              Color
            </button>

            <button
              type="button"
              onClick={() =>
                setCharacterTab(
                  "eyes"
                )
              }
              className={`rounded-full py-2.5 font-semibold transition ${
                characterTab ===
                "eyes"
                  ? "bg-white text-[#202020] shadow-sm"
                  : "text-[#202020]/40"
              }`}
            >
              Eyes
            </button>

          </div>

          {characterTab === "color" && (
            <div className="mt-6">

              <p className="mb-4 font-bold text-[#202020]">
                Body color
              </p>

              <div className="flex flex-wrap gap-4 px-1 py-1">

                {bodyColors.map((color) => (
                  <button
                    key={color.value}
                    type="button"
                    aria-label={color.name}
                    onClick={() =>
                      setBodyColor(
                        color.value
                      )
                    }
                    className={`h-12 w-12 shrink-0 rounded-full ${
                      bodyColor ===
                      color.value
                        ? "ring-2 ring-[#202020] ring-offset-1 ring-offset-[#F8F8F8]"
                        : ""
                    }`}
                    style={{
                      backgroundColor:
                        color.value,
                    }}
                  />
                ))}

              </div>

            </div>
          )}

          {characterTab === "eyes" && (
            <div className="mt-6">

              <p className="mb-1 font-bold text-[#202020]">
                Eyes
              </p>

              <p className="mb-5 text-xs text-[#202020]/40">
                Left and right are based on what you see on the screen.
              </p>

              <div className="grid grid-cols-2 gap-3">

                <div>

                  <label className="mb-2 block text-sm font-semibold text-[#202020]">
                    Left eye
                  </label>

                  <input
                    value={leftEye}
                    onChange={(event) => {
                      const value =
                        Array.from(
                          event.target.value
                        );

                      setLeftEye(
                        value
                          .slice(-1)
                          .join("")
                      );
                    }}
                    placeholder="の"
                    inputMode="text"
                    autoComplete="off"
                    className="h-16 w-full rounded-[20px] border-2 border-transparent bg-white text-center text-2xl text-[#202020] outline-none transition focus:border-[#BFFF00]"
                  />

                </div>

                <div>

                  <label className="mb-2 block text-sm font-semibold text-[#202020]">
                    Right eye
                  </label>

                  <input
                    value={rightEye}
                    onChange={(event) => {
                      const value =
                        Array.from(
                          event.target.value
                        );

                      setRightEye(
                        value
                          .slice(-1)
                          .join("")
                      );
                    }}
                    placeholder="中"
                    inputMode="text"
                    autoComplete="off"
                    className="h-16 w-full rounded-[20px] border-2 border-transparent bg-white text-center text-2xl text-[#202020] outline-none transition focus:border-[#BFFF00]"
                  />

                </div>

              </div>

              <p className="mb-3 mt-6 text-sm font-semibold text-[#202020]">
                Suggestions
              </p>

              <div className="grid grid-cols-6 gap-2">

                {eyeSuggestions.map((eye) => (
                  <button
                    key={eye}
                    type="button"
                    onClick={() =>
                      setLeftEye(eye)
                    }
                    className="aspect-square rounded-[16px] bg-white text-xl text-[#202020]"
                  >
                    {eye}
                  </button>
                ))}

              </div>

            </div>
          )}

          <div className="mt-8 pb-[max(1rem,env(safe-area-inset-bottom))]">

            <BottomButton
              onClick={() =>
                setStep("space")
              }
            >
              Continue
            </BottomButton>

          </div>

        </div>

      </MobileFrame>
    );
  }

  /* =====================================================
     SPACE
  ===================================================== */

  if (step === "space") {
    return (
      <MobileFrame>

        <div className="flex flex-1 flex-col overflow-y-auto px-6 pt-8">

          <BackButton
            onClick={() =>
              setStep("character")
            }
          />

          <h1 className="mb-2 text-3xl font-bold text-[#202020]">
            What would you
            <br />
            like to do?
          </h1>

          <p className="mb-6 text-sm text-[#202020]/45">
            Choose a space and start talking.
          </p>

          <div className="flex flex-col gap-4 pb-5">

            {spaces.map((item) => {
              const selected =
                space === item.name;

              return (
                <button
                  key={item.name}
                  type="button"
                  onClick={() =>
                    setSpace(
                      item.name
                    )
                  }
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
                    className={`flex items-center justify-between px-5 py-4 ${
                      selected
                        ? "bg-[#BFFF00]"
                        : "bg-white"
                    }`}
                  >

                    <div>

                      <p className="font-bold text-[#202020]">
                        {item.name}
                      </p>

                      <p className="mt-1 text-xs text-[#202020]/50">
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

          <BottomButton
            disabled={!space}
            onClick={() =>
              setStep("landscape")
            }
          >
            Enter Space
          </BottomButton>

        </div>

      </MobileFrame>
    );
  }

  return (
    <div className="flex min-h-dvh items-center justify-center bg-[#202020]">

      <div className="text-center">

        <p className="text-sm text-white/50">
          PlaBla Space
        </p>

        <h1 className="mt-2 text-4xl font-bold text-white">
          {space}
        </h1>

        <p className="mt-4 text-sm text-white/50">
          {language} · {level} · {goal}
        </p>

        <button
          type="button"
          onClick={() =>
            setStep("space")
          }
          className="mt-10 rounded-full bg-[#BFFF00] px-8 py-3 font-bold text-[#202020]"
        >
          Back
        </button>

      </div>

    </div>
  );
}