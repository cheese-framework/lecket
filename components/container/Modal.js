import styles from "@/styles/Modal.module.css";

export default function Modal({ children }) {
  return (
    <>
      <div className={styles.backdrop}></div>
      <div className={styles.modal}>{children}</div>
    </>
  );
}
