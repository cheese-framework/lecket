import styles from "@/styles/Dashboard/Card.module.css";
import Card from "@/components/dashboard/cards/Card";

const CardHolder = () => {
  return (
    <div className={styles.card__holder}>
      <Card icon="fa fa-users" text={420} footer="Customers" variant="green" />
      <Card
        icon="fa fa-piggy-bank"
        text={"GMD 6,000,000.00"}
        footer="Overall Loans"
        variant="purple"
      />
      <Card
        icon="fa fa-money-check-alt"
        text={"GMD 4,500,000.00"}
        footer="Balance"
        variant="green"
      />

      <Card
        icon="fa fa-retweet"
        text={"GMD 2,000,000.00"}
        footer="Repayments"
        variant="purple"
      />
    </div>
  );
};

export default CardHolder;
