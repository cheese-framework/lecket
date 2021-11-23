import Link from "next/link";
import styles from "@/styles/FourOFour.module.css";

export default function FourOFour() {
  return (
    <div className={styles.not}>
      <div className={styles.notfound}>
        <div className={styles.notfound_404}>
          <h3 className={styles.h3}>Oops! Page not found</h3>
          <h1 className={styles.h1}>
            <span className={styles.span}>4</span>
            <span className={styles.span}>0</span>
            <span className={styles.span}>4</span>
          </h1>
        </div>
        <h2 className={styles.h2}>
          we are sorry, but the page you requested was not found
        </h2>
        <Link href="/" passHref>
          <button className={styles.btn}>Go Home</button>
        </Link>
      </div>
    </div>
  );
}
