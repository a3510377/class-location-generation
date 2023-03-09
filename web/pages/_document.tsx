import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="zh-Hant">
      <Head>
        <link rel="shortcut icon" href="/favicon.ico" />
      </Head>
      <body style={{ margin: 0 }}>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
