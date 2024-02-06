import {
  Box,
  FormControl,
  Grid,
  ListItemText,
  MenuItem,
  Paper,
  Select,
  Typography,
} from "@mui/material";
import React from "react";
import PieSlice from "../Pie/PieSlice";
import { useState } from "react";
import { useEffect } from "react";
import {
  IMPLEMENTATION_TYPE,
  RECOMMENDATION_TYPE,
} from "../../helper/constant";

const customFontStyles = {
  fontFamily: "Open Sans !important",
  fontWeight: 500,
  // color: "#FFFFFF",
  fontSize: "14px",
};

const Overview = (props) => {
  const { fetchDashboardDetails, overviewData } = props;

  // console.log("over view data", overviewData);
  const options = [
    { label: "Today", value: "Today" },
    { label: "Yesterday", value: "Yesterday" },
    { label: "This Week", value: "This Week" },
    { label: "This Month", value: "This Month" },
    { label: "Last Month", value: "Last Month" },
    { label: "Till Today", value: "Till Today" },
  ];
  const [selectedFilter, setSelectedFilter] = useState("This Month");

  const [totalRecommendationsData, setTotalRecommendationsData] = useState({
    label1: 0,
    label2: 0,
    label3: 0,
    label4: 0,
  });

  const [implementationStatusData, setImplementationStatusData] = useState({
    label1: 0,
    label2: 0,
    label3: 0,
  });

  const [totalRecommendations, setTotalRecommendations] = useState(0);
  const [implementationStatus, setImplementationStatus] = useState(0);

  useEffect(() => {
    if (selectedFilter) {
      fetchDashboardDetails(selectedFilter);
    }

    const intervalDashboardDetails = setInterval(() => {
      if (selectedFilter) {
        fetchDashboardDetails(selectedFilter);
      }
    }, 20000);

    return () => clearInterval(intervalDashboardDetails);
  }, [selectedFilter]);

  // console.log("filter value:  ", selectedFilter);

  const handleFilterChange = (event) => {
    const selectedValue = event.target.value;

    switch (selectedValue) {
      case "Today":
        // handleThisWeekClick();
        break;
      case "Yesterday":
        // handleThisWeekClick();
        break;
      case "This Week":
        // handleThisMonthClick();
        break;
      case "This Month":
        // handleThisMonthClick();
        break;
      case "Last Month":
        // handleThisMonthClick();
        break;
      case "Till Today":
        // handleThisMonthClick();
        break;
      default:
        break;
    }

    fetchDashboardDetails(selectedValue);
    setSelectedFilter(selectedValue);
  };

  useEffect(() => {
    // console.log("overview got hit");
    if (overviewData && Object.keys(overviewData).length > 0) {
      // console.log("overview got hit . . . ..");
      let totalRecommendation = Number(overviewData.totalRecommendation) || 0;
      let formattedTotalRecommendation = totalRecommendation.toLocaleString(
        "en-US",
        {
          minimumIntegerDigits: 2,
          useGrouping: false,
        }
      );
      setTotalRecommendations(formattedTotalRecommendation);

      setTotalRecommendationsData({
        ...(overviewData.releasedRecommendations && {
          label1: Number(overviewData.releasedRecommendations) || 0,
        }),
        ...(overviewData.pendingForApproval && {
          label2: Number(overviewData.pendingForApproval) || 0,
        }),

        ...(overviewData.approvedRecommendationsToBeImplement && {
          label3:
            Number(overviewData.approvedRecommendationsToBeImplement) || 0,
        }),

        ...(overviewData.rejectedRecommendation && {
          label4: Number(overviewData.rejectedRecommendation) || 0,
        }),
      });

      let approvedRecommendationNotYetReleased =
        Number(overviewData.approvedRecommendationNotYetReleased) || 0;
      let onTimeDoneRecommendationCount =
        Number(overviewData.onTimeDoneRecommendationCount) || 0;
      let delayRecommendationsCount =
        Number(overviewData.delayRecommendationsCount) || 0;

      let statusSum =
        approvedRecommendationNotYetReleased +
        onTimeDoneRecommendationCount +
        delayRecommendationsCount;

      // Format the number with leading zeros if it's less than 10
      let formattedStatusSum = statusSum.toLocaleString("en-US", {
        minimumIntegerDigits: 2,
        useGrouping: false,
      });
      setImplementationStatus(formattedStatusSum);
      setImplementationStatusData({
        ...(overviewData.approvedRecommendationNotYetReleased && {
          label1:
            Number(overviewData.approvedRecommendationNotYetReleased) || 0,
        }),

        ...(overviewData.onTimeDoneRecommendationCount && {
          label2: Number(overviewData.onTimeDoneRecommendationCount) || 0,
        }),

        ...(overviewData.delayRecommendationsCount && {
          label3: Number(overviewData.delayRecommendationsCount) || 0,
        }),
      });
    }
  }, [overviewData]);

  // console.log("implementationStatusData:--   ", implementationStatusData);

  return (
    <Grid container>
      <Grid item xs={12} sm={12} md={12} lg={12}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            flexGrow: 1,
            width: "100%",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Typography
            sx={{ ...customFontStyles, fontSize: "20px", color: "#281C61" }}
          >
            Overview
          </Typography>

          <FormControl sx={{ m: 1, minWidth: 220 }} size="small">
            {/* <InputLabel
              id="demo-select-small-label"
              sx={{
                color: "#281C61",
                "&.Mui-focused": {
                  color: "#281C61",
                },
              }}
            >
              Filter
            </InputLabel> */}
            <Select
              labelId="demo-select-small-label"
              id="demo-select-small"
              value={selectedFilter}
              // label="Filter"
              sx={{
                borderRadius: "15px",
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#281C61",
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#281C61",
                },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#281C61",
                },
              }}
              onChange={handleFilterChange}
              elevation={3}
            >
              {options.map((option, index) => (
                <MenuItem
                  key={index}
                  value={option.value}
                  sx={{
                    height: "40px",
                    fontSize: "12px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    borderBottom:
                      index !== options.length - 1 ? "1px solid #ccc" : "none",
                    padding: "8px", // Adjust padding as needed
                  }}
                >
                  {/* {option.label} */}

                  <div style={{ display: "flex", alignItems: "center" }}>
                    <ListItemText
                      primary={
                        <Typography
                          variant="body2"
                          sx={{
                            fontSize: "14px",
                            color:
                              selectedFilter.indexOf(option.label) > -1
                                ? "#464646"
                                : "#7E7E7E",
                          }}
                        >
                          {option.label}
                        </Typography>
                      }
                    />
                  </div>
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </Grid>
      <Grid item xs={12} sm={12} md={12} lg={12}>
        <Paper
          // elevation={5}
          sx={{
            display: "flex",
            flexDirection: "row",
            flexGrow: 1,
            maxHeight: "400px",
            marginTop: "1em",
            borderRadius: "30px",
            overflow: "hidden",
            alignItems: "center",
            paddingX: "50px",
          }}
        >
          <Box
            sx={{
              minWidth: "48%",
              maxWidth: "48%",

              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              overflow: "hidden",
              // bgcolor:'red',
              gap: 3,
              paddingY: "2em",
            }}
          >
            <Box
              sx={{
                width: "100%",
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                // bgcolor: "orange",
                maxHeight: "38px",
                // bgcolor: "orange",
              }}
            >
              <Typography
                sx={{ ...customFontStyles, fontSize: "20px", fontWeight: 400 }}
              >
                Total recommendations
              </Typography>
              <Typography
                sx={{ color: "#464646", fontSize: "32px", fontWeight: 700 }}
              >
                {totalRecommendations}
              </Typography>
            </Box>

            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                gap: 4,
                // marginBottom: "2em",
              }}
            >
              <Box
                sx={{
                  minWidth: "255px",
                  maxWidth: "255px",
                  minHeight: "255px",
                  maxHeight: "255px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <PieSlice
                  data={totalRecommendationsData}
                  pieChartType={RECOMMENDATION_TYPE}
                />
              </Box>

              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  minWidth: "7em",
                  justifyContent: "center",
                  gap: 3,
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <Box
                    sx={{
                      width: "12px",
                      height: "12px",
                      borderRadius: "2px",
                      background: "#00A9E5",
                      marginRight: "10px",
                    }}
                  />
                  <Typography
                    sx={{
                      ...customFontStyles,
                      color: "#3d3d3d",
                      fontSize: "14px",
                      fontWeight: 400,
                    }}
                  >
                    Completed
                  </Typography>
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <Box
                    sx={{
                      width: "12px",
                      height: "12px",
                      borderRadius: "2px",
                      background: "#55DAF8",
                      marginRight: "10px",
                    }}
                  />
                  <Typography
                    sx={{
                      ...customFontStyles,
                      color: "#3d3d3d",
                      fontSize: "14px",
                      fontWeight: 400,
                    }}
                  >
                    Pending for approval
                  </Typography>
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <Box
                    sx={{
                      width: "12px",
                      height: "12px",
                      borderRadius: "2px",
                      background: "#9EE1F8",
                      marginRight: "10px",
                    }}
                  />
                  <Typography
                    sx={{
                      ...customFontStyles,
                      color: "#3d3d3d",
                      fontSize: "14px",
                      fontWeight: 400,
                    }}
                  >
                    Implementation
                  </Typography>
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <Box
                    sx={{
                      width: "12px",
                      height: "12px",
                      borderRadius: "2px",
                      background: "#D5F0FA",
                      marginRight: "10px",
                    }}
                  />
                  <Typography
                    sx={{
                      ...customFontStyles,
                      color: "#3d3d3d",
                      fontSize: "14px",
                      fontWeight: 400,
                    }}
                  >
                    Rejected
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Box>
          <div
            style={{
              flex: 1,
              minWidth: "1px",
              maxWidth: "1px",
              background: "#D9D9D9",
              // marginLeft: "4.2px",
              // minHeight: "4.5em",
              minHeight: "300px",
              maxHeight: "300px",
              display: "block",
              marginLeft: "2%",
              marginRight: "2%",
            }}
          />
          <Box
            sx={{
              minWidth: "48%",
              maxWidth: "48%",

              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              overflow: "hidden",
              // bgcolor:'red',
              gap: 3,
              paddingY: "2em",
            }}
          >
            <Box
              sx={{
                width: "100%",
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                // bgcolor: "orange",
                maxHeight: "38px",
                // bgcolor: "orange",
              }}
            >
              <Typography
                sx={{ ...customFontStyles, fontSize: "20px", fontWeight: 400 }}
              >
                Implementation status
              </Typography>
              <Typography
                sx={{ color: "#464646", fontSize: "32px", fontWeight: 700 }}
              >
                {implementationStatus}
              </Typography>
            </Box>

            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                gap: 4,
                // marginBottom: "2em",
              }}
            >
              <Box
                sx={{
                  minWidth: "255px",
                  maxWidth: "255px",
                  minHeight: "255px",
                  maxHeight: "255px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <PieSlice
                  data={implementationStatusData}
                  pieChartType={IMPLEMENTATION_TYPE}
                />
              </Box>

              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  minWidth: "7em",
                  justifyContent: "center",
                  gap: 3,
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <Box
                    sx={{
                      width: "12px",
                      height: "12px",
                      borderRadius: "2px",
                      background: "#00A9E5",
                      marginRight: "10px",
                    }}
                  />
                  <Typography
                    sx={{
                      ...customFontStyles,
                      color: "#3d3d3d",
                      fontSize: "14px",
                      fontWeight: 400,
                    }}
                  >
                    Planned
                  </Typography>
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <Box
                    sx={{
                      width: "12px",
                      height: "12px",
                      borderRadius: "2px",
                      background: "#55DAF8",
                      marginRight: "10px",
                    }}
                  />
                  <Typography
                    sx={{
                      ...customFontStyles,
                      color: "#3d3d3d",
                      fontSize: "14px",
                      fontWeight: 400,
                    }}
                  >
                    On time
                  </Typography>
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <Box
                    sx={{
                      width: "12px",
                      height: "12px",
                      borderRadius: "2px",
                      background: "#9EE1F8",
                      marginRight: "10px",
                    }}
                  />
                  <Typography
                    sx={{
                      ...customFontStyles,
                      color: "#3d3d3d",
                      fontSize: "14px",
                      fontWeight: 400,
                    }}
                  >
                    Delayed
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Box>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default Overview;
