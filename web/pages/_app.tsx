import Head from 'next/head';

import type { AppProps } from 'next/app';

import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();

  useEffect(
    () => window.scrollTo({ top: 0, left: 0, behavior: 'smooth' }),
    [router.asPath]
  );

  useEffect(() => {
    let resizeTimer: NodeJS.Timeout;

    addEventListener('resize', () => {
      document.body?.classList.add('resize-animation-stopper');
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        document.body?.classList.remove('resize-animation-stopper');
      }, 400);
    });

    const loop = handleDevTools();
    return () => clearInterval(loop);
  }, []);

  return (
    <>
      <Head>
        <title>座位分配</title>
      </Head>
      <Component {...pageProps} key={router.asPath} />
    </>
  );
}

const handleDevTools = (threshold = 160) => {
  const devtools: {
    isOpen: boolean;
    orientation?: 'vertical' | 'horizontal';
  } = { isOpen: false, orientation: undefined };

  const emitEvent = (isOpen: boolean, orientation?: string) => {
    dispatchEvent(
      new CustomEvent('devtools-change', { detail: { isOpen, orientation } })
    );
  };

  const loop = () => {
    const widthThreshold = outerWidth - innerWidth > threshold;
    const heightThreshold = outerHeight - innerHeight > threshold;
    const orientation = widthThreshold ? 'vertical' : 'horizontal';

    if (
      !(heightThreshold && widthThreshold) &&
      (widthThreshold || heightThreshold)
    ) {
      if (!devtools.isOpen || devtools.orientation !== orientation)
        emitEvent(true, orientation);

      devtools.isOpen = true;
      devtools.orientation = orientation;
    } else {
      if (devtools.isOpen) emitEvent(false, undefined);

      devtools.isOpen = false;
      devtools.orientation = undefined;
    }
  };

  return setInterval(loop, threshold);
};
