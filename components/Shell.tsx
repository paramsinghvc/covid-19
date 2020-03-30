import { FC } from "react";
import Head from "next/head";
import Manifest from "next-manifest/manifest";

import variables from "../shared/variables";

const Shell: FC = ({ children }) => (
  <div className="container">
    <Head>
      <title>COVID-19 tracker</title>
      <link
        rel="apple-touch-icon"
        sizes="57x57"
        href="/icons/favicon/apple-icon-57x57.png"
      />
      <link
        rel="apple-touch-icon"
        sizes="60x60"
        href="/icons/favicon/apple-icon-60x60.png"
      />
      <link
        rel="apple-touch-icon"
        sizes="72x72"
        href="/icons/favicon/apple-icon-72x72.png"
      />
      <link
        rel="apple-touch-icon"
        sizes="76x76"
        href="/icons/favicon/apple-icon-76x76.png"
      />
      <link
        rel="apple-touch-icon"
        sizes="114x114"
        href="/icons/favicon/apple-icon-114x114.png"
      />
      <link
        rel="apple-touch-icon"
        sizes="120x120"
        href="/icons/favicon/apple-icon-120x120.png"
      />
      <link
        rel="apple-touch-icon"
        sizes="144x144"
        href="/icons/favicon/apple-icon-144x144.png"
      />
      <link
        rel="apple-touch-icon"
        sizes="152x152"
        href="/icons/favicon/apple-icon-152x152.png"
      />
      <link
        rel="apple-touch-icon"
        sizes="180x180"
        href="/icons/favicon/apple-icon-180x180.png"
      />
      <link
        rel="icon"
        type="image/png"
        sizes="192x192"
        href="/icons/favicon/android-icon-192x192.png"
      />
      <link
        rel="icon"
        type="image/png"
        sizes="32x32"
        href="/icons/favicon/favicon-32x32.png"
      />
      <link
        rel="icon"
        type="image/png"
        sizes="96x96"
        href="/icons/favicon/favicon-96x96.png"
      />
      <link
        rel="icon"
        type="image/png"
        sizes="16x16"
        href="/icons/favicon/favicon-16x16.png"
      />
      <meta name="msapplication-TileColor" content="#1d243c" />
      <meta
        name="msapplication-TileImage"
        content="/icons/favicon/ms-icon-144x144.png"
      />
      <meta name="theme-color" content="#1d243c" />
      <meta
        name="description"
        content="An app for tracking the latest numbers of COVID-19 cases across the globe"
      />
      <link rel="manifest" href="/manifest.json" />
    </Head>

    {children}

    <style jsx global>{`
      @font-face {
        font-family: "Futura";
        src: url("/fonts/futura/Futura Book font.ttf") format("truetype");
        font-weight: 400;
        font-style: normal;
        font-display: auto;
      }
      @font-face {
        font-family: "Futura";
        src: url("/fonts/futura/futura medium bt.ttf") format("truetype");
        font-weight: 500;
        font-style: normal;
        font-display: auto;
      }
      @font-face {
        font-family: "Futura";
        src: url("/fonts/futura/Futura Heavy font.ttf") format("truetype");
        font-weight: 600;
        font-style: normal;
        font-display: auto;
      }
      @font-face {
        font-family: "Futura";
        src: url("/fonts/futura/futura light bt.ttf") format("truetype");
        font-weight: 300;
        font-style: normal;
        font-display: auto;
      }

      * {
        box-sizing: border-box;
      }
      html,
      body {
        padding: 0;
        margin: 0;
        font-family: Futura;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        background: ${variables.darkerGrey};
      }
    `}</style>
  </div>
);

type WithShellFn = <P = {}>(comp: React.ComponentType<P>) => FC<P>;

export const withShell: WithShellFn = Comp => {
  return props => (
    <Shell>
      <Comp {...props} />
    </Shell>
  );
};

export default Shell;
