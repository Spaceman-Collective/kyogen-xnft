/* eslint-disable @next/next/google-font-display */
import { Html, Head, Main, NextScript } from "next/document";
import { errorSupressScript, SUPRESS_RUNTIME_OVERLAY } from "../constants";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link
          href="https://fonts.googleapis.com/css?family=Inter:wght@900"
          rel="stylesheet"
        />
        {SUPRESS_RUNTIME_OVERLAY && (
          <script dangerouslySetInnerHTML={{ __html: errorSupressScript }} />
        )}
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
