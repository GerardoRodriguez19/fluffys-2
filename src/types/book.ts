export interface BookSection {
  id: number;
  chapters: number[];
}

export interface Book {
  id: string;
  shortName: string;
  badge: string;
  title: string;
  subtitle: string;
  chapters: number;
  color: string;
  questionCount: number;
  sections: BookSection[];
}

export type BookId = Book["id"];
export type SectionId = number | null;
