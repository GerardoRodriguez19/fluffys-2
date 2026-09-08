import type { Movie } from "@/types/movie";
import { isMovieId } from "@/types/movie";
import { COLORS } from "@/theme";

export const movies: Movie[] = [
  {
    id: "hp1",
    shortName: "HP1",
    badge: "Película 1",
    title: "Harry Potter 1",
    subtitle: "La piedra filosofal",
    year: 2001,
    color: COLORS.hp1,
    questionCount: 4,
  },
  {
    id: "hp2",
    shortName: "HP2",
    badge: "Película 2",
    title: "Harry Potter 2",
    subtitle: "La cámara secreta",
    year: 2002,
    color: COLORS.hp2,
    questionCount: 4,
  },
  {
    id: "hp3",
    shortName: "HP3",
    badge: "Película 3",
    title: "Harry Potter 3",
    subtitle: "El prisionero de Azkaban",
    year: 2004,
    color: COLORS.hp3,
    questionCount: 4,
  },
  {
    id: "hp4",
    shortName: "HP4",
    badge: "Película 4",
    title: "Harry Potter 4",
    subtitle: "El cáliz de fuego",
    year: 2005,
    color: COLORS.hp4,
    questionCount: 4,
  },
  {
    id: "hp5",
    shortName: "HP5",
    badge: "Película 5",
    title: "Harry Potter 5",
    subtitle: "La Orden del Fénix",
    year: 2007,
    color: COLORS.hp5,
    questionCount: 4,
  },
  {
    id: "hp6",
    shortName: "HP6",
    badge: "Película 6",
    title: "Harry Potter 6",
    subtitle: "El misterio del príncipe",
    year: 2009,
    color: COLORS.hp6,
    questionCount: 4,
  },
  {
    id: "hp7_1",
    shortName: "HP7.1",
    badge: "Película 7 · Parte 1",
    title: "Harry Potter 7.1",
    subtitle: "Las Reliquias de la Muerte: Parte 1",
    year: 2010,
    color: COLORS.hp7_1,
    questionCount: 4,
  },
  {
    id: "hp7_2",
    shortName: "HP7.2",
    badge: "Película 7 · Parte 2",
    title: "Harry Potter 7.2",
    subtitle: "Las Reliquias de la Muerte: Parte 2",
    year: 2011,
    color: COLORS.hp7_2,
    questionCount: 4,
  },
];

export function getMovieById(id: string | undefined): Movie | undefined {
  if (!isMovieId(id)) {
    return undefined;
  }

  return movies.find((movie) => movie.id === id);
}
