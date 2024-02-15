import React from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { useState, useEffect } from "react";

import { Pie } from "react-chartjs-2";
import { Chart } from "chart.js/auto"; //
import ChartDataLabels from "chartjs-plugin-datalabels";

ChartJS.register(ArcElement, Tooltip, Legend);
ChartJS.register(ChartDataLabels);

const SquarePiechart = ({ dataset, colors, pieChartData, labels }) => {
  const [releasedRecommendations, setReleasedRecommendations] = useState(0);
  const [pendingForApproval, setpendingForApproval] = useState(0);
  const [rejectedRecommendation, setRejectedRecommendation] = useState(0);
  const [
    approvedRecommendationsToBeImplement,
    setApprovedRecommendationsToBeImplement,
  ] = useState(0);

  const data = {
    // labels:['One',"Two","Three","Four"],
    datasets: [
      {
        // data:[releasedRecommendations,pendingForApproval,rejectedRecommendation,approvedRecommendationsToBeImplement],
        data: dataset,
        backgroundColor: colors,
        labels: labels,
      },

      // {
      //     data:[3,6,9],
      //     backgroundColor:['aqua','bloodorange','purple']
      // }
    ],
  };

  // const options = {
  //   plugins: {
  //     legend: {
  //       display: false,
  //     },
  //   },
  // };

  const options = {
    plugins: {
      legend: {
        display: false,
      },
      datalabels: {
        color: "black", // Label color
        font: {
          weight: "bold", // Label font weight
          size: 16, // Label font size
        },
        formatter: (value, context) => {
          // Display label for non-zero values only
          if (value !== 0) {
            return value;
          } else {
            return ""; // Return empty string for zero values
          }
        },
      },
    },
  };

  const plugins = [
    {
      afterDraw: (chart) => {
        const ctx = chart.ctx;
        const chartArea = chart.chartArea;
        chart.data.datasets.forEach((dataset, i) => {
          const meta = chart.getDatasetMeta(i);
          if (!meta.hidden) {
            meta.data.forEach((element, index) => {
              if (dataset.data[index] !== 0) {
                // Draw the text in black, with the specified font
                ctx.fillStyle = "white";
                const fontSize = 16;
                const fontStyle = "normal";
                const fontFamily = "Arial";
                ctx.font = `${fontStyle} ${fontSize}px ${fontFamily}`;
                // Just naively convert to string for now
                const text = `Completed: ${releasedRecommendations}, Pending: ${pendingForApproval}, Rejected: ${rejectedRecommendation}, Approved: ${approvedRecommendationsToBeImplement}`;
                // Make sure alignment settings are correct
                const dataX = (chartArea.left + chartArea.right) / 2;
                const dataY = (chartArea.top + chartArea.bottom) / 2;
                ctx.textAlign = "center";
                ctx.textBaseline = "middle";
                ctx.fillText(text, dataX, dataY);
              }
            });
          }
        });
      },
    },
  ];

  //  useEffect(()=>{
  //     setReleasedRecommendations(pieChartData?.releasedRecommendations)
  //     setpendingForApproval(pieChartData?.pendingForApproval)
  //     setRejectedRecommendation(pieChartData?.rejectedRecommendation)
  //     setApprovedRecommendationsToBeImplement(pieChartData?.approvedRecommendationsToBeImplement)
  //  },[pieChartData])

  return (
    <>
      <div>
        <div
          style={{
            padding: "20px",
            width: "100%",
            height: "50%",
          }}
        >
          <Pie data={data} options={options}></Pie>
        </div>
      </div>
    </>
  );
};

export default SquarePiechart;
