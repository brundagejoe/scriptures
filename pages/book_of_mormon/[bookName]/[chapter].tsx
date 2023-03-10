import { GetStaticPaths, GetStaticProps } from "next";
import { ParsedUrlQuery } from "querystring";
import data from "../../../books.json";
import Head from "next/head";
import { Book, Verse } from "../../../types/scriptures";
import { useState } from "react";
import Link from "next/link";

interface IParams extends ParsedUrlQuery {
  bookName: string;
  chapter: string;
}

export const getStaticProps: GetStaticProps = async (context) => {
  const { bookName, chapter: urlChapterNumber } = context.params as IParams;
  const book = data.find(
    (book) => book.name.replace(" ", "") === bookName
  ) as Book;
  const currentChapter = book.chapters.find(
    (chapter) => chapter.number === parseInt(urlChapterNumber)
  );
  return {
    props: {
      bookName: book.name,
      chapterNumber: currentChapter?.number,
      verses: currentChapter?.verses,
    },
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const books = data as Book[];
  const paths = books.map((book) => {
    const chapters = book.chapters.map((chapter) => ({
      params: {
        bookName: book.name.replace(" ", ""),
        chapter: `${chapter.number}`,
      },
    }));
    return chapters;
  });

  return {
    paths: paths.flat(),
    fallback: true,
  };
};

const Chapters = ({
  bookName,
  chapterNumber,
  verses,
}: {
  bookName: string;
  chapterNumber: number;
  verses: Verse[];
}) => {
  const [showToast, setShowToast] = useState(false);
  const getNumbers = (array: string[]) => {
    const numbers = array.map((item) => {
      const number = item.match(/\d+/);
      return number ? parseInt(number[0]) : -1;
    });
    if (numbers[0] === -1 && numbers.length > 1) {
      numbers[0] = numbers[1] - 1;
    }

    return numbers.length > 1
      ? [numbers[0], numbers[numbers.length - 1]]
      : [numbers[0]];
  };

  const handleOnMouseUp = () => {
    const selection = window.getSelection();
    let highlightedText = selection?.toString();

    const highlightedTextArray = highlightedText?.split(/\n{2,}/);
    const selectedVerses = getNumbers(highlightedTextArray || []);
    if (selectedVerses[0] === -1) {
      const verse = verses.find((verse) =>
        verse.text.includes(highlightedTextArray?.[0] as string)
      );
      selectedVerses[0] = verse?.number || -1;
    }

    //Remove the number from the highlighted text
    highlightedText = highlightedText?.replace(/\d+/g, "");
    //replace the new line characters with a space
    highlightedText = highlightedText?.replace(/(\r\n|\n|\r)/gm, "");
    //if there is a space at the start of the string, remove it
    highlightedText = highlightedText?.replace(/^\s+/, "");
    //Check if the last value of highlighted text is not a period, comma, semicolon, question mark, or exclamation point
    if (
      highlightedText &&
      !/[.;?!]$/.test(highlightedText[highlightedText.length - 1])
    ) {
      //add a period to the end of the highlighted text
      highlightedText = `${highlightedText}...`;
    }

    highlightedText = `"${highlightedText}"`;
    //add the book name and chapter number to the end
    highlightedText = `${highlightedText} (${bookName} ${chapterNumber}:${
      selectedVerses[0]
    }${selectedVerses[1] ? `-${selectedVerses[1]}` : ""})`;

    //put the highlighted text into the clipboard
    navigator.clipboard.writeText(highlightedText || "");

    //set show toast to true for 2 seconds
    //if the highlighted text is not empty
    if (highlightedText) {
      setShowToast(true);
      setTimeout(() => {
        setShowToast(false);
      }, 2000);
      //deselect the selection
      selection?.removeAllRanges();
    }
  };
  return (
    <>
      <Head>
        <title>Book of Mormon | Copy</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="flex cursor-pointer flex-row items-center pl-8 pt-4 font-semibold uppercase text-gray-600">
        <Link className="hover:text-blue-500" href={"/"}>
          Book of Mormon
        </Link>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          className="h-5 w-5"
        >
          <path
            fillRule="evenodd"
            d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
            clipRule="evenodd"
          />
        </svg>
        <Link className="hover:text-blue-500" href={"/book_of_mormon"}>
          {bookName}
        </Link>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          className="h-5 w-5"
        >
          <path
            fillRule="evenodd"
            d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
            clipRule="evenodd"
          />
        </svg>
        <Link
          className="hover:text-blue-500"
          href={`/book_of_mormon/${bookName ? bookName.replace(" ", "") : ""}`}
        >
          {chapterNumber}
        </Link>
      </div>
      <main className="mt-4 flex flex-col items-center">
        <h1 className="mb-4 bg-[conic-gradient(at_bottom_right,_var(--tw-gradient-stops))] from-stone-300 via-pink-500 to-blue-500 bg-clip-text text-3xl font-bold uppercase text-transparent">
          {bookName} {chapterNumber}
        </h1>
        <div
          className="mb-10 flex w-full flex-col items-center"
          onMouseUp={handleOnMouseUp}
        >
          <div className="space-y-2 px-8">
            {verses &&
              verses.map((verse, index) => (
                <p key={index} className="max-w-lg text-justify">
                  {verse.number} {verse.text}
                </p>
              ))}
          </div>
        </div>
      </main>
      <div
        className={`${
          showToast ? "opacity-100" : "opacity-0"
        } fixed bottom-4 right-4 rounded-md bg-green-500 px-4 py-2 text-white transition-opacity duration-200`}
      >
        Copied to clipboard!
      </div>
    </>
  );
};

export default Chapters;
