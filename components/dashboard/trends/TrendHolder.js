import ProfitTrend from "./ProfitTrend";
import EarnerTrend from "./EarnerTrend";
import Debtors from "./Debtors";

const TrendHolder = () => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        flexGrow: 1,
        margin: "25px 12px",
      }}
    >
      <ProfitTrend />
      <EarnerTrend />
      <Debtors />
    </div>
  );
};

export default TrendHolder;
