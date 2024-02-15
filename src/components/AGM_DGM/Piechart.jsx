import React from "react";
import axios from "axios";
import { useState, useEffect, useRef } from "react";
import {
  Grid,
  Typography,
  Paper,
  Box,
  Divider,
  TextField,
  Autocomplete,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import config from "../../config/config";
import { useNavigate } from "react-router-dom";
import { PiechartAction } from "../../actions/PiechartAction";
// import OutlinedInput from "@mui/material/OutlinedInput";
// import InputLabel from "@mui/material/InputLabel";
// import MenuItem from "@mui/material/MenuItem";
// import FormControl from "@mui/material/FormControl";
// import Select from "@mui/material/Select";
// import TextField from "@mui/material/TextField";
// import Autocomplete from "@mui/material/Autocomplete";

import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import SquarePiechart from "./SquarePiechart";
import ApprovalsTable from "./ApprovalsTable";
import OemForm from "./OemForm";
import Navbar from "../../components/global/Navbar";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  OEM_SI,
  APPLICATION_OWNER,
  AGM,
  GM_IT_INFRA,
} from "../../helper/constants";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const names = [];

function getStyles(name, personName, theme) {
  return {
    fontWeight:
      personName.indexOf(name) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}

const Piechart = () => {
  const theme = useTheme();
  const [personName, setPersonName] = React.useState([]);
  const [age, setAge] = React.useState("");
  const [pieChartData, setPieChartData] = useState([]);
  const [totalRecommendation, setTotalRecommendation] = useState("");

  const initialRenderRef = useRef(true);

  const handleChange1 = (event) => {
    setAge(event.target.value);
  };

  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    setPersonName(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value
    );
  };

  const [selectedOption, setSelectedOption] = useState("This Month");
  const [releasedRecommendations, setReleasedRecommendations] = useState(0);
  const [pendingForApproval, setpendingForApproval] = useState(0);
  const [rejectedRecommendation, setRejectedRecommendation] = useState(0);
  const [
    approvedRecommendationsToBeImplement,
    setApprovedRecommendationsToBeImplement,
  ] = useState(0);

  const options = [
    "Today",
    "Yesterday",
    "This Week",
    "This Month",
    "Last Month",
    "Till Today",
  ];

  const handleAutocompleteChange = (event, newValue) => {
    setSelectedOption(newValue);
  };

  // const displayOptionsAsString = options.map((option) => option).join(", ");

  //token
  // const datas = sessionStorage.getItem("data");
  // const data = JSON.parse(datas);
  // const token = data.token;
  const data = JSON.parse(sessionStorage.getItem("data"));
  const userType = data.userType;

  const fetchDataPiechart = async () => {
    try {
      const payload = {
        value: selectedOption,
      };

      const response = await PiechartAction.pieChart(payload);
      if (response.status === 200) {
        setPieChartData(response.data.data);
      }
    } catch (error) {
      toast.error(error.response.data.message);
      console.error(error);
    }
  };

  // useEffect(() => {
  //   if (initialRenderRef.current) {
  //     initialRenderRef.current = false;
  //     return;
  //   }

  //   fetchDataPiechart();
  // }, [selectedOption]);

  const [allData, setAllData] = useState([]);
  const [listData, setListData] = useState([]);
  const [approvedListAppOwner, setApprovedListAppOwner] = useState([]);
  const [messagePending, setMessagePending] = useState("");
  const [messageApproved, setMessageApproved] = useState("");

  const fetchDataAgm = async () => {
    try {
      // const listUrl = config.baseUrl + config.apiEndPoints.getAllRecommendation;

      // const response = await axios.get(listUrl, {
      //   headers: {
      //     Authorization: `Bearer ${token}`,
      //   },
      // });

      const response = await PiechartAction.agmData();

      if (response.status === 200) {
        setListData(response.data.data.recommendations);
      }
    } catch (error) {
      toast.error(error.response.data.message);
      console.log(error);
    }
  };

  let message;
  const fetchDataAppOwner = async () => {
    try {
      const response = await PiechartAction.appownerData();

      if (response.status === 200) {
        setListData(response.data.data.pendingRecommendation);
        setAllData(response.data);

        setMessagePending(response.data.message);
      }
    } catch (error) {
      toast.error(error.response.data.message);
      console.log(error);
    }
  };

  const fetchApprovedListAppOwner = async () => {
    try {
      const response = await PiechartAction.approvedAppownerData();

      if (response.status === 200) {
        setApprovedListAppOwner(response.data.data.approvedRecommendation);
        setAllData(response.data);
        setMessageApproved(response.data.message);
      }
    } catch (error) {
      toast.error(error.response.data.message);
      console.log(error);
    }
  };

  // useEffect(() => {
  //   if (userType === "AGM" || userType === "OEM_SI") {
  //     fetchDataAgm();
  //   } else if (userType === "APPLICATION_OWNER") {
  //     fetchDataAppOwner();
  //     fetchApprovedListAppOwner();
  //   }
  // }, []);

  //original settimeout
  useEffect(() => {
    const fetchData = () => {
      if (
        userType === "AGM" ||
        userType === "OEM_SI" ||
        userType === "GM_IT_INFRA"
      ) {
        fetchDataAgm();
      }

      if (userType === "AGM" || userType === "GM_IT_INFRA") {
        fetchDataAgm();
        fetchDataPiechart();
      } else if (userType === "APPLICATION_OWNER") {
        fetchDataAppOwner();
        fetchApprovedListAppOwner();
      }
    };

    fetchData();

    const intervalId = setInterval(() => {
      fetchData();
    }, 25000);

    return () => {
      clearInterval(intervalId);
    };
  }, [userType, selectedOption]);

  // useEffect(() => {
  //   const fetchDataInterval = () => {
  //     if (userType === "AGM" || userType === "OEM_SI" || userType === "GM_IT_INFRA") {
  //       fetchDataAgm();
  //     }

  //     if (userType === "AGM" || userType === "GM_IT_INFRA") {
  //       fetchDataAgm();
  //       fetchDataPiechart();
  //     }

  //     else if (userType === "APPLICATION_OWNER") {
  //       fetchDataAppOwner();
  //       fetchApprovedListAppOwner();
  //     }
  //   };

  //   const intervalId = setInterval(fetchDataInterval, 25000);

  //   fetchDataInterval();

  //   return () => {
  //     clearInterval(intervalId);
  //   };
  // }, [userType]);

  return (
    <>
      <Navbar
        fetchDataAppOwner={fetchDataAppOwner}
        fetchApprovedListAppOwner={fetchApprovedListAppOwner}
        fetchDataAgm={fetchDataAgm}
      />
      <Box
        sx={{
          display: "flex",
          flexGrow: 1,
          p: 3,
          height: "100%",

          maxWidth: "100vw",
          backgroundColor: "#f1fbfe",
          // backgroundColor: "rgba(214, 242, 251, 0.30)",
        }}
      >
        <Grid container sx={{ backgroundColor: "" }} spacing={2}>
          <Grid item xs={12}>
            {(userType === "AGM" || userType === "GM_IT_INFRA") && (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  width: "88vw",
                  marginLeft: "3vw",
                  p: 3,
                  marginBottom: "",
                  backgroundColor: "",
                }}
              >
                {/* <Typography >OEM 360</Typography> */}

                <>
                  <Typography
                    sx={{ fontSize: "20px", color: "#281C61", fontWeight: 600 }}
                  >
                    Overview
                  </Typography>

                  <Autocomplete
                    disablePortal
                    id="combo-box-demo"
                    options={options}
                    value={selectedOption}
                    onChange={handleAutocompleteChange}
                    getOptionLabel={(option) => option}
                    sx={{ width: 300, marginRight: 1, marginTop: 1 }}
                    renderInput={(params) => (
                      <TextField {...params} label="Select Option" />
                    )}
                  />
                </>
              </Box>
            )}

            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                p: 3,
                flexGrow: 1,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "",
                maxWidth: "100vw",
              }}
            >
              {(userType === "AGM" || userType === "GM_IT_INFRA") && (
                <Paper
                  sx={{
                    backgroundColor: "#FFF",
                    boxShadow: "0px 0px 24px rgba(0, 0, 0, 0.08)",
                    display: "flex",
                    flexDirection: "row",
                    borderRadius: "20px",
                    backgroudColor: "",
                  }}
                >
                  <Box sx={{ height: 400, width: "45vw" }}>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        p: 2,
                        m: 2,
                      }}
                    >
                      <Typography>Total Recommendations:</Typography>
                      <Typography
                        style={{ fontSize: "25px", fontWeight: "bolder" }}
                      >
                        {pieChartData.totalRecommendation}
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        gap: 10,
                      }}
                    >
                      <div
                        style={{
                          width: "240px",
                          height: "240px",
                          backgroundColor: "",
                        }}
                      >
                        <SquarePiechart
                          dataset={[
                            pieChartData.releasedRecommendations,
                            pieChartData.pendingForApproval,
                            pieChartData.rejectedRecommendation,
                            pieChartData.approvedRecommendationsToBeImplement,
                          ]}
                          colors={["#9EE1F8", "#00A9E5", "#55DAF8", "#D5F0FA"]}
                          pieChartData={pieChartData}
                          labels={[
                            "Released",
                            "Pending",
                            "Rejected",
                            "Approved",
                          ]}
                        />
                      </div>
                      <div
                        style={{
                          width: "157px",
                          height: "148px",
                          backgroundColor: "",
                          display: "",
                          gap: "30px",

                          marginTop: "70px",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "center",
                          }}
                        >
                          <div
                            style={{
                              width: "12px",
                              height: "12px",
                              backgroundColor: "#00A9E5",
                              marginRight: "5px", // Add margin for spacing
                            }}
                          ></div>
                          <Typography>Completed</Typography>
                        </div>

                        <div
                          style={{
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "center",
                          }}
                        >
                          <div
                            style={{
                              width: "12px",
                              height: "12px",
                              backgroundColor: "#55DAF8",
                              marginRight: "5px", // Add margin for spacing
                            }}
                          ></div>
                          <Typography>Pending </Typography>
                        </div>

                        <div
                          style={{
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "center",
                          }}
                        >
                          <div
                            style={{
                              width: "12px",
                              height: "12px",
                              backgroundColor: "#9EE1F8",
                              marginRight: "5px", // Add margin for spacing
                            }}
                          ></div>
                          <Typography>Implementation</Typography>
                        </div>

                        <div
                          style={{
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "center",
                          }}
                        >
                          <div
                            style={{
                              width: "12px",
                              height: "12px",
                              backgroundColor: "#D5F0FA",
                              marginRight: "5px", // Add margin for spacing
                            }}
                          ></div>
                          <Typography>Rejected</Typography>
                        </div>
                      </div>
                    </Box>
                  </Box>

                  <hr style={{ margin: "70px 0 70px 0", color: "#D9D9D9" }} />

                  <Box sx={{ height: 400, width: "45vw" }}>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        p: 2,
                        m: 2,
                      }}
                    >
                      <Typography>Implementation Status:</Typography>
                      <Typography
                        style={{ fontSize: "25px", fontWeight: "bolder" }}
                      >
                        {pieChartData.onTimeDoneRecommendationCount +
                          pieChartData.delayRecommendationsCount +
                          pieChartData.approvedRecommendationNotYetReleased}
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        gap: 10,
                      }}
                    >
                      <div
                        style={{
                          width: "240px",
                          height: "240px",
                          backgroundColor: "",
                        }}
                      >
                        <SquarePiechart
                          dataset={[
                            pieChartData.approvedRecommendationNotYetReleased,
                            pieChartData.onTimeDoneRecommendationCount,
                            pieChartData.delayRecommendationsCount,
                          ]}
                          colors={["#9EE1F8", "#00A9E5", "#55DAF8"]}
                          labels={[]}
                        />
                      </div>
                      <div
                        style={{
                          width: "157px",
                          height: "148px",
                          backgroundColor: "",
                          display: "",
                          gap: "30px",

                          marginTop: "70px",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "center",
                          }}
                        >
                          <div
                            style={{
                              width: "12px",
                              height: "12px",
                              backgroundColor: "#00A9E5",
                              marginRight: "5px", // Add margin for spacing
                            }}
                          ></div>
                          <Typography>Planned</Typography>
                        </div>

                        <div
                          style={{
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "center",
                          }}
                        >
                          <div
                            style={{
                              width: "12px",
                              height: "12px",
                              backgroundColor: "#55DAF8",
                              marginRight: "5px", // Add margin for spacing
                            }}
                          ></div>
                          <Typography>Ontime </Typography>
                        </div>

                        <div
                          style={{
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "center",
                          }}
                        >
                          <div
                            style={{
                              width: "12px",
                              height: "12px",
                              backgroundColor: "#9EE1F8",
                              marginRight: "5px", // Add margin for spacing
                            }}
                          ></div>
                          <Typography>Delayed</Typography>
                        </div>
                      </div>
                    </Box>
                  </Box>
                </Paper>
              )}

              {userType === "OEM_SI" && (
                <>
                  <OemForm fetchDataAgm={fetchDataAgm} />
                </>
              )}
            </Box>

            {userType === "APPLICATION_OWNER" && (
              <>
                <Box
                  sx={{
                    marginRight: "85rem",
                    backgroundColor: "",
                    marginBottom: -10,
                  }}
                >
                  <Typography
                    sx={{
                      color: "#281C61",
                      fontSize: "20px",
                      fontFamily: "sans-serif",
                      fontWeight: 600,
                      textTransform: "capitalize",
                    }}
                  >
                    OEM 360
                  </Typography>
                  <Typography
                    sx={{
                      color: "#281C61",
                      fontSize: "20px",
                      fontFamily: "sans-serif",
                      fontWeight: 600,
                      textTransform: "capitalize",
                    }}
                  >
                    {}
                    Pending Recommendations
                  </Typography>
                </Box>
                <ApprovalsTable
                  listData={listData}
                  fetchApprovedListAppOwner={fetchApprovedListAppOwner}
                  fetchDataAppOwner={fetchDataAppOwner}
                />

                <Box
                  sx={{
                    marginRight: "85rem",
                    backgroundColor: "",
                    // marginBottom: -5,
                  }}
                >
                  <Typography
                    sx={{
                      color: "#281C61",
                      fontSize: "20px",
                      fontFamily: "sans-serif",
                      fontWeight: 600,
                      marginBottom: -8,
                      textTransform: "capitalize",

                      // float:"left",
                      // marginLeft:"3rem"
                    }}
                  >
                    Approved Recommendations
                  </Typography>
                </Box>

                <ApprovalsTable
                  listData={approvedListAppOwner}
                  allData={allData}
                  fetchApprovedListAppOwner={fetchApprovedListAppOwner}
                  fetchDataAppOwner={fetchDataAppOwner}
                />
              </>
            )}

            {userType !== "APPLICATION_OWNER" && (
              <>
                <ApprovalsTable
                  listData={listData}
                  fetchDataAgm={fetchDataAgm}
                  fetchDataPiechart={fetchDataPiechart}
                />
              </>
            )}
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

export default Piechart;
