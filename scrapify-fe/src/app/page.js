import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import GitHub from '../../public/github.svg';

export default function Landing() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-2">
      <Head>
        <title>Web Scraper App</title>
        <meta name="description" content="Web scraping made easy" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex w-full flex-1 flex-col items-center justify-center px-20 text-center">
        <h1 className="text-6xl font-bold">
          Welcome to <a className="text-green-500">Scrapify!</a>
        </h1>

        <p className="mt-3 text-2xl">
          Scraping the web one page at a time
        </p>

        <div className="mt-6">
          <Link href="/scrapers/dashboard">
            <p className="rounded-lg bg-green-500 py-2 px-4 text-black hover:bg-green-400">
              Start Scraping
            </p>
          </Link>
        </div>
      </main>

      <footer className="flex h-16 w-full items-center justify-center">
        <a
          href="https://github.com/aadium/web-scraping-demo"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="GitHub"
        >
          <Image src={GitHub} alt="GitHub" className="h-6" />
        </a>
      </footer>
    </div>
  );
}