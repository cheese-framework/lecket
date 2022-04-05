import styles from "@/styles/Dashboard/Card.module.css";

const Card = ({ text, footer, icon, variant }) => {
  return (
    <div className={`${styles.card} ${styles[variant]}`}>
      <div className={`${styles.card__icon} ${styles[variant + "_icon"]}`}>
        <i className={icon}></i>
      </div>
      <div className={styles.card__main}>
        <h1>{text}</h1>
        <p>{footer}</p>
      </div>
    </div>
  );
};

export default Card;
