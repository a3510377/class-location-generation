import Head from 'next/head';
import type { AppProps } from 'next/app';
import { useEffect } from 'react';
import { useRouter } from 'next/router';

import './_document.scss';

export default function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();

  useEffect(
    () => window.scrollTo({ top: 0, left: 0, behavior: 'smooth' }),
    [router.asPath]
  );

  return (
    <>
      <Head>
        <title>座位分配</title>
      </Head>
      <Component {...pageProps} key={router.asPath} />
    </>
  );
}
