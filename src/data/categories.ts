export const categories = [
  "Personaje",
  "Hechizo o encantamiento",
  "Organización",
  "Ley - decreto",
  "Poción",
  "Criatura",
  "Fecha",
  "Lugar",
  "Profecía",
  "Muerte",
  "Medio",
  "Educación",
  "Nota / curiosidad",
  "Recuerdo",
  "Artefacto u objeto",
  "Horrocrux",
] as const;

export type Category = (typeof categories)[number];
