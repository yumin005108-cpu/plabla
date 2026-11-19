import type { GoalId, LanguageId, LevelId, SpaceId } from "./types";

export const languages: { id: LanguageId; label: string; flag: string }[] = [
  { id: "english", label: "English", flag: "🇺🇸" },
  { id: "japanese", label: "Japanese", flag: "🇯🇵" },
  { id: "chinese", label: "Chinese", flag: "🇨🇳" },
  { id: "spanish", label: "Spanish", flag: "🇪🇸" },
  { id: "french", label: "French", flag: "🇫🇷" },
];

export const levels: { id: LevelId; label: string }[] = [
  { id: "beginner", label: "Beginner" },
  { id: "intermediate", label: "Intermediate" },
  { id: "advanced", label: "Advanced" },
];

export const goals: { id: GoalId; label: string; accent: string }[] = [
  { id: "conversation", label: "Conversation", accent: "#20D9C2" },
  { id: "travel", label: "Travel", accent: "#59B8FF" },
  { id: "study", label: "Study", accent: "#FFFA2E" },
  { id: "culture", label: "Culture", accent: "#BFFF00" },
];

export const spaces: {
  id: SpaceId;
  label: string;
  image: string;
  occupancy: string;
}[] = [
  {
    id: "amusement-park",
    label: "Amusement Park",
    image: "/amusement-park.png",
    occupancy: "6 / 10",
  },
  {
    id: "horror-house",
    label: "Horror House",
    image: "/horror-house.png",
    occupancy: "6 / 10",
  },
  {
    id: "adventure-island",
    label: "Adventure Island",
    image: "/adventure-island.png",
    occupancy: "6 / 10",
  },
];

export function labelFor<T extends string>(
  items: { id: T; label: string }[],
  id: T | null,
) {
  return items.find((item) => item.id === id)?.label ?? "";
}
