import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

import "../../assets/scss/reports/messages-chart.scss";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const MessagesChart = ({ data }) => {
  const messagesData = {
    labels: data?.report?.map((d) => d?.employee_name),
    datasets: [
      {
        label: "Number of Messages",
        backgroundColor: "rgba(54, 162, 235, 0.6)",
        data: data?.report?.map((d) => parseInt(d?.messages)),
      },
    ],
  };

  const conversationData = {
    labels: data?.report?.map((d) => d?.employee_name),
    datasets: [
      {
        label: "Number of Conversations",
        backgroundColor: "rgba(255, 153, 204, 0.6)",
        data: data?.report?.map((d) => parseInt(d?.conversations)),
      },
    ],
  };

  const options = {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
          precision: 0,
        },
      },
    },
  };

  return (
    <div className="messages-chart">
      <div className="messages-chart-1">
        <Bar data={messagesData} options={options} />
      </div>
      <div className="messages-chart-2">
        <Bar data={conversationData} options={options} />
      </div>
    </div>
  );
};

export default MessagesChart;
