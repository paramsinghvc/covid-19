import { FC } from "react";
import Head from "next/head";
import variables from "../shared/variables";

const Shell: FC = ({ children }) => (
  <div className="container">
    <Head>
      <title>Create Next App</title>
      <link rel="icon" href="/favicon.ico" />
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
