import { COLORS } from "./colors";

export const GRADIENTS = {
  hp5: `linear-gradient(
        90deg,
        #4b1515,
        ${COLORS.hp5},
        #8b2b2b
    )`,

  movies: `linear-gradient(
        90deg,
        #2f241b,
        ${COLORS.hp6},
        #5c4734
    )`,

  review: `linear-gradient(
        90deg,
        #9f7911,
        ${COLORS.gold},
        #e3b633
    )`,

  admin: `linear-gradient(
        90deg,
        #5d6166,
        ${COLORS.hp7},
        #8b9094
    )`,
} as const;
