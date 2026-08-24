import {
  BookOpen,
  Clapperboard,
  Brain,
  Settings,
  BookMarked,
  ChevronRight,
  ArrowLeft,
  CircleHelp,
} from "lucide-react";

export const APP_ICONS = {
  books: BookOpen,

  movies: Clapperboard,

  review: Brain,

  admin: Settings,

  study: BookMarked,

  next: ChevronRight,

  back: ArrowLeft,

  question: CircleHelp,
} as const;
