import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <body className="font-[Garamound] dark:bg-slate-800 dark:font-sans dark:font-bold dark:text-slate-200">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
