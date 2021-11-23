import { useContext } from "react";
import LecketContext from "@/context/LecketContext";
import styles from "@/styles/DetailCard.module.css";

export default function DetailCard({ text, icon, value, className, style }) {
  const { appTheme } = useContext(LecketContext);

  return (
    <div className={`${styles.card} ${className} ${appTheme}`} style={style}>
      <h1 className={styles.header}>{text}</h1>
      <p className={styles.content}>{value}</p>
    </div>
  );
}
