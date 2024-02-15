import React from "react";
import { useState, useEffect } from "react";
import "../../css/AcceptModal.css";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import { TextField, Grid, Paper } from "@mui/material";
import { styled } from "@mui/material/styles";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import TrailModal from "./TrailModal";
import config from "../../config/config";
import axios from "axios";
import { AcceptModalAction } from "../../actions/AcceptModalAction";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import dayjs from "dayjs";
//loader
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";

// import TextField from '@mui/material/TextField';

import Autocomplete from "@mui/material/Autocomplete";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
// import BasicTimeline from "./BasicTimeline";

import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemText from "@mui/material/ListItemText";
import Checkbox from "@mui/material/Checkbox";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

const AcceptModal = ({
  open,
  onClose,
  selectedData,
  fetchApprovedListAppOwner,
  fetchDataAppOwner,
  fetchDataAgm,
  fetchDataPiechart,
}) => {
  //   const initialDevelopmentStartDate = dayjs(selectedData?.tableData.recommendationDeploymentDetails?.developmentStartDate);
  //   const initialDevelopmentEndDate = dayjs(selectedData?.tableData.recommendationDeploymentDetails?.developmentEndDate);
  //   const initialTestCompletionDate =  dayjs(selectedData?.tableData.recommendationDeploymentDetails?.testCompletionDate);
  //   const initialDeployementDate = dayjs(selectedData?.tableData.recommendationDeploymentDetails?.deploymentDate);
  // const initialImpactedDepartment = selectedData?.tableData.recommendationDeploymentDetails?.impactedDepartment;
  // const initialImpactedDepartmentArray = initialImpactedDepartment.split(, )

  // console.log(initialImpactedDepartment,"you")
  // console.log(selectedData, "SELECTEDDATA");
  const [age, setAge] = React.useState("");
  const [rowData, setRowData] = useState("");
  const [tableDatas, setTableDatas] = useState("");

  const [comments, setComments] = useState("");
  // const [developmentStartDate, setDevelopmentStartDate] = useState(null);
  const [developmentStartDate, setDevelopmentStartDate] = useState(null);
  const [developmentEndDate, setDevelopmentEndDate] = useState(null);
  const [testCompletionDate, setTestCompletionDate] = useState(null);
  const [deploymentDate, setDeploymentDate] = useState(null);
  const [impactedDepartment, setimpactedDepartment] = useState([]);
  const [globalSupportNumber, setglobalSupportNumber] = useState("");

  const [description, setdescription] = useState("");
  const [selectedOptions, setSelectedOptions] = useState([]);

  const [departmentOptions, setDepartmentOptions] = useState([]);
  const [departmentNames, setDepartmentNames] = useState([]);

  //status
  const [status, setStatus] = useState([]);
  const [options, setOptions] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);

  //loader
  const [openLoader, setOpenLoader] = React.useState(false);
  const [buttonDisabled, setButtonDisabled] = useState(false);

  const handleClose = () => {
    setOpenLoader(false);
  };

  const datas = sessionStorage.getItem("data");
  const data = JSON.parse(datas);
  const token = data?.token;
  const createdById = data?.id;
  const userType = data?.userType;
  const companyId = data?.company.id;

  const fetchDepartment = async () => {
    try {
      // const departmentUrl =
      //   config.baseUrl +
      //   config.apiEndPoints.getAllDepartment +
      //   `?companyId=${companyId}`;

      // const response = await axios.get(departmentUrl, {
      //   headers: {
      //     Authorization: `Bearer ${token}`,
      //   },
      // });

      const payload = {
        companyId: companyId,
      };

      const response = await AcceptModalAction.department(payload);
      if (response.status === 200) {
        setDepartmentOptions(response.data.data);

        // const departmentNamesString = response.data.data.map((item) => item.name).join(', ');
        setDepartmentNames(response.data.data.map((item) => item.name));
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchStatus = async () => {
    try {
      const statusUrl = config.baseUrl + config.apiEndPoints.getAllStatus;
      const response = await axios.get(statusUrl, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // const payload = {
      //   companyId: companyId,
      // };

      //  const response = await AcceptModalAction.department(payload);
      if (response.status === 200) {
        setStatus(response.data.data);

        // console.log(response.data.data, "status");

        // setDepartmentNames(response.data.data.map((item) => item.name));
      }
    } catch (error) {
      console.log(error);
    }
  };

  const submitApproval = async () => {
    setOpenLoader(true);
    try {
      const payload = {
        createdBy: {
          id: createdById,
        },
        developmentStartDate: developmentStartDate
          ? developmentStartDate
          : null,
        developementEndDate: developmentEndDate ? developmentEndDate : null,
        testCompletionDate: testCompletionDate ? testCompletionDate : null,
        deploymentDate: deploymentDate ? deploymentDate : null,
        impactedDepartment: impactedDepartment?.join(", "),
        globalSupportNumber: globalSupportNumber ? globalSupportNumber : "",
        recommendRefId: rowData.ReferenceId,
        description: comments,
      };

      if (userType === "AGM") {
        const response = await AcceptModalAction.submitApprovalAgm(payload);
        if (
          response.data.responseCode === 201 ||
          response.data.responseCode === 200
        ) {
          setOpenLoader(false);
          toast(response.data.message);
          fetchDataAgm();
          fetchDataPiechart();
          setDevelopmentStartDate(null);
          setDevelopmentEndDate(null);
          setTestCompletionDate(null);
          setDeploymentDate(null);
          setimpactedDepartment("");
          setglobalSupportNumber("");
          setdescription("");
          setDepartmentNames([]);
          onClose();
        } else {
          setOpenLoader(false);
          alert(response.data.message);
        }
      }

      if (userType === "APPLICATION_OWNER") {
        const response = await AcceptModalAction.submitApprovalAppOwner(
          payload
        );
        if (
          response.data.responseCode === 201 ||
          response.data.responseCode === 200
        ) {
          setOpenLoader(false);
          toast(response.data.message);
          fetchDataAppOwner();
          fetchApprovedListAppOwner();
          setDevelopmentStartDate(null);
          setDevelopmentEndDate(null);
          setTestCompletionDate(null);
          setDeploymentDate(null);
          setimpactedDepartment("");
          setglobalSupportNumber("");
          setdescription("");
          setDepartmentNames([]);
          onClose();
        } else {
          setOpenLoader(false);
          alert(response.data.message);
        }
      }
    } catch (error) {
      setOpenLoader(false);
      // alert(error.response.data.message);
    }
  };

  const revertApproval = async () => {
    setOpenLoader(true);
    try {
      const payload = {
        createdBy: {
          id: createdById,
        },
        // developmentStartDate: developmentStartDate,
        // developementEndDate: "2024-01-24",
        // testCompletionDate: "2024-01-25",
        // deploymentDate: "2024-01-26",
        // impactedDepartment: "",
        // globalSupportNumber: "545454545454545",
        recommendRefId: rowData.ReferenceId,
        description: comments,
      };

      const response = await AcceptModalAction.revertByAgm(payload);
      if (
        response.data.responseCode === 201 ||
        response.data.responseCode === 200
      ) {
        setOpenLoader(false);
        toast(response.data.message);
        fetchDataAgm();
        setComments("");
        setdescription("");
        setDepartmentNames([]);
        onClose();
      } else {
        setOpenLoader(false);
        alert(response.data.message);
      }
    } catch (error) {
      setOpenLoader(false);
      // alert(error.response.data.message);
    }
  };

  if (
    Array.isArray(tableDatas?.messageList) &&
    tableDatas.messageList.length > 0
  ) {
    tableDatas.messageList.forEach((message) => {
      console.log(message?.createdBy?.userName);
    });
  } else {
    console.log("Message list is not defined or is empty");
  }

  const formatDate2 = (dateString) => {
    if (!dateString) {
      return "";
    }

    const date = new Date(dateString);

    if (isNaN(date.getTime())) {
      console.error("Invalid date string:", dateString);
      return "";
    }

    const options = {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      // hour: "2-digit",
      // minute: "2-digit",
      // hour12: true,
    };

    const formattedDate = new Intl.DateTimeFormat("en-IN", options).format(
      date
    );

    return formattedDate;
  };

  useEffect(() => {
    if (selectedData) {
      // console.log(selectedData, "helloselected");
      setRowData(selectedData.row);
      setTableDatas(selectedData.tableData);

      if (
        selectedData?.tableData.recommendationDeploymentDetails
          ?.developmentStartDate
      ) {
        setDevelopmentStartDate(
          dayjs(
            selectedData?.tableData.recommendationDeploymentDetails
              ?.developmentStartDate
          )
        );
      }
      if (
        selectedData?.tableData.recommendationDeploymentDetails
          ?.developementEndDate
      ) {
        setDevelopmentEndDate(
          dayjs(
            selectedData?.tableData.recommendationDeploymentDetails
              ?.developementEndDate
          )
        );
      }
      if (
        selectedData?.tableData.recommendationDeploymentDetails
          ?.testCompletionDate
      ) {
        setTestCompletionDate(
          dayjs(
            selectedData?.tableData.recommendationDeploymentDetails
              ?.testCompletionDate
          )
        );
      }
      if (
        selectedData?.tableData.recommendationDeploymentDetails?.deploymentDate
      ) {
        setDeploymentDate(
          dayjs(
            selectedData?.tableData.recommendationDeploymentDetails
              ?.deploymentDate
          )
        );
      }
      if (
        selectedData?.tableData.recommendationDeploymentDetails
          ?.globalSupportNumber
      ) {
        setglobalSupportNumber(
          dayjs(
            selectedData?.tableData.recommendationDeploymentDetails
              ?.globalSupportNumber
          )
        );
      }

      if (
        selectedData?.tableData.recommendationDeploymentDetails
          ?.impactedDepartment
      ) {
        setimpactedDepartment(
          selectedData?.tableData.recommendationDeploymentDetails?.impactedDepartment.split(
            ", "
          )
        );
      }

      fetchDepartment();
    }
  }, [selectedData]);

  // console.log(tableDatas, "lll");

  useEffect(() => {
    fetchStatus();
  }, []);

  useEffect(() => {
    if (selectedData && selectedData.tableData.status.id >= 3) {
      // const selectedIndex = status.findIndex(
      //   (statusItem) => statusItem.id  === selectedData.row.Status
      // );
      let nextStatus;
      const selectedIndex = selectedData.tableData.status.id;

      if (selectedIndex === 3) {
        nextStatus = status[selectedIndex + 1];
      } else {
        nextStatus = status[selectedIndex];
      }

      setOptions([nextStatus]);
    } else {
      setOptions([]);
    }
  }, [selectedData, status]);

  const handleAutocompleteChange = (event, newValue) => {
    setSelectedOption(newValue);
    // console.log(newValue, "newvalue");
  };

  const updateStatus = async () => {
    const url = config.baseUrl + config.apiEndPoints.updateStatus;
    // debugger;

    try {
      const payload = {
        recommendRefId: rowData.ReferenceId,
        recommendationStatus: selectedOption.id,
      };

      const response = await axios.post(url, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.responseCode === 200) {
        toast(response.data.message);

        setSelectedOption(null);

        onClose();
        fetchApprovedListAppOwner();
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // console.log(rowData, "rowData");

  return (
    <Modal
      open={open}
      onClose={onClose}
      sx={{ overflowY: "auto", backgroundColor: "" }}

      // sx={{ maxHeight: 850,overflowY: 'auto',paddingTop:7}}
    >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 780,
          bgcolor: "#EBF9FD",
          // backgroundColor: "",
          marginTop: 15,
          // marginBottom: 25,
          // maxHeight: 850,overflowY: 'auto',

          // boxShadow: 24,
          borderRadius: "12px",

          p: 2,
          gap: "30px",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            backgroundColor: "",
          }}
        >
          <Box>
            <Typography
              id="modal-modal-title"
              variant="h6"
              component="h2"
              sx={{ color: "#281C61", fontSize: "24px", fontWeight: 600 }}
            >
              Deployment Details
            </Typography>
            <Typography
              sx={{
                color: "rgba(52, 58, 64, 0.60)",
                fontSize: "16px",
                fontWeight: 400,
              }}
            >
              OEM recommended deployment date:
              {formatDate2(rowData?.RecommendEndDate)}
            </Typography>
          </Box>

          <CancelOutlinedIcon
            onClick={onClose}
            sx={{
              cursor: "pointer",
              width: "32px",
              height: "32px",
              fill: "#EBF9FD",
              stroke: "#281C61",
              strokeWidth: "0.5px",
            }}
          />
        </Box>

        <Box>
          <Typography
            sx={{ color: "#464646", mt: 2, fontSize: "16px", fontWeight: 600 }}
          >
            Reference ID : {rowData?.ReferenceId}
          </Typography>
        </Box>

        <Grid container spacing={4} sx={{ mt: 0 }}>
          <Grid item xs={3}>
            {/* <Item> */}
            <Box sx={{ display: "flex", flexDirection: "column" }}>
              <Typography
                sx={{ color: "#464646", fontSize: "12px", fontWeight: 600 }}
              >
                Created On
              </Typography>
              <Typography
                sx={{ color: "#7E7E7E", fontSize: "14px", fontWeight: 600 }}
              >
                {rowData?.CreatedOn}
              </Typography>
            </Box>
            {/* </Item> */}
          </Grid>
          <Grid item xs={3}>
            <Box sx={{ display: "flex", flexDirection: "column" }}>
              <Typography
                sx={{ color: "#464646", fontSize: "12px", fontWeight: 600 }}
              >
                Type
              </Typography>
              <Typography
                sx={{ color: "#7E7E7E", fontSize: "14px", fontWeight: 600 }}
              >
                {rowData?.Type}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={3}>
            <Box sx={{ display: "flex", flexDirection: "column" }}>
              <Typography
                sx={{ color: "#464646", fontSize: "12px", fontWeight: 600 }}
              >
                Priority
              </Typography>
              <Typography
                sx={{ color: "#7E7E7E", fontSize: "14px", fontWeight: 600 }}
              >
                {rowData?.Priority}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={3}>
            <Box sx={{ display: "flex", flexDirection: "column" }}>
              <Typography
                sx={{ color: "#464646", fontSize: "12px", fontWeight: 600 }}
              >
                Recommended end date
              </Typography>
              <Typography
                sx={{ color: "#7E7E7E", fontSize: "14px", fontWeight: 600 }}
              >
                {rowData?.RecommendEndDate}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={3}>
            <Box sx={{ display: "flex", flexDirection: "column" }}>
              <Typography
                sx={{ color: "#464646", fontSize: "12px", fontWeight: 600 }}
              >
                Department
              </Typography>
              <Typography
                sx={{ color: "#7E7E7E", fontSize: "14px", fontWeight: 600 }}
              >
                {rowData?.Department}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={3}>
            <Box sx={{ display: "flex", flexDirection: "column" }}>
              <Typography
                sx={{ color: "#464646", fontSize: "12px", fontWeight: 600 }}
              >
                Component name
              </Typography>
              <Typography
                sx={{ color: "#7E7E7E", fontSize: "14px", fontWeight: 600 }}
              >
                {rowData?.ComponentName}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={3}>
            <Box sx={{ display: "flex", flexDirection: "column" }}>
              <Typography
                sx={{ color: "#464646", fontSize: "12px", fontWeight: 600 }}
              >
                Approver
              </Typography>
              <Typography
                sx={{ color: "#7E7E7E", fontSize: "14px", fontWeight: 600 }}
              >
                {rowData?.ApplicationOwner}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={3}>
            <Box sx={{ display: "flex", flexDirection: "column" }}>
              <Typography
                sx={{ color: "#464646", fontSize: "12px", fontWeight: 600 }}
              >
                Status
              </Typography>
              <Typography
                sx={{ color: "#7E7E7E", fontSize: "14px", fontWeight: 600 }}
              >
                {rowData?.Status}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={3}>
            <Box sx={{ display: "flex", flexDirection: "column" }}>
              <Typography
                sx={{ color: "#464646", fontSize: "12px", fontWeight: 600 }}
              >
                Description
              </Typography>
              <Typography
                sx={{ color: "#7E7E7E", fontSize: "14px", fontWeight: 600 }}
              >
                {tableDatas?.descriptions}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={3}>
            <Box sx={{ display: "flex", flexDirection: "column" }}>
              <Typography
                sx={{ color: "#464646", fontSize: "12px", fontWeight: 600 }}
              >
                Development Start Date
              </Typography>
              <Typography
                sx={{ color: "#7E7E7E", fontSize: "14px", fontWeight: 600 }}
              >
                {formatDate2(
                  tableDatas?.recommendationDeploymentDetails
                    ?.developmentStartDate
                )}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={3}>
            <Box sx={{ display: "flex", flexDirection: "column" }}>
              <Typography
                sx={{ color: "#464646", fontSize: "12px", fontWeight: 600 }}
              >
                Development End Date
              </Typography>
              <Typography
                sx={{ color: "#7E7E7E", fontSize: "14px", fontWeight: 600 }}
              >
                {formatDate2(
                  tableDatas?.recommendationDeploymentDetails
                    ?.developementEndDate
                )}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={3}>
            <Box sx={{ display: "flex", flexDirection: "column" }}>
              <Typography
                sx={{ color: "#464646", fontSize: "12px", fontWeight: 600 }}
              >
                Test Completion Date
              </Typography>
              <Typography
                sx={{ color: "#7E7E7E", fontSize: "14px", fontWeight: 600 }}
              >
                {formatDate2(
                  tableDatas?.recommendationDeploymentDetails
                    ?.testCompletionDate
                )}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={3}>
            <Box sx={{ display: "flex", flexDirection: "column" }}>
              <Typography
                sx={{ color: "#464646", fontSize: "12px", fontWeight: 600 }}
              >
                Deployment Date
              </Typography>
              <Typography
                sx={{ color: "#7E7E7E", fontSize: "14px", fontWeight: 600 }}
              >
                {formatDate2(
                  tableDatas?.recommendationDeploymentDetails?.deploymentDate
                )}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={3}>
            <Box sx={{ display: "flex", flexDirection: "column" }}>
              <Typography
                sx={{ color: "#464646", fontSize: "12px", fontWeight: 600 }}
              >
                Impacted department
              </Typography>
              <Typography
                sx={{ color: "#7E7E7E", fontSize: "14px", fontWeight: 600 }}
              >
                {
                  tableDatas?.recommendationDeploymentDetails
                    ?.impactedDepartment
                }
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={3}>
            <Box sx={{ display: "flex", flexDirection: "column" }}>
              <Typography
                sx={{ color: "#464646", fontSize: "12px", fontWeight: 600 }}
              >
                Past experience comment
              </Typography>
              <Typography
                sx={{ color: "#7E7E7E", fontSize: "14px", fontWeight: 600 }}
              >
                -
              </Typography>
            </Box>
          </Grid>
        </Grid>

        <Grid container spacing={2} sx={{ mt: 2 }}>
          {(userType === "AGM" || userType === "APPLICATION_OWNER") &&
            tableDatas.trailResponse === null &&
            userType !== "OEM_SI" &&
            userType !== "GM_IT_INFRA" && (
              <>
                {userType !== "AGM" && (
                  <Grid container spacing={2}>
                    {/* <Grid item xs={6} sx={{}}>
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DemoContainer components={["DatePicker"]}>
                          <DatePicker
                            label="Development Start Date"
                            value={developmentStartDate}
                            onChange={(date) => setDevelopmentStartDate(date)}
                            sx={{ width: "20vw", backgroundColor: "" }}
                          />
                        </DemoContainer>
                      </LocalizationProvider>
                    </Grid> */}

                    <Grid item xs={6} sm={6} md={6} lg={6}>
                      <Box
                        sx={{
                          bgcolor: "#D6F2FB",
                          paddingX: "10px",
                          paddingY: "2px",
                          borderRadius: "10px",
                          // width:'100%'
                        }}
                      >
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                          <DatePicker
                            label="Development Start Date"
                            format="DD-MM-YYYY"
                            slots={{
                              openPickerIcon: () => (
                                <CalendarMonthIcon sx={{ color: "#281C61" }} />
                              ),
                            }}
                            // required
                            value={developmentStartDate}
                            slotProps={{
                              field: {
                                readOnly: true,
                              },
                              textField: {
                                variant: "standard",
                                InputProps: {
                                  disableUnderline: true,
                                },
                                sx: { height: "3.5em", width: "100%" },
                                required: true,
                              },
                            }}
                            onChange={(date) => setDevelopmentStartDate(date)}
                          />
                        </LocalizationProvider>
                      </Box>
                    </Grid>

                    <Grid item xs={6} sm={6} md={6} lg={6}>
                      <Box
                        sx={{
                          bgcolor: "#D6F2FB",
                          paddingX: "10px",
                          paddingY: "2px",
                          borderRadius: "10px",
                          // width:'100%'
                        }}
                      >
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                          <DatePicker
                            label="Development End Date"
                            format="DD-MM-YYYY"
                            slots={{
                              openPickerIcon: () => (
                                <CalendarMonthIcon sx={{ color: "#281C61" }} />
                              ),
                            }}
                            // required
                            value={developmentEndDate}
                            slotProps={{
                              field: {
                                readOnly: true,
                              },
                              textField: {
                                variant: "standard",
                                InputProps: {
                                  disableUnderline: true,
                                },
                                sx: { height: "3.5em", width: "100%" },
                                required: true,
                              },
                            }}
                            onChange={(date) => setDevelopmentEndDate(date)}
                          />
                        </LocalizationProvider>
                      </Box>
                    </Grid>

                    <Grid item xs={6} sm={6} md={6} lg={6}>
                      <Box
                        sx={{
                          bgcolor: "#D6F2FB",
                          paddingX: "10px",
                          paddingY: "2px",
                          borderRadius: "10px",
                          // width:'100%'
                        }}
                      >
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                          <DatePicker
                            label="Test completion date"
                            format="DD-MM-YYYY"
                            slots={{
                              openPickerIcon: () => (
                                <CalendarMonthIcon sx={{ color: "#281C61" }} />
                              ),
                            }}
                            // required
                            value={testCompletionDate}
                            slotProps={{
                              field: {
                                readOnly: true,
                              },
                              textField: {
                                variant: "standard",
                                InputProps: {
                                  disableUnderline: true,
                                },
                                sx: { height: "3.5em", width: "100%" },
                                required: true,
                              },
                            }}
                            onChange={(date) => setTestCompletionDate(date)}
                          />
                        </LocalizationProvider>
                      </Box>
                    </Grid>

                    <Grid item xs={6} sm={6} md={6} lg={6}>
                      <Box
                        sx={{
                          bgcolor: "#D6F2FB",
                          paddingX: "10px",
                          paddingY: "2px",
                          borderRadius: "10px",
                          // width:'100%'
                        }}
                      >
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                          <DatePicker
                            label="Deployment Date"
                            format="DD-MM-YYYY"
                            slots={{
                              openPickerIcon: () => (
                                <CalendarMonthIcon sx={{ color: "#281C61" }} />
                              ),
                            }}
                            // required
                            value={deploymentDate}
                            slotProps={{
                              field: {
                                readOnly: true,
                              },
                              textField: {
                                variant: "standard",
                                InputProps: {
                                  disableUnderline: true,
                                },
                                sx: { height: "3.5em", width: "100%" },
                                required: true,
                              },
                            }}
                            onChange={(date) => setDeploymentDate(date)}
                          />
                        </LocalizationProvider>
                      </Box>
                    </Grid>

                    <Grid item xs={6} sm={6} md={6} lg={6}>
                      <Box
                        sx={{
                          bgcolor: "#D6F2FB",
                          paddingX: "10px",
                          paddingY: "2px",
                          borderRadius: "10px",
                          // width:'100%'
                        }}
                      >
                        <Autocomplete
                          sx={{
                            "& fieldset": {
                              border: "none",
                              width: "20vw",
                              // backgroundColor: "red",
                            },
                          }}
                          multiple
                          id="multiple-checkboxes"
                          options={
                            Array.isArray(departmentNames)
                              ? departmentNames
                              : []
                          }
                          disableCloseOnSelect
                          getOptionLabel={(option) => option}
                          value={impactedDepartment}
                          onChange={(_, newValue) =>
                            setimpactedDepartment(newValue)
                          }
                          renderOption={(props, option, { selected }) => (
                            <li {...props}>
                              <div
                                style={{
                                  display: "flex",
                                  // justifyContent: "space-between",
                                  backgroundColor: "",
                                  width: "15vw",
                                  gap: "20px",
                                }}
                              >
                                <div>{selected ? checkedIcon : icon}</div>

                                <div>{option}</div>
                              </div>
                            </li>
                          )}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label="Select Options"
                              variant="outlined"
                            />
                          )}
                          renderTags={(value, getTagProps) =>
                            value.map((option, index) => (
                              <span key={index} style={{ marginRight: 5 }}>
                                {option}
                                {index !== value.length - 1 ? "," : ""}
                              </span>
                            ))
                          }
                        />
                      </Box>
                    </Grid>

                    <Grid item xs={6} sm={6} md={6} lg={6}>
                      <Box
                        sx={{
                          bgcolor: "#D6F2FB",
                          paddingX: "10px",
                          paddingY: "2px",
                          borderRadius: "10px",
                          // width:'100%'
                        }}
                      >
                        <TextField
                          id="outlined-basic"
                          label="Global support reference number"
                          variant="outlined"
                          sx={{
                            "& fieldset": {
                              border: "none",
                              width: "20vw",
                              backgroundColor: "",
                            },
                          }}
                          value={globalSupportNumber}
                          onChange={(e) =>
                            setglobalSupportNumber(e.target.value)
                          }
                        ></TextField>
                      </Box>
                    </Grid>
                  </Grid>
                )}

                <Grid item xs={12} sx={{ backgroundColor: "" }}>
                  <TrailModal tableData={tableDatas} />

                  <Box
                    sx={{ display: "flex", flexDirection: "column", gap: 2 }}
                  >
                    <TextField
                      id="outlined-basic"
                      label="If any enter your comment here"
                      variant="outlined"
                      value={comments}
                      onChange={(e) => setComments(e.target.value)}
                    />

                    {rowData?.Status === "Recommendation rejected" ? (
                      <Button
                        variant="contained"
                        sx={{ backgroundColor: "#281C61" }}
                        onClick={revertApproval}
                      >
                        Revert
                      </Button>
                    ) : (
                      <Button
                        variant="contained"
                        sx={{
                          backgroundColor: "#281C61",
                          width: "11vw",
                          height: "50px",
                          alignSelf: "center",
                          borderRadius: "12px",
                        }}
                        // sx={{ backgroundColor: "red" }}
                        onClick={submitApproval}
                      >
                        SEND FOR APPROVAL
                      </Button>
                    )}
                  </Box>
                </Grid>
              </>
            )}

          {userType === "APPLICATION_OWNER" &&
            tableDatas.trailResponse !== null && (
              <Box sx={{ display: "flex", flexDirection: "column" }}>
                <TrailModal tableData={tableDatas} />
                {userType === "APPLICATION_OWNER" &&
                  rowData.Status !== "OEM recommendation" &&
                  rowData.Status !== "Review process" &&
                  rowData.Status !== "Released" && (
                    <>
                      <Autocomplete
                        disablePortal
                        id="disable-close-on-select"
                        options={options}
                        value={selectedOption}
                        onChange={handleAutocompleteChange}
                        // options={statusOptions}
                        getOptionLabel={(option) => option.statusName}
                        sx={{ width: "40vw", marginTop: 1, marginLeft: 4 }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Select Status"
                            InputLabelProps={{
                              required: true,
                              style: { color: "blue" },
                            }}
                            variant="standard"
                          />
                        )}
                      />
                      <Button
                        variant="contained"
                        sx={{
                          width: "10vw",
                          alignSelf: "center",
                          marginTop: 4,
                        }}
                        onClick={updateStatus}
                        disabled={!selectedOption}
                      >
                        Update Status
                      </Button>
                    </>
                  )}

                {/* <Autocomplete
                  // {...defaultProps}
                  id="disable-close-on-select"
                  disableCloseOnSelect
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="disableCloseOnSelect"
                      variant="standard"
                    />
                  )}
                /> */}
              </Box>
            )}

          {/* {userType === "AGM" && <TrailModal tableData={tableData} />} */}

          {(userType === "OEM_SI" || userType === "GM_IT_INFRA") && (
            <TrailModal tableData={tableDatas} />
          )}
        </Grid>

        <div>
          {/* <Button onClick={handleOpen}>Show backdrop</Button> */}
          <Backdrop
            // style={{ zIndex: 1 }}
            sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.modal + 1 }}
            open={openLoader}
            onClick={handleClose}
          >
            <CircularProgress color="inherit" />
          </Backdrop>
        </div>
      </Box>
    </Modal>
  );
};

export default AcceptModal;
