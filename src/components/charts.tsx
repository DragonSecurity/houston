"use client";

import { Line, Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  type ChartData,
  type ChartOptions,
} from "chart.js";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
);

// Default chart options
const defaultOptions: ChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: true,
      position: "top" as const,
    },
    tooltip: {
      backgroundColor: "#404958",
      padding: 10,
      displayColors: false,
    },
  },
  scales: {
    x: {
      grid: {
        display: false,
      },
      ticks: {
        font: {
          family: "var(--font-source-sans)",
          size: 11,
        },
      },
    },
    y: {
      grid: {
        display: false,
      },
      border: {
        display: false,
      },
      ticks: {
        font: {
          family: "var(--font-source-sans)",
          size: 11,
        },
        callback: (value) => {
          if (Math.floor(value) === value) {
            if (value >= 1000000) {
              return value / 1000000 + "m";
            } else if (value >= 1000) {
              return value / 1000 + "k";
            }
            return value;
          }
        },
      },
    },
  },
};

// Chart color schemes
const colors = {
  blue: {
    borderColor: "#77AFE8",
    backgroundColor: [
      "#77AFE8",
      "#79B3EF",
      "#8DC2F9",
      "#ACD3FB",
      "#A9D3FE",
      "#C5E1FD",
    ],
    transparentColor: "rgba(119, 175, 232, 0.1)",
  },
  red: {
    borderColor: "#F9627A",
    backgroundColor: [
      "#F9627A",
      "#F67489",
      "#F68697",
      "#F78C9D",
      "#F69EAC",
      "#FBACB9",
    ],
    transparentColor: "rgba(232, 130, 164, 0.1)",
  },
  green: {
    borderColor: "#75CD9F",
    backgroundColor: ["#75CD9F", "#82D7AB", "#A0E8C2", "#A8EDC8", "#A7EBC8"],
    transparentColor: "rgba(134, 206, 201, 0.1)",
  },
  purple: {
    borderColor: "#8D8CC3",
    backgroundColor: [
      "#8D8CC3",
      "#9A99CB",
      "#A6A5D7",
      "#B6B5E4",
      "#C5C4F1",
      "#CECDF8",
    ],
    transparentColor: "rgba(166, 165, 207, 0.1)",
  },
};

// Apply colors to datasets
function applyColors(data: any, chartType: string) {
  if (!data || !data.datasets) return data;

  const colorKeys = Object.keys(colors);

  data.datasets = data.datasets.map((dataset: any, index: number) => {
    const colorKey = colorKeys[index % colorKeys.length] as keyof typeof colors;
    const color = colors[colorKey];

    if (chartType === "line") {
      return {
        ...dataset,
        borderColor: color.borderColor,
        backgroundColor: color.transparentColor,
        pointBackgroundColor: "#FFFFFF",
        pointBorderColor: color.borderColor,
        pointHoverBackgroundColor: "#FFFFFF",
        pointHoverBorderColor: color.borderColor,
        pointRadius: 4,
        pointHoverRadius: 5,
        pointBorderWidth: 2,
      };
    } else if (chartType === "bar") {
      return {
        ...dataset,
        backgroundColor: color.backgroundColor[0],
        borderColor: color.borderColor,
        borderWidth: 1,
      };
    } else if (chartType === "pie" || chartType === "doughnut") {
      return {
        ...dataset,
        backgroundColor: color.backgroundColor,
        borderColor: "#FFFFFF",
        borderWidth: 1,
      };
    }

    return dataset;
  });

  return data;
}

interface ChartProps {
  data: ChartData<any>;
  options?: ChartOptions;
}

export function LineChart({ data, options = {} }: ChartProps) {
  const chartData = applyColors(data, "line");
  const chartOptions = { ...defaultOptions, ...options };

  return <Line data={chartData} options={chartOptions} />;
}

export function BarChart({ data, options = {} }: ChartProps) {
  const chartData = applyColors(data, "bar");
  const chartOptions = { ...defaultOptions, ...options };

  return <Bar data={chartData} options={chartOptions} />;
}

export function PieChart({ data, options = {} }: ChartProps) {
  const chartData = applyColors(data, "pie");
  const chartOptions = {
    ...defaultOptions,
    ...options,
    scales: {
      x: { display: false },
      y: { display: false },
    },
  };

  return <Pie data={chartData} options={chartOptions} />;
}
