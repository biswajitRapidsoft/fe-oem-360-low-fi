import React, { useEffect, useRef } from "react";
import Chart from "chart.js/auto";
import ChartDataLabels from "chartjs-plugin-datalabels";
import {
  IMPLEMENTATION_TYPE,
  RECOMMENDATION_TYPE,
} from "../../helper/constant";

//ok

const PieSlice = (props) => {
  const { data, pieChartType } = props;
  const chartRef = useRef(null);

  useEffect(() => {
    if (!chartRef.current || !data) return;

    // const labels = Object.keys(data);
    let labels = [];

    if (pieChartType === RECOMMENDATION_TYPE) {
      labels = [
        "Completed",
        "Pending for approval",
        "Implementation",
        "Rejected",
      ];
    }

    if (pieChartType === IMPLEMENTATION_TYPE) {
      labels = ["Planned", "On time", "Delayed"];
    }

    const datasetData = Object.values(data);

    const config = {
      type: "pie",
      data: {
        labels: labels,
        datasets: [
          {
            data: datasetData,
            backgroundColor: ["#00A9E5", "#55DAF8", "#9EE1F8", "#D5F0FA"],
            borderWidth: 0,
          },
        ],
      },
      options: {
        animation: {
          duration: 0,
        },
        plugins: {
          legend: false,
          // legend: {
          //   display: true,
          //   responsive: true,
          //   position: "right",
          //   labels: {
          //     boxWidth: 14,
          //     padding: 10,
          //     font: {
          //       size: 14,
          //     },
          //   },

          //   align: "center",
          // },
          datalabels: {
            color: "black",
            anchor: "end",
            align: "start",
            offset: 40,
            font: {
              weight: 600,
              size: 22,
            },
          },
        },
      },
      plugins: [ChartDataLabels],
    };

    const chartInstance = new Chart(chartRef.current, config);

    return () => {
      chartInstance.destroy();
    };
  }, [data, pieChartType]);

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        justifyContent: "center",
        mb: "1em",
      }}
    >
      <canvas ref={chartRef} id="myChart"></canvas>
    </div>
  );
};

export default PieSlice;
