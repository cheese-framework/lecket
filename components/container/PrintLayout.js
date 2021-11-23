import { useContext, useRef } from "react";
import styles from "@/styles/PrintLayout.module.css";
import { execPrint } from "@/utils/utils";
import LecketContext from "@/context/LecketContext";

export default function PrintLayout({ content, close }) {
  const printRef = useRef();
  const { appTheme } = useContext(LecketContext);

  setTimeout(() => {
    printRef.current.innerHTML = content;
  }, 1);

  const printEl = () => {
    execPrint(printRef.current);
    close();
  };

  return (
    <div className={`${styles.print} ${appTheme}`}>
      <div className={`${styles.print_actions} ${appTheme}`}>
        <button className={styles.print_button_print} onClick={printEl}>
          Print
        </button>
        <button onClick={close} className={styles.print_button}>
          Cancel
        </button>
      </div>
      <div ref={printRef}></div>
    </div>
  );
}
