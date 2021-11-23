import Head from "next/head";
import { LecketProvider } from "@/context/LecketContext";
import "../styles/global.css";

export default function App({ Component, pageProps }) {
  return (
    <LecketProvider>
      <Head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/icon?family=Material+Icons"
        />
      </Head>
      <Component {...pageProps} />
    </LecketProvider>
  );
}
