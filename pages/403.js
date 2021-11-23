import Link from "next/link";
import Head from "next/head";
import styles from "@/styles/FourOFour.module.css";

export default function FourOThree() {
  return (
    <>
      <Head>
        <title>Access Forbidden</title>
      </Head>
      <div className={styles.not}>
        <div className={styles.notfound}>
          <div className={styles.notfound_404}>
            <h3 className={styles.h3}>Oops! Not Permitted Here</h3>
            <h1 className={styles.h1}>
              <span className={styles.span}>4</span>
              <span className={styles.span}>0</span>
              <span className={styles.span}>3</span>
            </h1>
          </div>
          <h2 className={styles.h2}>
            you do not have the right permission to access this page.
          </h2>
          <Link href="/" passHref>
            <button className={styles.btn}>Go Home</button>
          </Link>
        </div>
      </div>
    </>
  );
}
