import Head from "next/head";
import { GetStaticProps } from "next";
import data from "../books.json";
import { Book } from "../types/scriptures";
import Link from "next/link";

export const getStaticProps: GetStaticProps = async () => {
  return {
    props: {
      data: data,
    },
  };
};
export default function Home({ data }: { data: Book[] }) {
  return (
    <>
      <Head>
        <title>Scriptures | Copy</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="mt-4 flex flex-col items-center text-center">
        <Link
          className="cursor-pointer bg-[conic-gradient(at_bottom_right,_var(--tw-gradient-stops))] from-stone-300 via-pink-500 to-blue-500 bg-clip-text text-transparent hover:text-blue-500"
          href={"/book_of_mormon"}
        >
          <h1 className="text-4xl font-semibold uppercase">
            The Book of Mormon
          </h1>
          <h2 className="text-xl uppercase">
            Another Testament of Jesus Christ
          </h2>
        </Link>
        <h3 className="mt-4">Other scriptures to follow...</h3>
      </main>
    </>
  );
}
