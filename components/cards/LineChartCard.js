import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export const options = {
  maintainAspectRatio: false,
  responsive: true,
  plugins: {
    legend: {
      position: "top",
    },
    title: {
      display: true,
      text: "Analytics",
    },
  },
};

const labels = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const Chart = () => {
  const data = {
    labels,
    datasets: [
      {
        label: "Investments",
        data: [
          2723575, 9056111, 9715406, 11379243, 17338608, 19781299, 22614934,
          23393882, 24790969, 25241328, 25508010, 28032304,
        ],
        borderColor: "green",
        backgroundColor: "green",
      },
      {
        label: "Repayments",
        data: [
          475497, 660824, 4392526, 6131285, 7329443, 7539155, 9997483, 12638413,
          13769805, 15077259, 23047817, 22819294,
        ],
        borderColor: "red",
        backgroundColor: "red",
      },
    ],
  };

  return <Line options={options} data={data} />;
};

export default Chart;
