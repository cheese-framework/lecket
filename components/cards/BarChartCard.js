import { useContext } from "react";
import LecketContext from "@/context/LecketContext";
import { Bar } from "react-chartjs-2";
import styles from "@/styles/DetailCard.module.css";

export default function BarChartCard({ labels, title, dataset }) {
  const { appTheme } = useContext(LecketContext);

  const colors = [];

  if (dataset) {
    for (let i = 0; i < dataset.length; i++) {
      colors.push(
        `rgba(${Math.floor(Math.random() * 255) + 1},${
          Math.floor(Math.random() * 255) + 1
        },${Math.floor(Math.random() * 255) + 1},1)`
      );
    }
  }

  const data = {
    labels: labels || [],
    datasets: [
      {
        label: title || "Chart",
        data: dataset || [],
        backgroundColor: colors,
        borderColor: colors,
        borderWidth: 2,
      },
    ],
  };

  return (
    <div className={`${styles.card} ${appTheme}`}>
      <p className={styles.content}>{title}</p>
      <Bar
        data={data}
        width={"130px"}
        height={"130px"}
        options={{ maintainAspectRatio: false }}
      />
    </div>
  );
}
