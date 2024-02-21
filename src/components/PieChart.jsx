import { Box, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { pieChartActions } from "../actions/pieChartAction";
import { Pie } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
Chart.register(...registerables);

const options = [
  "Today",
  "Yesterday",
  "This Week",
  "This Month",
  "Last Month",
  "Till Today",
];

const PieChart = () => {
  const [filter, setFilter] = useState("This Month");
  const [pieData, setPieData] = useState("");

  //   function to sum up the total recommendations
  const calculateRecommendationSum = () => {
    if (pieData) {
      const sum =
        pieData.pendingForApproval +
        pieData.rejectedRecommendation +
        pieData.approvedRecommendationsToBeImplement +
        pieData.approvedRecommendationNotYetReleased;
      return sum < 10 ? `0${sum}` : sum.toString();
    }
    return "00";
  };

  // function to sum up the total implementations
  const calculateImplementationSum = () => {
    if (pieData) {
      const sum =
        pieData.releasedRecommendations +
        pieData.testingDoneRecommendations +
        pieData.approvedRecommendationNotYetReleased;
      return sum < 10 ? `0${sum}` : sum.toString();
    }
    return "00";
  };

  useEffect(() => {
    const handlePieChartData = async () => {
      try {
        console.log("this function is getting called");
        const res = await pieChartActions.getPieChartData(filter);
        if (res.status === 200) {
          setPieData(res.data.data);
        }
      } catch (err) {
        console.error(err);
      }
    };
    handlePieChartData();
  }, [filter]);

  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Box
        sx={{
          width: "100%",
          display: "flex",
          justifyContent: "space-between",
          paddingX: "20px",
          marginBottom: "1.4em",
        }}
      >
        <Typography
          sx={{
            color: "#281C61",
            fontSize: "22px",
            fontWeight: "600",
          }}
        >
          Overview
        </Typography>
        <Box
          sx={{
            paddingX: "10px",
            paddingY: "2px",
            borderRadius: "10px",
          }}
        >
          <Autocomplete
            disablePortal
            id="combo-box-demo"
            options={options}
            size="small"
            variant="standard"
            sx={{ width: 300 }}
            value={filter}
            onChange={(event, newValue) => {
              setFilter(newValue);
            }}
            renderInput={(params) => <TextField {...params} />}
          />
        </Box>
      </Box>
      <Box
        sx={{
          height: "400px",
          //   width: "1280px",
          width: "100%",
          top: "235px",
          left: "80px",
          backgroundColor: "#FFFFFF",
          display: "flex",
          borderRadius: "1.5em",
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Box sx={{ width: "50%", backgroundColor: "", padding: "1em" }}>
          <Box
            sx={{
              width: "100%",
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <Typography
              sx={{ color: "gray", fontWeight: 700, fontSize: "18px" }}
            >
              Total Recommendations
            </Typography>
            <Typography sx={{ fontWeight: 700, fontSize: "35px" }}>
              {calculateRecommendationSum()}
            </Typography>
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "80%",
              gap: "2em",
            }}
          >
            {/* <Pie data={data} /> */}
            <Pie
              data={{
                datasets: [
                  {
                    data: [
                      pieData.pendingForApproval,
                      pieData.rejectedRecommendation,
                      pieData.approvedRecommendationsToBeImplement,
                      pieData.approvedRecommendationNotYetReleased,
                    ],
                    backgroundColor: [
                      "#00A9E5",
                      "#55DAF8",
                      "#9EE1F8",
                      "#D5F0FA",
                    ],
                  },
                ],
              }}
              plugins={[ChartDataLabels]}
              options={{
                plugins: {
                  datalabels: {
                    color: "black",
                    font: {
                      size: 28,
                    },
                    formatter: (value) => {
                      return value !== 0 ? value : "";
                    },
                  },
                },
              }}
            />
            <Box>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5em",
                }}
              >
                <Box
                  sx={{
                    backgroundColor: "#00A9E5",
                    width: "12px",
                    height: "12px",
                    borderRadius: "2px",
                  }}
                ></Box>
                <Typography sx={{ color: "#3D3D3D" }}>Completed</Typography>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5em",
                }}
              >
                <Box
                  sx={{
                    backgroundColor: "#55DAF8",
                    width: "12px",
                    height: "12px",
                    borderRadius: "2px",
                  }}
                ></Box>
                <Typography sx={{ color: "#3D3D3D" }}>
                  Pending for approval
                </Typography>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5em",
                }}
              >
                <Box
                  sx={{
                    backgroundColor: "#9EE1F8",
                    width: "12px",
                    height: "12px",
                    borderRadius: "2px",
                  }}
                ></Box>
                <Typography sx={{ color: "#3D3D3D" }}>
                  Implementation
                </Typography>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5em",
                }}
              >
                <Box
                  sx={{
                    backgroundColor: "#D5F0FA",
                    width: "12px",
                    height: "12px",
                    borderRadius: "2px",
                  }}
                ></Box>
                <Typography sx={{ color: "#3D3D3D" }}>Rejected</Typography>
              </Box>
            </Box>
          </Box>
        </Box>
        <hr style={{ height: "80%", color: "#D9D9D9", marginTop: "2em" }} />
        <Box sx={{ width: "50%", backgroundColor: "", padding: "1em" }}>
          <Box
            sx={{
              width: "100%",
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <Typography
              sx={{ color: "gray", fontWeight: 700, fontSize: "18px" }}
            >
              Implementation Status
            </Typography>
            <Typography sx={{ fontWeight: 700, fontSize: "35px" }}>
              {calculateImplementationSum()}
            </Typography>
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "80%",
              gap: "2em",
            }}
          >
            {/* <Pie data={data2} /> */}
            <Pie
              data={{
                datasets: [
                  {
                    data: [
                      pieData.releasedRecommendations,
                      pieData.testingDoneRecommendations,
                      pieData.approvedRecommendationNotYetReleased,
                    ],
                    backgroundColor: ["#00A9E5", "#55DAF8", "#9EE1F8"],
                  },
                ],
              }}
              plugins={[ChartDataLabels]}
              options={{
                plugins: {
                  datalabels: {
                    color: "black",
                    font: {
                      size: 28,
                    },
                    formatter: (value) => {
                      return value !== 0 ? value : "";
                    },
                  },
                },
              }}
            />
            <Box>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5em",
                }}
              >
                <Box
                  sx={{
                    backgroundColor: "#00A9E5",
                    width: "12px",
                    height: "12px",
                    borderRadius: "2px",
                  }}
                ></Box>
                <Typography sx={{ color: "#3D3D3D" }}>Planned</Typography>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5em",
                }}
              >
                <Box
                  sx={{
                    backgroundColor: "#55DAF8",
                    width: "12px",
                    height: "12px",
                    borderRadius: "2px",
                  }}
                ></Box>
                <Typography sx={{ color: "#3D3D3D" }}>On Time</Typography>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5em",
                }}
              >
                <Box
                  sx={{
                    backgroundColor: "#9EE1F8",
                    width: "12px",
                    height: "12px",
                    borderRadius: "2px",
                  }}
                ></Box>
                <Typography sx={{ color: "#3D3D3D" }}>Delayed</Typography>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};
export default PieChart;
