import type { Book } from "@/types";
import { COLORS } from "@/theme";

export const books: Book[] = [
  {
    id: "hp5",
    shortName: "HP5",
    badge: "Libro 5",
    title: "Harry Potter 5",
    subtitle: "La Orden del Fénix",
    chapters: 38,
    color: COLORS.hp5,
    questionCount: 1824,

    sections: [
      { id: 1, chapters: [1, 2, 3, 4, 5, 6, 7, 8, 9] },
      { id: 2, chapters: [10, 11, 12, 13, 14, 15, 16] },
      { id: 3, chapters: [17, 18, 19, 20, 21, 22, 23] },
      { id: 4, chapters: [24, 25, 26, 27, 28, 29, 30] },
      { id: 5, chapters: [31, 32, 33, 34, 35, 36, 37, 38] },
    ],
  },

  {
    id: "hp6",
    shortName: "HP6",
    badge: "Libro 6",
    title: "Harry Potter 6",
    subtitle: "El Misterio del Príncipe",
    chapters: 30,
    color: COLORS.hp6,
    questionCount: 0,

    sections: [
      { id: 1, chapters: [1, 2, 3, 4, 5, 6] },
      { id: 2, chapters: [7, 8, 9, 10, 11, 12] },
      { id: 3, chapters: [13, 14, 15, 16, 17, 18] },
      { id: 4, chapters: [19, 20, 21, 22, 23, 24] },
      { id: 5, chapters: [25, 26, 27, 28, 29, 30] },
    ],
  },

  {
    id: "hp7",
    shortName: "HP7",
    badge: "Libro 7",
    title: "Harry Potter 7",
    subtitle: "Las Reliquias de la Muerte",
    chapters: 36,
    color: COLORS.hp7,
    questionCount: 0,

    sections: [
      { id: 1, chapters: [1, 2, 3, 4, 5, 6, 7] },
      { id: 2, chapters: [8, 9, 10, 11, 12, 13, 14] },
      { id: 3, chapters: [15, 16, 17, 18, 19, 20, 21, 22] },
      { id: 4, chapters: [23, 24, 25, 26, 27, 28, 29, 30] },
      { id: 5, chapters: [31, 32, 33, 34, 35, 36, 37] },
    ],
  },
];
