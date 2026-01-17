import React from "react";
import { Box, Typography } from "@mui/material";
import { Line } from "react-chartjs-2";
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

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
);

export default function AnalyticLineChart({
  title,
  labels,
  data,
  color = "#1976d2",
}) {
  const chartData = {
    labels,
    datasets: [
      {
        label: title,
        data,
        borderColor: color,
        backgroundColor: `${color}22`,
        tension: 0.3,
        fill: true,
      },
    ],
  };
  const options = {
    responsive: true,
    plugins: {
      legend: { display: false },
      title: { display: true, text: title },
    },
    scales: {
      x: { grid: { display: false } },
      y: { grid: { color: "#eee" } },
    },
  };
  return (
    <Box my={2}>
      <Typography variant="subtitle1" fontWeight={600} mb={1}>
        {title}
      </Typography>
      <Line data={chartData} options={options} height={220} />
    </Box>
  );
}
