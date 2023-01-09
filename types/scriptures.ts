// export type Scripture = {
//   book: string;
//   chapter: number;
//   verse: number;
//   text: string;
// };

export type Verse = {
  number: number;
  text: string;
};

export type Chapter = {
  number: number;
  verses: Verse[];
};

export type Book = {
  name: string;
  chapters: Chapter[];
};
