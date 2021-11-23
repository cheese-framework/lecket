import styles from "@/styles/Card.module.css";

export default function CardLayout({ cards }) {
  return (
    <div className={styles.cardlayout}>
      {cards &&
        cards.map((curr) => {
          return <div key={curr.key}>{curr}</div>;
        })}
    </div>
  );
}
