"use client";

import Image from "next/image";
import {
  PointerEvent as ReactPointerEvent,
  ReactNode,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

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
  | "home"
  | "space"
  | "landscape"
  | "profile"
  | "settings";

type AppTab = "home" | "space" | "profile" | "settings";

type AppLanguage = "en" | "ko";

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
   TRANSLATION
===================================================== */

const translations = {
  en: {
    chooseLanguage: "Choose the language\nyou want to learn.",
    chooseLanguageSub: "Select one language to continue.",

    tellUs: "Tell us about\nyour learning.",
    tellUsSub: "This helps us find the right experience for you.",

    yourLevel: "Your level",
    learningGoal: "Learning goal",

    makeItYours: "Make it yours.",
    createCharacter: "Create your PlaBla character.",
    dragRotate: "Drag left or right to rotate",

    color: "Color",
    eyes: "Eyes",
    bodyColor: "Body color",
    leftEye: "Left eye",
    rightEye: "Right eye",
    suggestions: "Suggestions",

    next: "Next",
    continue: "Continue",

    hi: "Hi",
    readyToTalk: "Ready to talk?",

    learning: "Learning",
    goal: "Goal",

    jumpIntoSpace: "Jump into a space",
    seeAll: "See all",

    spacesTitle: "What would you\nlike to do?",
    spacesSub: "Choose a space and start talking.",

    entering: "You're entering",

    yourProfile: "Your profile.",
    profileSub: "Your PlaBla identity and learning setup.",

    language: "Language",
    level: "Level",

    editCharacter: "Edit character",

    settings: "Settings.",
    settingsSub: "Adjust your PlaBla experience.",

    general: "General",
    appLanguage: "App language",

    account: "Account",
    displayName: "Display name",
    editName: "Edit name",
    edit: "Edit",
    save: "Save",
    cancel: "Cancel",

    manageAccount: "Manage account",

    learningSettings: "Learning",
    learningLanguage: "Learning language",

    notificationsTitle: "Notifications",

    notifications: "Notifications",
    notificationsDesc: "Space invites and activity alerts",

    sound: "Sound",
    soundDesc: "Interface and game sounds",

    vibration: "Vibration",
    vibrationDesc: "Haptic feedback on supported devices",

    app: "App",

    setupAgain: "Set up my preferences again",

    resetAppData: "Reset app data",
    resetAppDataDesc: "Erase PlaBla settings on this device",

    home: "Home",
    spaces: "Spaces",
    profile: "Profile",
    settingsTab: "Settings",

    customColor: "Custom color",
    customColorSub: "Preview it on your character first.",
    select: "Select",

    eyeHelp:
      "Left and right are based on what you see on the screen.",
  },

  ko: {
    chooseLanguage: "배우고 싶은\n언어를 선택해주세요.",
    chooseLanguageSub: "학습할 언어 하나를 선택해주세요.",

    tellUs: "학습 정보를\n알려주세요.",
    tellUsSub: "나에게 맞는 대화 경험을 추천하는 데 활용돼요.",

    yourLevel: "나의 레벨",
    learningGoal: "학습 목표",

    makeItYours: "나만의 캐릭터.",
    createCharacter: "PlaBla 캐릭터를 만들어보세요.",
    dragRotate: "좌우로 드래그하여 회전",

    color: "컬러",
    eyes: "눈",
    bodyColor: "바디 컬러",
    leftEye: "왼쪽 눈",
    rightEye: "오른쪽 눈",
    suggestions: "추천",

    next: "다음",
    continue: "계속하기",

    hi: "안녕하세요",
    readyToTalk: "대화를 시작해볼까요?",

    learning: "학습 중",
    goal: "목표",

    jumpIntoSpace: "바로 참여하기",
    seeAll: "전체 보기",

    spacesTitle: "어떤 대화를\n시작해볼까요?",
    spacesSub: "공간을 선택하고 바로 대화를 시작해보세요.",

    entering: "입장 중",

    yourProfile: "나의 프로필.",
    profileSub: "PlaBla 캐릭터와 학습 설정을 확인해보세요.",

    language: "학습 언어",
    level: "레벨",

    editCharacter: "캐릭터 수정",

    settings: "설정",
    settingsSub: "PlaBla 환경을 원하는 대로 설정해보세요.",

    general: "일반",
    appLanguage: "앱 언어",

    account: "계정",
    displayName: "프로필 이름",
    editName: "이름 수정",
    edit: "수정",
    save: "저장",
    cancel: "취소",

    manageAccount: "계정 관리",

    learningSettings: "학습 설정",
    learningLanguage: "학습 언어",

    notificationsTitle: "알림 설정",

    notifications: "알림",
    notificationsDesc: "공간 초대 및 활동 알림",

    sound: "사운드",
    soundDesc: "인터페이스 및 게임 소리",

    vibration: "진동",
    vibrationDesc: "지원되는 기기에서 햅틱 피드백 사용",

    app: "앱",

    setupAgain: "처음부터 다시 설정하기",

    resetAppData: "앱 데이터 초기화",
    resetAppDataDesc: "이 기기에 저장된 PlaBla 설정 삭제",

    home: "홈",
    spaces: "공간",
    profile: "프로필",
    settingsTab: "설정",

    customColor: "사용자 지정 컬러",
    customColorSub: "캐릭터에 적용된 모습을 먼저 확인해보세요.",
    select: "선택",

    eyeHelp:
      "왼쪽과 오른쪽은 화면에서 보이는 방향을 기준으로 해요.",
  },
};

/* =====================================================
   DATA
===================================================== */

const languages: {
  name: Language;
  symbol: string;
  ko: string;
}[] = [
  {
    name: "Korean",
    symbol: "한",
    ko: "한국어",
  },
  {
    name: "English",
    symbol: "A",
    ko: "영어",
  },
  {
    name: "Japanese",
    symbol: "あ",
    ko: "일본어",
  },
  {
    name: "Chinese",
    symbol: "中",
    ko: "중국어",
  },
  {
    name: "Spanish",
    symbol: "Ñ",
    ko: "스페인어",
  },
  {
    name: "French",
    symbol: "É",
    ko: "프랑스어",
  },
];

const levels: {
  value: Level;
  ko: string;
}[] = [
  {
    value: "Beginner",
    ko: "초급",
  },
  {
    value: "Intermediate",
    ko: "중급",
  },
  {
    value: "Advanced",
    ko: "고급",
  },
];

const goals: {
  value: Goal;
  ko: string;
}[] = [
  {
    value: "Conversation",
    ko: "회화",
  },
  {
    value: "Travel",
    ko: "여행",
  },
  {
    value: "Study",
    ko: "학습",
  },
  {
    value: "Culture",
    ko: "문화",
  },
];

const bodyColors = [
  { name: "Lime", value: "#C7F238" },
  { name: "Mint", value: "#74DDD1" },
  { name: "Blue", value: "#78C0F0" },
  { name: "Pink", value: "#EE98CF" },
  { name: "Yellow", value: "#F7E66A" },
  { name: "Purple", value: "#B8A4F4" },
  { name: "Peach", value: "#FFB58E" },
];

const eyeSuggestions = [
  "P",
  "B",
  "の",
  "中",
  "あ",
  "ㅎ",
  "Ω",
  "丸",
];

const spaces: {
  name: Space;
  ko: string;
  image: string;
  people: string;
  description: string;
  koDescription: string;
}[] = [
  {
    name: "Mafia",
    ko: "마피아",
    image: "/mafia.png",
    people: "6 / 8",
    description: "Discuss, suspect, and defend.",
    koDescription: "의심하고 토론하며 서로를 설득해보세요.",
  },
  {
    name: "Escape Room",
    ko: "방탈출",
    image: "/escape-room.png",
    people: "4 / 6",
    description: "Find clues and solve together.",
    koDescription: "단서를 찾고 함께 문제를 해결해보세요.",
  },
  {
    name: "Describe & Guess",
    ko: "설명하고 맞히기",
    image: "/describe-guess.png",
    people: "5 / 8",
    description: "Describe it and let others guess.",
    koDescription: "설명을 듣고 정답을 맞혀보세요.",
  },
  {
    name: "Shadowing",
    ko: "쉐도잉",
    image: "/shadowing.png",
    people: "4 / 6",
    description: "Listen, repeat, and practice together.",
    koDescription: "듣고 따라 말하며 함께 연습해보세요.",
  },
  {
    name: "Balance Game",
    ko: "밸런스 게임",
    image: "/balance-game.png",
    people: "6 / 10",
    description: "Choose a side and explain why.",
    koDescription: "하나를 고르고 그 이유를 이야기해보세요.",
  },
  {
    name: "Free Talk",
    ko: "자유 대화",
    image: "/free-talk.png",
    people: "7 / 10",
    description: "Relax and talk freely.",
    koDescription: "부담 없이 자유롭게 이야기해보세요.",
  },
];

/* =====================================================
   COLOR HELPERS
===================================================== */

function hsvToHex(
  h: number,
  s: number,
  v: number
) {
  const c = v * s;

  const x =
    c *
    (1 -
      Math.abs(
        ((h / 60) % 2) - 1
      ));

  const m = v - c;

  let r = 0;
  let g = 0;
  let b = 0;

  if (h < 60) {
    r = c;
    g = x;
  } else if (h < 120) {
    r = x;
    g = c;
  } else if (h < 180) {
    g = c;
    b = x;
  } else if (h < 240) {
    g = x;
    b = c;
  } else if (h < 300) {
    r = x;
    b = c;
  } else {
    r = c;
    b = x;
  }

  const toHex = (
    value: number
  ) =>
    Math.round(
      (value + m) * 255
    )
      .toString(16)
      .padStart(2, "0");

  return (
    "#" +
    toHex(r) +
    toHex(g) +
    toHex(b)
  ).toUpperCase();
}

function hueToHex(
  hue: number
) {
  return hsvToHex(
    hue,
    1,
    1
  );
}

function hexToHsv(
  hex: string
) {
  const clean =
    hex.replace("#", "");

  const r =
    parseInt(
      clean.slice(0, 2),
      16
    ) / 255;

  const g =
    parseInt(
      clean.slice(2, 4),
      16
    ) / 255;

  const b =
    parseInt(
      clean.slice(4, 6),
      16
    ) / 255;

  const max =
    Math.max(
      r,
      g,
      b
    );

  const min =
    Math.min(
      r,
      g,
      b
    );

  const delta =
    max - min;

  let h = 0;

  if (delta !== 0) {
    if (max === r) {
      h =
        60 *
        (((g - b) /
          delta) %
          6);
    } else if (
      max === g
    ) {
      h =
        60 *
        ((b - r) /
          delta +
          2);
    } else {
      h =
        60 *
        ((r - g) /
          delta +
          4);
    }
  }

  if (h < 0) {
    h += 360;
  }

  return {
    h,
    s:
      max === 0
        ? 0
        : delta / max,
    v: max,
  };
}

/* =====================================================
   EYE TEXTURE
===================================================== */

function createEyeTexture(
  text: string
) {
  const canvas =
    document.createElement(
      "canvas"
    );

  canvas.width = 1024;
  canvas.height = 1024;

  const ctx =
    canvas.getContext(
      "2d"
    );

  if (!ctx) {
    return null;
  }

  ctx.clearRect(
    0,
    0,
    1024,
    1024
  );

  ctx.textAlign =
    "center";

  ctx.textBaseline =
    "middle";

  ctx.lineJoin =
    "round";

  ctx.lineCap =
    "round";

  const isLatin =
    /^[A-Za-z0-9]$/.test(
      text
    );

  const isJapanese =
    /[\u3040-\u30ff]/.test(
      text
    );

  const isChinese =
    /[\u3400-\u9fff]/.test(
      text
    );

  const isKorean =
    /[\uac00-\ud7af\u3130-\u318f]/.test(
      text
    );

  let fontSize = 590;

  if (isLatin) {
    fontSize = 610;
  }

  if (isJapanese) {
    fontSize = 580;
  }

  if (isChinese) {
    fontSize = 545;
  }

  if (isKorean) {
    fontSize = 565;
  }

  ctx.font =
    `650 ${fontSize}px ` +
    `"Pretendard Variable", ` +
    `Pretendard, Arial, sans-serif`;

  ctx.fillStyle =
    "#272727";

  ctx.strokeStyle =
    "#272727";

  ctx.lineWidth = 4;

  ctx.strokeText(
    text || " ",
    512,
    530
  );

  ctx.fillText(
    text || " ",
    512,
    530
  );

  const texture =
    new THREE.CanvasTexture(
      canvas
    );

  texture.colorSpace =
    THREE.SRGBColorSpace;

  texture.minFilter =
    THREE.LinearFilter;

  texture.magFilter =
    THREE.LinearFilter;

  texture.needsUpdate =
    true;

  return texture;
}

/* =====================================================
   EYE 3D
===================================================== */

function Eye3D({
  text,
  position,
  rotation,
}: {
  text: string;

  position: [
    number,
    number,
    number
  ];

  rotation: [
    number,
    number,
    number
  ];
}) {
  const [
    texture,
    setTexture,
  ] =
    useState<
      THREE.CanvasTexture | null
    >(null);

  useEffect(() => {
    let active = true;

    async function makeTexture() {
      await document.fonts.ready;

      if (!active) {
        return;
      }

      const next =
        createEyeTexture(
          text
        );

      setTexture(
        (
          previous
        ) => {
          previous?.dispose();

          return next;
        }
      );
    }

    makeTexture();

    return () => {
      active = false;
    };
  }, [text]);

  if (!texture) {
    return null;
  }

  return (
    <mesh
      position={position}
      rotation={rotation}
      renderOrder={50}
    >

      <planeGeometry
        args={[
          0.35,
          0.35,
        ]}
      />

      <meshBasicMaterial
        map={texture}
        transparent
        alphaTest={0.005}
        depthWrite={false}
        polygonOffset
        polygonOffsetFactor={-4}
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
  const materials =
    useLoader(
      MTLLoader,
      "/mbd_character_eyeX.mtl"
    );

  materials.preload();

  const object =
    useLoader(
      OBJLoader,
      "/mbd_character_eyeX.obj",
      (
        loader
      ) => {
        loader.setMaterials(
          materials
        );
      }
    );

  const model =
    useMemo(() => {
      const cloned =
        object.clone(
          true
        );

      cloned.traverse(
        (
          child
        ) => {
          if (
            !(
              child instanceof
              THREE.Mesh
            )
          ) {
            return;
          }

          const changeMaterial =
            (
              material:
                THREE.Material
            ) => {
              const copy =
                material.clone();

              if (
                copy.name ===
                  "bodyColor_Green" &&
                "color" in copy
              ) {
                (
                  copy as THREE.MeshPhongMaterial
                ).color.set(
                  bodyColor
                );
              }

              return copy;
            };

          if (
            Array.isArray(
              child.material
            )
          ) {
            child.material =
              child.material.map(
                changeMaterial
              );
          } else {
            child.material =
              changeMaterial(
                child.material
              );
          }
        }
      );

      return cloned;
    }, [
      object,
      bodyColor,
    ]);

  return (
    <Center>

      <group
        scale={0.64}
        position={[
          0,
          0.18,
          0,
        ]}
        rotation={[
          0,
          Math.PI,
          0,
        ]}
      >

        <primitive
          object={model}
        />

        <Eye3D
          text={leftEye}
          position={[
            -27.46,
            1.43,
            -23.72,
          ]}
          rotation={[
            0,
            Math.PI -
              0.03,
            0,
          ]}
        />

        <Eye3D
          text={rightEye}
          position={[
            -27.86,
            1.43,
            -23.72,
          ]}
          rotation={[
            0,
            Math.PI +
              0.03,
            0,
          ]}
        />

      </group>

    </Center>
  );
}

/* =====================================================
   CHARACTER VIEW
===================================================== */

function CharacterView({
  bodyColor,
  leftEye,
  rightEye,
  rotate = false,
}: {
  bodyColor: string;
  leftEye: string;
  rightEye: string;
  rotate?: boolean;
}) {
  return (
    <Canvas
      camera={{
        position: [
          0,
          0.18,
          3.8,
        ],
        fov: 32,
      }}
      gl={{
        antialias:
          true,
      }}
    >

      <ambientLight
        intensity={
          2.45
        }
      />

      <directionalLight
        position={[
          4,
          6,
          6,
        ]}
        intensity={
          2.5
        }
      />

      <directionalLight
        position={[
          -4,
          2,
          3,
        ]}
        intensity={
          1.2
        }
      />

      <CharacterModel
        bodyColor={
          bodyColor
        }
        leftEye={
          leftEye
        }
        rightEye={
          rightEye
        }
      />

      {rotate && (
        <OrbitControls
          enablePan={
            false
          }
          enableZoom={
            false
          }
          minPolarAngle={
            Math.PI / 2
          }
          maxPolarAngle={
            Math.PI / 2
          }
          minAzimuthAngle={
            -0.78
          }
          maxAzimuthAngle={
            0.78
          }
          target={[
            0,
            0.2,
            0,
          ]}
        />
      )}

    </Canvas>
  );
}

/* =====================================================
   CUSTOM COLOR
===================================================== */

function CustomColorPicker({
  initialColor,
  leftEye,
  rightEye,
  appLanguage,
  onCancel,
  onSelect,
}: {
  initialColor: string;
  leftEye: string;
  rightEye: string;
  appLanguage: AppLanguage;
  onCancel:
    () => void;
  onSelect:
    (
      color: string
    ) => void;
}) {
  const t =
    translations[
      appLanguage
    ];

  const initial =
    useMemo(
      () =>
        hexToHsv(
          initialColor
        ),
      [initialColor]
    );

  const [
    hue,
    setHue,
  ] =
    useState(
      initial.h
    );

  const [
    saturation,
    setSaturation,
  ] =
    useState(
      initial.s
    );

  const [
    brightness,
    setBrightness,
  ] =
    useState(
      initial.v
    );

  const squareRef =
    useRef<HTMLDivElement>(
      null
    );

  const hueRef =
    useRef<HTMLDivElement>(
      null
    );

  const previewColor =
    hsvToHex(
      hue,
      saturation,
      brightness
    );

  function updateSquare(
    event:
      | ReactPointerEvent<HTMLDivElement>
      | PointerEvent
  ) {
    const element =
      squareRef.current;

    if (!element) {
      return;
    }

    const rect =
      element.getBoundingClientRect();

    const x =
      Math.max(
        0,
        Math.min(
          rect.width,
          event.clientX -
            rect.left
        )
      );

    const y =
      Math.max(
        0,
        Math.min(
          rect.height,
          event.clientY -
            rect.top
        )
      );

    setSaturation(
      x /
        rect.width
    );

    setBrightness(
      1 -
        y /
          rect.height
    );
  }

  function updateHue(
    event:
      | ReactPointerEvent<HTMLDivElement>
      | PointerEvent
  ) {
    const element =
      hueRef.current;

    if (!element) {
      return;
    }

    const rect =
      element.getBoundingClientRect();

    const x =
      Math.max(
        0,
        Math.min(
          rect.width,
          event.clientX -
            rect.left
        )
      );

    setHue(
      (x /
        rect.width) *
        360
    );
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/25 px-4 backdrop-blur-[3px]">

      <div className="hide-scrollbar max-h-[94dvh] w-full max-w-[390px] overflow-y-auto rounded-[30px] bg-white p-5">

        <div className="flex items-start justify-between">

          <div>

            <h3 className="font-pretendard text-[19px] font-semibold">
              {
                t.customColor
              }
            </h3>

            <p className="font-pretendard mt-1 text-[13px] text-[#202020]/40">
              {
                t.customColorSub
              }
            </p>

          </div>

          <div
            className="h-11 w-11 rounded-full"
            style={{
              backgroundColor:
                previewColor,
            }}
          />

        </div>

        <div className="mt-4 h-[175px] overflow-hidden rounded-[22px] bg-[#F8F8F8]">

          <CharacterView
            bodyColor={
              previewColor
            }
            leftEye={
              leftEye
            }
            rightEye={
              rightEye
            }
          />

        </div>

        <div
          ref={squareRef}
          onPointerDown={(
            event
          ) => {
            event.currentTarget.setPointerCapture(
              event.pointerId
            );

            updateSquare(
              event
            );
          }}
          onPointerMove={(
            event
          ) => {
            if (
              event.buttons ===
              1
            ) {
              updateSquare(
                event
              );
            }
          }}
          className="relative mt-4 h-[185px] touch-none overflow-hidden rounded-[20px]"
          style={{
            backgroundColor:
              hueToHex(
                hue
              ),
          }}
        >

          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to right,#fff,transparent)",
            }}
          />

          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to bottom,transparent,#000)",
            }}
          />

          <div
            className="pointer-events-none absolute h-6 w-6 -translate-x-1/2 -translate-y-1/2 rounded-full border-[3px] border-white shadow"
            style={{
              left: `${
                saturation *
                100
              }%`,
              top: `${
                (1 -
                  brightness) *
                100
              }%`,
            }}
          />

        </div>

        <div
          ref={hueRef}
          onPointerDown={(
            event
          ) => {
            event.currentTarget.setPointerCapture(
              event.pointerId
            );

            updateHue(
              event
            );
          }}
          onPointerMove={(
            event
          ) => {
            if (
              event.buttons ===
              1
            ) {
              updateHue(
                event
              );
            }
          }}
          className="relative mt-4 h-7 touch-none rounded-full"
          style={{
            background:
              "linear-gradient(to right,#f00,#ff0,#0f0,#0ff,#00f,#f0f,#f00)",
          }}
        >

          <div
            className="pointer-events-none absolute top-1/2 h-9 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-[3px] border-white shadow"
            style={{
              left: `${
                (hue /
                  360) *
                100
              }%`,
            }}
          />

        </div>

        <div className="mt-4 flex items-center gap-3 rounded-[18px] bg-[#F6F6F6] px-4 py-3">

          <div
            className="h-10 w-10 rounded-full"
            style={{
              backgroundColor:
                previewColor,
            }}
          />

          <span className="font-pretendard text-[15px] font-semibold">
            {
              previewColor
            }
          </span>

        </div>

        <div className="mt-5 grid grid-cols-2 gap-3">

          <button
            type="button"
            onClick={
              onCancel
            }
            className="font-pretendard h-[52px] rounded-full bg-[#EEEEEE] font-semibold"
          >
            {
              t.cancel
            }
          </button>

          <button
            type="button"
            onClick={() =>
              onSelect(
                previewColor
              )
            }
            className="font-pretendard h-[52px] rounded-full bg-[#BFFF00] font-semibold"
          >
            {
              t.select
            }
          </button>

        </div>

      </div>

    </div>
  );
}

/* =====================================================
   MAIN
===================================================== */

export default function Home() {
  const [
    step,
    setStep,
  ] =
    useState<Step>(
      "start"
    );

  const [
    appLanguage,
    setAppLanguage,
  ] =
    useState<AppLanguage>(
      "en"
    );

  const [
    language,
    setLanguage,
  ] =
    useState<
      Language | null
    >(null);

  const [
    level,
    setLevel,
  ] =
    useState<
      Level | null
    >(null);

  const [
    goal,
    setGoal,
  ] =
    useState<
      Goal | null
    >(null);

  const [
    space,
    setSpace,
  ] =
    useState<
      Space | null
    >(null);

  const [
    bodyColor,
    setBodyColor,
  ] =
    useState(
      "#C7F238"
    );

  const [
    leftEye,
    setLeftEye,
  ] =
    useState("P");

  const [
    rightEye,
    setRightEye,
  ] =
    useState("B");

  const [
    characterTab,
    setCharacterTab,
  ] =
    useState<CharacterTab>(
      "color"
    );

  const [
    eyeTarget,
    setEyeTarget,
  ] =
    useState<EyeTarget>(
      "left"
    );

  const [
    showColorPicker,
    setShowColorPicker,
  ] =
    useState(false);

  const [
    displayName,
    setDisplayName,
  ] =
    useState(
      "Bunnies"
    );

  const [
    profileNameDraft,
    setProfileNameDraft,
  ] =
    useState(
      "Bunnies"
    );

  const [
    editingProfileName,
    setEditingProfileName,
  ] =
    useState(false);

  const [
    notifications,
    setNotifications,
  ] =
    useState(true);

  const [
    sound,
    setSound,
  ] =
    useState(true);

  const [
    vibration,
    setVibration,
  ] =
    useState(true);

  const [
    onboardingComplete,
    setOnboardingComplete,
  ] =
    useState(false);

  const [
    loaded,
    setLoaded,
  ] =
    useState(false);

  const t =
    translations[
      appLanguage
    ];

  /* =====================================================
     LOAD
  ===================================================== */

  useEffect(() => {
    try {
      const saved =
        localStorage.getItem(
          "plabla-settings"
        );

      if (saved) {
        const data =
          JSON.parse(
            saved
          );

        if (
          data.appLanguage ===
            "ko" ||
          data.appLanguage ===
            "en"
        ) {
          setAppLanguage(
            data.appLanguage
          );
        }

        if (
          data.language
        ) {
          setLanguage(
            data.language
          );
        }

        if (
          data.level
        ) {
          setLevel(
            data.level
          );
        }

        if (
          data.goal
        ) {
          setGoal(
            data.goal
          );
        }

        if (
          data.bodyColor
        ) {
          setBodyColor(
            data.bodyColor
          );
        }

        if (
          data.leftEye
        ) {
          setLeftEye(
            data.leftEye
          );
        }

        if (
          data.rightEye
        ) {
          setRightEye(
            data.rightEye
          );
        }

        if (
          data.displayName
        ) {
          setDisplayName(
            data.displayName
          );

          setProfileNameDraft(
            data.displayName
          );
        }

        if (
          typeof data.notifications ===
          "boolean"
        ) {
          setNotifications(
            data.notifications
          );
        }

        if (
          typeof data.sound ===
          "boolean"
        ) {
          setSound(
            data.sound
          );
        }

        if (
          typeof data.vibration ===
          "boolean"
        ) {
          setVibration(
            data.vibration
          );
        }

        if (
          data.onboardingComplete ===
          true
        ) {
          setOnboardingComplete(
            true
          );

          setStep(
            "home"
          );
        }
      }
    } catch {
      //
    }

    setLoaded(
      true
    );
  }, []);

  /* =====================================================
     SAVE
  ===================================================== */

  useEffect(() => {
    if (!loaded) {
      return;
    }

    localStorage.setItem(
      "plabla-settings",
      JSON.stringify({
        appLanguage,
        language,
        level,
        goal,
        bodyColor,
        leftEye,
        rightEye,
        displayName,
        notifications,
        sound,
        vibration,
        onboardingComplete,
      })
    );
  }, [
    loaded,
    appLanguage,
    language,
    level,
    goal,
    bodyColor,
    leftEye,
    rightEye,
    displayName,
    notifications,
    sound,
    vibration,
    onboardingComplete,
  ]);

  /* =====================================================
     START
  ===================================================== */

  useEffect(() => {
    if (
      !loaded ||
      onboardingComplete ||
      step !== "start"
    ) {
      return;
    }

    const timer =
      setTimeout(() => {
        setStep(
          "language"
        );
      }, 2000);

    return () =>
      clearTimeout(
        timer
      );
  }, [
    loaded,
    onboardingComplete,
    step,
  ]);

  /* =====================================================
     TYPOGRAPHY
  ===================================================== */

  const headlineClass =
    appLanguage ===
    "ko"
      ? "text-[35px] leading-[1.28] tracking-[-0.025em] text-[#202020]"
      : "font-fredoka text-[35px] font-medium leading-[1.1] tracking-[-0.01em] text-[#202020]";

  /*
    한국어일 때 SOYO Maple을
    직접 강제 적용
  */

  const headlineStyle =
    appLanguage ===
    "ko"
      ? {
          fontFamily:
            '"SOYOMaple", sans-serif',
          fontWeight: 700,
        }
      : undefined;

  const bodyClass =
    "font-pretendard text-[15px] font-normal leading-6 tracking-[-0.01em]";

  const sectionTitleClass =
    "font-pretendard text-[17px] font-semibold tracking-[-0.01em] text-[#202020]";

  const selectionClass =
    "font-pretendard text-[16px] font-semibold tracking-[-0.01em] text-[#202020]";

  const isPresetColor =
    bodyColors.some(
      (
        item
      ) =>
        item.value.toLowerCase() ===
        bodyColor.toLowerCase()
    );

  /* =====================================================
     COMMON COMPONENTS
  ===================================================== */

  const MobileFrame = ({
    children,
  }: {
    children:
      ReactNode;
  }) => (
    <div className="flex min-h-dvh items-center justify-center bg-[#F2F2F2]">

      <main className="relative flex h-dvh w-full max-w-[430px] flex-col overflow-hidden bg-[#F8F8F8]">

        {children}

      </main>

    </div>
  );

  const Headline = ({
    children,
    className = "",
  }: {
    children:
      ReactNode;
    className?: string;
  }) => (
    <h1
      className={`${headlineClass} ${className}`}
      style={
        headlineStyle
      }
    >
      {children}
    </h1>
  );

  const BackButton = ({
    onClick,
  }: {
    onClick:
      () => void;
  }) => (
    <button
      type="button"
      onClick={
        onClick
      }
      className="mb-6 flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-white shadow-[0_10px_30px_rgba(0,0,0,0.08)]"
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
      ReactNode;
    disabled?: boolean;
    onClick:
      () => void;
  }) => (
    <button
      type="button"
      disabled={
        disabled
      }
      onClick={
        onClick
      }
      className={`font-pretendard h-14 w-full rounded-full text-[17px] font-semibold ${
        disabled
          ? "bg-[#E5E5E5] text-[#999999]"
          : "bg-[#BFFF00] text-[#202020]"
      }`}
    >
      {children}
    </button>
  );

  const Toggle = ({
    value,
    onChange,
  }: {
    value: boolean;
    onChange:
      () => void;
  }) => (
    <button
      type="button"
      onClick={
        onChange
      }
      className={`relative h-7 w-12 shrink-0 rounded-full transition ${
        value
          ? "bg-[#BFFF00]"
          : "bg-[#D7D7D7]"
      }`}
    >

      <div
        className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition-all ${
          value
            ? "left-6"
            : "left-1"
        }`}
      />

    </button>
  );

  const BottomNav = ({
    current,
  }: {
    current:
      AppTab;
  }) => {
    const nav = [
      {
        key:
          "home" as const,
        en: "Home",
        ko: "홈",
        icon: "⌂",
      },
      {
        key:
          "space" as const,
        en: "Spaces",
        ko: "공간",
        icon: "▦",
      },
      {
        key:
          "profile" as const,
        en: "Profile",
        ko: "프로필",
        icon: "○",
      },
      {
        key:
          "settings" as const,
        en: "Settings",
        ko: "설정",
        icon: "⚙",
      },
    ];

    return (
      <div className="border-t border-black/[0.05] bg-white px-3 pb-[max(8px,env(safe-area-inset-bottom))] pt-2">

        <div className="grid grid-cols-4">

          {nav.map(
            (
              item
            ) => {
              const active =
                current ===
                item.key;

              return (
                <button
                  key={
                    item.key
                  }
                  type="button"
                  onClick={() =>
                    setStep(
                      item.key
                    )
                  }
                  className={`font-pretendard flex flex-col items-center gap-1 ${
                    active
                      ? "text-[#202020]"
                      : "text-[#202020]/30"
                  }`}
                >

                  <div
                    className={`flex h-8 w-11 items-center justify-center rounded-full text-[19px] ${
                      active
                        ? "bg-[#BFFF00]"
                        : ""
                    }`}
                  >
                    {
                      item.icon
                    }
                  </div>

                  <span className="text-[10px] font-semibold">
                    {appLanguage ===
                    "ko"
                      ? item.ko
                      : item.en}
                  </span>

                </button>
              );
            }
          )}

        </div>

      </div>
    );
  };

  /* =====================================================
     LOADING
  ===================================================== */

  if (!loaded) {
    return null;
  }

  /* =====================================================
     START
  ===================================================== */

  if (
    step ===
    "start"
  ) {
    return (
      <MobileFrame>

        <div className="flex flex-1 items-center justify-center">

          <Image
            src="/plabla-logo-transparent.svg"
            alt="PlaBla"
            width={210}
            height={140}
            priority
          />

        </div>

      </MobileFrame>
    );
  }

  /* =====================================================
     LANGUAGE
  ===================================================== */

  if (
    step ===
    "language"
  ) {
    return (
      <MobileFrame>

        <div className="hide-scrollbar flex-1 overflow-y-auto px-6 pt-10">

          <Headline>

            {t.chooseLanguage
              .split("\n")
              .map(
                (
                  line,
                  index
                ) => (
                  <span
                    key={
                      index
                    }
                  >
                    {
                      line
                    }

                    {index ===
                      0 && (
                      <br />
                    )}

                  </span>
                )
              )}

          </Headline>

          <p
            className={`${bodyClass} mb-7 mt-3 text-[#202020]/45`}
          >
            {
              t.chooseLanguageSub
            }
          </p>

          <div className="space-y-3">

            {languages.map(
              (
                item
              ) => {
                const selected =
                  language ===
                  item.name;

                return (
                  <button
                    key={
                      item.name
                    }
                    type="button"
                    onClick={() =>
                      setLanguage(
                        item.name
                      )
                    }
                    className={`flex h-[68px] w-full items-center gap-4 rounded-[22px] border-2 px-4 ${
                      selected
                        ? "border-[#BFFF00] bg-[#F7FFE5]"
                        : "border-transparent bg-white"
                    }`}
                  >

                    <div
                      className={`font-pretendard flex h-11 w-11 items-center justify-center rounded-full text-[18px] font-semibold ${
                        selected
                          ? "bg-[#BFFF00]"
                          : "bg-[#F1F1F1]"
                      }`}
                    >
                      {
                        item.symbol
                      }
                    </div>

                    <span
                      className={
                        selectionClass
                      }
                    >
                      {appLanguage ===
                      "ko"
                        ? item.ko
                        : item.name}
                    </span>

                  </button>
                );
              }
            )}

          </div>

        </div>

        <div className="px-6 pb-6 pt-4">

          <BottomButton
            disabled={
              !language
            }
            onClick={() =>
              setStep(
                "info"
              )
            }
          >
            {
              t.next
            }
          </BottomButton>

        </div>

      </MobileFrame>
    );
  }

  /* =====================================================
     INFO
  ===================================================== */

  if (
    step ===
    "info"
  ) {
    return (
      <MobileFrame>

        <div className="hide-scrollbar flex-1 overflow-y-auto px-6 pt-8">

          <BackButton
            onClick={() =>
              setStep(
                "language"
              )
            }
          />

          <Headline>

            {t.tellUs
              .split("\n")
              .map(
                (
                  line,
                  index
                ) => (
                  <span
                    key={
                      index
                    }
                  >
                    {
                      line
                    }

                    {index ===
                      0 && (
                      <br />
                    )}

                  </span>
                )
              )}

          </Headline>

          <p
            className={`${bodyClass} mb-8 mt-3 text-[#202020]/45`}
          >
            {
              t.tellUsSub
            }
          </p>

          <p
            className={`${sectionTitleClass} mb-3`}
          >
            {
              t.yourLevel
            }
          </p>

          <div className="grid grid-cols-3 gap-3">

            {levels.map(
              (
                item
              ) => (
                <button
                  key={
                    item.value
                  }
                  type="button"
                  onClick={() =>
                    setLevel(
                      item.value
                    )
                  }
                  className={`h-[76px] rounded-[22px] border-2 ${
                    level ===
                    item.value
                      ? "border-[#BFFF00] bg-[#F7FFE5]"
                      : "border-transparent bg-white"
                  }`}
                >

                  <span
                    className={
                      selectionClass
                    }
                  >
                    {appLanguage ===
                    "ko"
                      ? item.ko
                      : item.value}
                  </span>

                </button>
              )
            )}

          </div>

          <p
            className={`${sectionTitleClass} mb-3 mt-8`}
          >
            {
              t.learningGoal
            }
          </p>

          <div className="grid grid-cols-2 gap-3">

            {goals.map(
              (
                item
              ) => (
                <button
                  key={
                    item.value
                  }
                  type="button"
                  onClick={() =>
                    setGoal(
                      item.value
                    )
                  }
                  className={`h-[76px] rounded-[22px] border-2 ${
                    goal ===
                    item.value
                      ? "border-[#BFFF00] bg-[#F7FFE5]"
                      : "border-transparent bg-white"
                  }`}
                >

                  <span
                    className={
                      selectionClass
                    }
                  >
                    {appLanguage ===
                    "ko"
                      ? item.ko
                      : item.value}
                  </span>

                </button>
              )
            )}

          </div>

        </div>

        <div className="px-6 pb-6 pt-4">

          <BottomButton
            disabled={
              !level ||
              !goal
            }
            onClick={() =>
              setStep(
                "character"
              )
            }
          >
            {
              t.next
            }
          </BottomButton>

        </div>

      </MobileFrame>
    );
  }

  /* =====================================================
     CHARACTER
  ===================================================== */

  if (
    step ===
    "character"
  ) {
    return (
      <MobileFrame>

        {showColorPicker && (
          <CustomColorPicker
            initialColor={
              bodyColor
            }
            leftEye={
              leftEye
            }
            rightEye={
              rightEye
            }
            appLanguage={
              appLanguage
            }
            onCancel={() =>
              setShowColorPicker(
                false
              )
            }
            onSelect={(
              color
            ) => {
              setBodyColor(
                color
              );

              setShowColorPicker(
                false
              );
            }}
          />
        )}

        <div className="hide-scrollbar flex-1 overflow-y-auto px-6 pt-8">

          <BackButton
            onClick={() =>
              setStep(
                "info"
              )
            }
          />

          <Headline>
            {
              t.makeItYours
            }
          </Headline>

          <p
            className={`${bodyClass} mt-3 text-[#202020]/45`}
          >
            {
              t.createCharacter
            }
          </p>

          <div className="mt-5 h-[300px] overflow-hidden rounded-[30px] bg-white">

            <CharacterView
              bodyColor={
                bodyColor
              }
              leftEye={
                leftEye
              }
              rightEye={
                rightEye
              }
              rotate
            />

          </div>

          <p className="font-pretendard mt-2 text-center text-[12px] text-[#202020]/30">
            {
              t.dragRotate
            }
          </p>

          <div className="mt-5 grid grid-cols-2 rounded-full bg-[#EEEEEE] p-1">

            <button
              type="button"
              onClick={() =>
                setCharacterTab(
                  "color"
                )
              }
              className={`rounded-full py-2.5 ${
                characterTab ===
                "color"
                  ? "bg-white shadow-sm"
                  : ""
              }`}
            >
              <span
                className={
                  selectionClass
                }
              >
                {
                  t.color
                }
              </span>
            </button>

            <button
              type="button"
              onClick={() =>
                setCharacterTab(
                  "eyes"
                )
              }
              className={`rounded-full py-2.5 ${
                characterTab ===
                "eyes"
                  ? "bg-white shadow-sm"
                  : ""
              }`}
            >
              <span
                className={
                  selectionClass
                }
              >
                {
                  t.eyes
                }
              </span>
            </button>

          </div>

          {characterTab ===
            "color" && (
            <div className="mt-6">

              <p
                className={`${sectionTitleClass} mb-4`}
              >
                {
                  t.bodyColor
                }
              </p>

              <div className="flex flex-wrap gap-4">

                {bodyColors.map(
                  (
                    item
                  ) => (
                    <button
                      key={
                        item.value
                      }
                      type="button"
                      onClick={() =>
                        setBodyColor(
                          item.value
                        )
                      }
                      className={`h-12 w-12 rounded-full ${
                        bodyColor ===
                        item.value
                          ? "ring-2 ring-[#202020] ring-offset-2"
                          : ""
                      }`}
                      style={{
                        backgroundColor:
                          item.value,
                      }}
                    />
                  )
                )}

                <button
                  type="button"
                  onClick={() =>
                    setShowColorPicker(
                      true
                    )
                  }
                  className={`flex h-12 w-12 items-center justify-center rounded-full ${
                    !isPresetColor
                      ? "ring-2 ring-[#202020] ring-offset-2"
                      : ""
                  }`}
                  style={{
                    background:
                      "conic-gradient(#f55,#fd3,#5f8,#4df,#57f,#b5f,#f6c,#f55)",
                  }}
                >

                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white font-semibold">
                    +
                  </span>

                </button>

              </div>

            </div>
          )}

          {characterTab ===
            "eyes" && (
            <div className="mt-6">

              <p
                className={
                  sectionTitleClass
                }
              >
                {
                  t.eyes
                }
              </p>

              <p className="font-pretendard mt-1 text-[13px] text-[#202020]/40">
                {
                  t.eyeHelp
                }
              </p>

              <div className="mt-4 grid grid-cols-2 rounded-[20px] bg-[#ECECEC] p-1">

                <button
                  type="button"
                  onClick={() =>
                    setEyeTarget(
                      "left"
                    )
                  }
                  className={`rounded-[17px] py-2.5 ${
                    eyeTarget ===
                    "left"
                      ? "bg-white shadow-sm"
                      : ""
                  }`}
                >
                  <span
                    className={
                      selectionClass
                    }
                  >
                    {
                      t.leftEye
                    }
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setEyeTarget(
                      "right"
                    )
                  }
                  className={`rounded-[17px] py-2.5 ${
                    eyeTarget ===
                    "right"
                      ? "bg-white shadow-sm"
                      : ""
                  }`}
                >
                  <span
                    className={
                      selectionClass
                    }
                  >
                    {
                      t.rightEye
                    }
                  </span>
                </button>

              </div>

              <div className="mt-4 grid grid-cols-2 gap-3">

                <input
                  value={
                    leftEye
                  }
                  onFocus={() =>
                    setEyeTarget(
                      "left"
                    )
                  }
                  onChange={(
                    event
                  ) =>
                    setLeftEye(
                      Array.from(
                        event.target.value
                      )
                        .slice(-1)
                        .join("")
                    )
                  }
                  className="font-pretendard h-16 rounded-[20px] bg-white text-center text-[24px] font-semibold outline-none"
                />

                <input
                  value={
                    rightEye
                  }
                  onFocus={() =>
                    setEyeTarget(
                      "right"
                    )
                  }
                  onChange={(
                    event
                  ) =>
                    setRightEye(
                      Array.from(
                        event.target.value
                      )
                        .slice(-1)
                        .join("")
                    )
                  }
                  className="font-pretendard h-16 rounded-[20px] bg-white text-center text-[24px] font-semibold outline-none"
                />

              </div>

              <p
                className={`${sectionTitleClass} mb-3 mt-6`}
              >
                {
                  t.suggestions
                }
              </p>

              <div className="grid grid-cols-4 gap-2">

                {eyeSuggestions.map(
                  (
                    item
                  ) => (
                    <button
                      key={
                        item
                      }
                      type="button"
                      onClick={() => {
                        if (
                          eyeTarget ===
                          "left"
                        ) {
                          setLeftEye(
                            item
                          );
                        } else {
                          setRightEye(
                            item
                          );
                        }
                      }}
                      className="font-pretendard h-14 rounded-[18px] bg-white text-[20px] font-semibold"
                    >
                      {
                        item
                      }
                    </button>
                  )
                )}

              </div>

            </div>
          )}

          <div className="my-8">

            <BottomButton
              onClick={() => {
                setOnboardingComplete(
                  true
                );

                setStep(
                  "home"
                );
              }}
            >
              {
                t.continue
              }
            </BottomButton>

          </div>

        </div>

      </MobileFrame>
    );
  }

  /* =====================================================
     HOME
  ===================================================== */

  if (
    step ===
    "home"
  ) {
    return (
      <MobileFrame>

        <div className="hide-scrollbar flex-1 overflow-y-auto px-6 pt-8">

          <p className="font-pretendard text-[14px] text-[#202020]/40">
            {
              t.hi
            },{" "}
            {
              displayName
            }
          </p>

          <Headline
            className="mt-1"
          >
            {
              t.readyToTalk
            }
          </Headline>

          <div className="mt-6 overflow-hidden rounded-[28px] bg-white">

            <div className="h-[230px]">

              <CharacterView
                bodyColor={
                  bodyColor
                }
                leftEye={
                  leftEye
                }
                rightEye={
                  rightEye
                }
              />

            </div>

            <div className="px-5 pb-5">

              <p className="font-pretendard text-[13px] text-[#202020]/40">
                {
                  t.learning
                }
              </p>

              <p className="font-pretendard mt-1 text-[16px] font-semibold">

                {appLanguage ===
                "ko"
                  ? languages.find(
                      (
                        item
                      ) =>
                        item.name ===
                        language
                    )?.ko
                  : language}

                {" · "}

                {appLanguage ===
                "ko"
                  ? levels.find(
                      (
                        item
                      ) =>
                        item.value ===
                        level
                    )?.ko
                  : level}

              </p>

            </div>

          </div>

          <div className="mt-7 flex items-center justify-between">

            <h2
              className={
                sectionTitleClass
              }
            >
              {
                t.jumpIntoSpace
              }
            </h2>

            <button
              type="button"
              onClick={() =>
                setStep(
                  "space"
                )
              }
              className="font-pretendard text-[13px] font-semibold text-[#202020]/40"
            >
              {
                t.seeAll
              }
            </button>

          </div>

          <div className="mt-3 grid grid-cols-2 gap-3">

            {spaces
              .slice(
                0,
                2
              )
              .map(
                (
                  item
                ) => (
                  <button
                    key={
                      item.name
                    }
                    type="button"
                    onClick={() => {
                      setSpace(
                        item.name
                      );

                      setStep(
                        "landscape"
                      );
                    }}
                    className="overflow-hidden rounded-[22px] bg-white text-left"
                  >

                    <div className="relative h-[110px]">

                      <Image
                        src={
                          item.image
                        }
                        alt={
                          item.name
                        }
                        fill
                        className="object-cover"
                      />

                    </div>

                    <div className="px-4 py-3">

                      <p className="font-pretendard text-[14px] font-semibold">
                        {appLanguage ===
                        "ko"
                          ? item.ko
                          : item.name}
                      </p>

                    </div>

                  </button>
                )
              )}

          </div>

        </div>

        <BottomNav
          current="home"
        />

      </MobileFrame>
    );
  }

  /* =====================================================
     SPACES
  ===================================================== */

  if (
    step ===
    "space"
  ) {
    return (
      <MobileFrame>

        <div className="hide-scrollbar flex-1 overflow-y-auto px-6 pt-8">

          <Headline>

            {t.spacesTitle
              .split("\n")
              .map(
                (
                  line,
                  index
                ) => (
                  <span
                    key={
                      index
                    }
                  >
                    {
                      line
                    }

                    <br />
                  </span>
                )
              )}

          </Headline>

          <p
            className={`${bodyClass} mb-6 mt-3 text-[#202020]/45`}
          >
            {
              t.spacesSub
            }
          </p>

          <div className="space-y-4 pb-6">

            {spaces.map(
              (
                item
              ) => (
                <button
                  key={
                    item.name
                  }
                  type="button"
                  onClick={() => {
                    setSpace(
                      item.name
                    );

                    setStep(
                      "landscape"
                    );
                  }}
                  className="w-full overflow-hidden rounded-[26px] bg-white text-left"
                >

                  <div className="relative h-[155px]">

                    <Image
                      src={
                        item.image
                      }
                      alt={
                        item.name
                      }
                      fill
                      className="object-cover"
                    />

                  </div>

                  <div className="flex items-center justify-between px-5 py-4">

                    <div>

                      <p className="font-pretendard text-[17px] font-semibold">
                        {appLanguage ===
                        "ko"
                          ? item.ko
                          : item.name}
                      </p>

                      <p className="font-pretendard mt-1 text-[13px] text-[#202020]/45">
                        {appLanguage ===
                        "ko"
                          ? item.koDescription
                          : item.description}
                      </p>

                    </div>

                    <span className="font-pretendard shrink-0 rounded-full bg-[#F2F2F2] px-3 py-2 text-[13px] font-semibold">
                      👥{" "}
                      {
                        item.people
                      }
                    </span>

                  </div>

                </button>
              )
            )}

          </div>

        </div>

        <BottomNav
          current="space"
        />

      </MobileFrame>
    );
  }

  /* =====================================================
     ENTER SPACE
  ===================================================== */

  if (
    step ===
    "landscape"
  ) {
    const current =
      spaces.find(
        (
          item
        ) =>
          item.name ===
          space
      );

    return (
      <MobileFrame>

        <div className="relative flex flex-1 overflow-hidden bg-[#202020]">

          {current && (
            <>

              <Image
                src={
                  current.image
                }
                alt={
                  current.name
                }
                fill
                className="object-cover opacity-50"
              />

              <div className="absolute inset-0 bg-gradient-to-b from-black/10 to-black/80" />

              <div className="relative z-10 flex flex-1 flex-col p-6">

                <button
                  type="button"
                  onClick={() =>
                    setStep(
                      "space"
                    )
                  }
                  className="flex h-12 w-12 items-center justify-center rounded-full bg-white"
                >
                  ←
                </button>

                <div className="mt-auto">

                  <p className="font-pretendard text-[13px] text-white/55">
                    {
                      t.entering
                    }
                  </p>

                  <h1
                    className={
                      appLanguage ===
                      "ko"
                        ? "mt-1 text-[38px] leading-[1.25] text-white"
                        : "font-fredoka mt-1 text-[38px] font-medium text-white"
                    }
                    style={
                      appLanguage ===
                      "ko"
                        ? {
                            fontFamily:
                              '"SOYOMaple", sans-serif',
                            fontWeight:
                              700,
                          }
                        : undefined
                    }
                  >
                    {appLanguage ===
                    "ko"
                      ? current.ko
                      : current.name}
                  </h1>

                  <p className="font-pretendard mt-3 text-[14px] text-white/60">
                    {appLanguage ===
                    "ko"
                      ? current.koDescription
                      : current.description}
                  </p>

                </div>

              </div>

            </>
          )}

        </div>

        <BottomNav
          current="space"
        />

      </MobileFrame>
    );
  }

  /* =====================================================
     PROFILE
  ===================================================== */

  if (
    step ===
    "profile"
  ) {
    return (
      <MobileFrame>

        <div className="hide-scrollbar flex-1 overflow-y-auto px-6 pt-8">

          <Headline>
            {
              t.yourProfile
            }
          </Headline>

          <p
            className={`${bodyClass} mt-3 text-[#202020]/45`}
          >
            {
              t.profileSub
            }
          </p>

          <div className="mt-6 h-[260px] overflow-hidden rounded-[28px] bg-white">

            <CharacterView
              bodyColor={
                bodyColor
              }
              leftEye={
                leftEye
              }
              rightEye={
                rightEye
              }
            />

          </div>

          <div className="mt-4 rounded-[24px] bg-white p-5">

            {!editingProfileName ? (
              <div className="flex items-center justify-between">

                <p className="font-pretendard text-[19px] font-semibold">
                  {
                    displayName
                  }
                </p>

                <button
                  type="button"
                  onClick={() => {
                    setProfileNameDraft(
                      displayName
                    );

                    setEditingProfileName(
                      true
                    );
                  }}
                  className="font-pretendard rounded-full bg-[#F1F1F1] px-4 py-2 text-[12px] font-semibold"
                >
                  {
                    t.editName
                  }
                </button>

              </div>
            ) : (
              <div>

                <p className="font-pretendard mb-2 text-[12px] text-[#202020]/40">
                  {
                    t.displayName
                  }
                </p>

                <input
                  value={
                    profileNameDraft
                  }
                  maxLength={
                    20
                  }
                  onChange={(
                    event
                  ) =>
                    setProfileNameDraft(
                      event.target.value
                    )
                  }
                  className="font-pretendard h-[50px] w-full rounded-[16px] bg-[#F5F5F5] px-4 outline-none"
                />

                <div className="mt-3 grid grid-cols-2 gap-2">

                  <button
                    type="button"
                    onClick={() => {
                      setProfileNameDraft(
                        displayName
                      );

                      setEditingProfileName(
                        false
                      );
                    }}
                    className="font-pretendard h-11 rounded-full bg-[#EEEEEE] text-[14px] font-semibold"
                  >
                    {
                      t.cancel
                    }
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      const trimmed =
                        profileNameDraft.trim();

                      if (
                        trimmed
                      ) {
                        setDisplayName(
                          trimmed
                        );
                      }

                      setEditingProfileName(
                        false
                      );
                    }}
                    className="font-pretendard h-11 rounded-full bg-[#BFFF00] text-[14px] font-semibold"
                  >
                    {
                      t.save
                    }
                  </button>

                </div>

              </div>
            )}

            <div className="mt-6 space-y-4 font-pretendard text-[14px]">

              <div className="flex justify-between">

                <span className="text-[#202020]/40">
                  {
                    t.language
                  }
                </span>

                <strong>
                  {appLanguage ===
                  "ko"
                    ? languages.find(
                        (
                          item
                        ) =>
                          item.name ===
                          language
                      )?.ko
                    : language}
                </strong>

              </div>

              <div className="flex justify-between">

                <span className="text-[#202020]/40">
                  {
                    t.level
                  }
                </span>

                <strong>
                  {appLanguage ===
                  "ko"
                    ? levels.find(
                        (
                          item
                        ) =>
                          item.value ===
                          level
                      )?.ko
                    : level}
                </strong>

              </div>

            </div>

          </div>

          <button
            type="button"
            onClick={() =>
              setStep(
                "character"
              )
            }
            className="font-pretendard mt-4 h-[52px] w-full rounded-full bg-[#EEEEEE] text-[15px] font-semibold"
          >
            {
              t.editCharacter
            }
          </button>

        </div>

        <BottomNav
          current="profile"
        />

      </MobileFrame>
    );
  }

  /* =====================================================
     SETTINGS
  ===================================================== */

  if (
    step ===
    "settings"
  ) {
    return (
      <MobileFrame>

        <div className="hide-scrollbar flex-1 overflow-y-auto px-6 pb-7 pt-8">

          <Headline>
            {
              t.settings
            }
          </Headline>

          <p
            className={`${bodyClass} mt-3 text-[#202020]/45`}
          >
            {
              t.settingsSub
            }
          </p>

          {/* GENERAL */}

          <p
            className={`${sectionTitleClass} mb-3 mt-7`}
          >
            {
              t.general
            }
          </p>

          <div className="rounded-[24px] bg-white p-5">

            <p className="font-pretendard text-[15px] font-semibold">
              {
                t.appLanguage
              }
            </p>

            <div className="mt-4 grid grid-cols-2 gap-2">

              <button
                type="button"
                onClick={() =>
                  setAppLanguage(
                    "en"
                  )
                }
                className={`font-pretendard h-[52px] rounded-[16px] text-[14px] font-semibold ${
                  appLanguage ===
                  "en"
                    ? "bg-[#BFFF00]"
                    : "bg-[#F3F3F3]"
                }`}
              >
                English
              </button>

              <button
                type="button"
                onClick={() =>
                  setAppLanguage(
                    "ko"
                  )
                }
                className={`font-pretendard h-[52px] rounded-[16px] text-[14px] font-semibold ${
                  appLanguage ===
                  "ko"
                    ? "bg-[#BFFF00]"
                    : "bg-[#F3F3F3]"
                }`}
              >
                한국어
              </button>

            </div>

            <div className="mt-3 grid grid-cols-2 gap-2">

              {[
                "日本語",
                "中文",
                "Español",
                "Français",
              ].map(
                (
                  item
                ) => (
                  <button
                    key={
                      item
                    }
                    type="button"
                    disabled
                    className="font-pretendard relative h-[48px] cursor-not-allowed rounded-[15px] bg-[#F5F5F5] text-[13px] font-medium text-[#202020]/30"
                  >

                    {
                      item
                    }

                    <span className="absolute right-2 top-2 rounded-full bg-[#E8E8E8] px-2 py-[2px] text-[8px] font-semibold">
                      Soon
                    </span>

                  </button>
                )
              )}

            </div>

          </div>

          {/* ACCOUNT */}

          <p
            className={`${sectionTitleClass} mb-3 mt-7`}
          >
            {
              t.account
            }
          </p>

          <div className="overflow-hidden rounded-[24px] bg-white">

            <div className="flex items-center justify-between p-5">

              <div>

                <p className="font-pretendard text-[15px] font-semibold">
                  {
                    t.displayName
                  }
                </p>

                <p className="font-pretendard mt-1 text-[13px] text-[#202020]/40">
                  {
                    displayName
                  }
                </p>

              </div>

              <button
                type="button"
                onClick={() =>
                  setStep(
                    "profile"
                  )
                }
                className="font-pretendard text-[14px] font-semibold text-[#202020]/40"
              >
                {
                  t.edit
                }{" "}
                ›
              </button>

            </div>

            <button
              type="button"
              onClick={() =>
                alert(
                  appLanguage ===
                    "ko"
                    ? "계정 관리 기능은 추후 실제 계정 시스템과 연결할 수 있어요."
                    : "Account management can later be connected to the real account system."
                )
              }
              className="font-pretendard flex w-full items-center justify-between border-t border-black/[0.05] p-5"
            >

              <span className="text-[15px] font-semibold">
                {
                  t.manageAccount
                }
              </span>

              <span className="text-[#202020]/30">
                ›
              </span>

            </button>

          </div>

          {/* LEARNING */}

          <p
            className={`${sectionTitleClass} mb-3 mt-7`}
          >
            {
              t.learningSettings
            }
          </p>

          <div className="rounded-[24px] bg-white p-5">

            <p className="font-pretendard text-[14px] font-semibold">
              {
                t.learningLanguage
              }
            </p>

            <div className="mt-3 grid grid-cols-2 gap-2">

              {languages.map(
                (
                  item
                ) => (
                  <button
                    key={
                      item.name
                    }
                    type="button"
                    onClick={() =>
                      setLanguage(
                        item.name
                      )
                    }
                    className={`font-pretendard h-[48px] rounded-[15px] text-[13px] font-semibold ${
                      language ===
                      item.name
                        ? "bg-[#BFFF00]"
                        : "bg-[#F5F5F5]"
                    }`}
                  >
                    {
                      item.symbol
                    }{" "}
                    {appLanguage ===
                    "ko"
                      ? item.ko
                      : item.name}
                  </button>
                )
              )}

            </div>

            <p className="font-pretendard mb-3 mt-6 text-[14px] font-semibold">
              {
                t.yourLevel
              }
            </p>

            <div className="grid grid-cols-3 gap-2">

              {levels.map(
                (
                  item
                ) => (
                  <button
                    key={
                      item.value
                    }
                    type="button"
                    onClick={() =>
                      setLevel(
                        item.value
                      )
                    }
                    className={`font-pretendard h-[46px] rounded-[14px] text-[12px] font-semibold ${
                      level ===
                      item.value
                        ? "bg-[#BFFF00]"
                        : "bg-[#F5F5F5]"
                    }`}
                  >
                    {appLanguage ===
                    "ko"
                      ? item.ko
                      : item.value}
                  </button>
                )
              )}

            </div>

            <p className="font-pretendard mb-3 mt-6 text-[14px] font-semibold">
              {
                t.learningGoal
              }
            </p>

            <div className="grid grid-cols-2 gap-2">

              {goals.map(
                (
                  item
                ) => (
                  <button
                    key={
                      item.value
                    }
                    type="button"
                    onClick={() =>
                      setGoal(
                        item.value
                      )
                    }
                    className={`font-pretendard h-[46px] rounded-[14px] text-[13px] font-semibold ${
                      goal ===
                      item.value
                        ? "bg-[#BFFF00]"
                        : "bg-[#F5F5F5]"
                    }`}
                  >
                    {appLanguage ===
                    "ko"
                      ? item.ko
                      : item.value}
                  </button>
                )
              )}

            </div>

          </div>

          {/* NOTIFICATIONS */}

          <p
            className={`${sectionTitleClass} mb-3 mt-7`}
          >
            {
              t.notificationsTitle
            }
          </p>

          <div className="overflow-hidden rounded-[24px] bg-white">

            <div className="flex items-center justify-between border-b border-black/[0.05] p-5">

              <div>

                <p className="font-pretendard text-[15px] font-semibold">
                  {
                    t.notifications
                  }
                </p>

                <p className="font-pretendard mt-1 text-[12px] text-[#202020]/40">
                  {
                    t.notificationsDesc
                  }
                </p>

              </div>

              <Toggle
                value={
                  notifications
                }
                onChange={() =>
                  setNotifications(
                    !notifications
                  )
                }
              />

            </div>

            <div className="flex items-center justify-between border-b border-black/[0.05] p-5">

              <div>

                <p className="font-pretendard text-[15px] font-semibold">
                  {
                    t.sound
                  }
                </p>

                <p className="font-pretendard mt-1 text-[12px] text-[#202020]/40">
                  {
                    t.soundDesc
                  }
                </p>

              </div>

              <Toggle
                value={
                  sound
                }
                onChange={() =>
                  setSound(
                    !sound
                  )
                }
              />

            </div>

            <div className="flex items-center justify-between p-5">

              <div>

                <p className="font-pretendard text-[15px] font-semibold">
                  {
                    t.vibration
                  }
                </p>

                <p className="font-pretendard mt-1 text-[12px] text-[#202020]/40">
                  {
                    t.vibrationDesc
                  }
                </p>

              </div>

              <Toggle
                value={
                  vibration
                }
                onChange={() => {
                  const next =
                    !vibration;

                  setVibration(
                    next
                  );

                  if (
                    next &&
                    "vibrate" in
                      navigator
                  ) {
                    navigator.vibrate(
                      80
                    );
                  }
                }}
              />

            </div>

          </div>

          {/* APP */}

          <p
            className={`${sectionTitleClass} mb-3 mt-7`}
          >
            {
              t.app
            }
          </p>

          <div className="overflow-hidden rounded-[24px] bg-white">

            <button
              type="button"
              onClick={() =>
                setStep(
                  "character"
                )
              }
              className="font-pretendard flex w-full items-center justify-between border-b border-black/[0.05] p-5"
            >

              <span className="font-semibold">
                {
                  t.editCharacter
                }
              </span>

              <span className="text-[#202020]/30">
                ›
              </span>

            </button>

            <button
              type="button"
              onClick={() => {
                const confirmed =
                  window.confirm(
                    appLanguage ===
                      "ko"
                      ? "학습 언어, 레벨, 목표, 캐릭터를 처음부터 다시 설정할까요?"
                      : "Set up your language, level, goal and character again?"
                  );

                if (
                  !confirmed
                ) {
                  return;
                }

                setOnboardingComplete(
                  false
                );

                setLanguage(
                  null
                );

                setLevel(
                  null
                );

                setGoal(
                  null
                );

                setStep(
                  "language"
                );
              }}
              className="font-pretendard flex w-full items-center justify-between border-b border-black/[0.05] p-5"
            >

              <span className="font-semibold">
                {
                  t.setupAgain
                }
              </span>

              <span className="text-[#202020]/30">
                ›
              </span>

            </button>

            <button
              type="button"
              onClick={() => {
                const confirmed =
                  window.confirm(
                    appLanguage ===
                      "ko"
                      ? "이 기기에 저장된 PlaBla 데이터를 모두 초기화할까요?"
                      : "Reset all PlaBla data stored on this device?"
                  );

                if (
                  !confirmed
                ) {
                  return;
                }

                localStorage.removeItem(
                  "plabla-settings"
                );

                setAppLanguage(
                  "en"
                );

                setLanguage(
                  null
                );

                setLevel(
                  null
                );

                setGoal(
                  null
                );

                setBodyColor(
                  "#C7F238"
                );

                setLeftEye(
                  "P"
                );

                setRightEye(
                  "B"
                );

                setDisplayName(
                  "Bunnies"
                );

                setProfileNameDraft(
                  "Bunnies"
                );

                setNotifications(
                  true
                );

                setSound(
                  true
                );

                setVibration(
                  true
                );

                setOnboardingComplete(
                  false
                );

                setStep(
                  "start"
                );
              }}
              className="font-pretendard flex w-full items-center justify-between p-5"
            >

              <div className="text-left">

                <p className="font-semibold text-red-500">
                  {
                    t.resetAppData
                  }
                </p>

                <p className="mt-1 text-[12px] text-[#202020]/35">
                  {
                    t.resetAppDataDesc
                  }
                </p>

              </div>

              <span className="text-red-400">
                ›
              </span>

            </button>

          </div>

          <p className="font-pretendard mt-6 text-center text-[11px] text-[#202020]/25">
            PlaBla · Play to Talk
          </p>

        </div>

        <BottomNav
          current="settings"
        />

      </MobileFrame>
    );
  }

  return null;
}