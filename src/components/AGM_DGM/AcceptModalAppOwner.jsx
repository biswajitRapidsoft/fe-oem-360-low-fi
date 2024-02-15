import React from "react";
import { useState, useEffect } from "react";

import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import { TextField, Grid, Paper } from "@mui/material";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import { styled } from "@mui/material/styles";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import TrailModal from "./TrailModal";
import config from "../../config/config";
import axios from "axios";

// import TextField from '@mui/material/TextField';

import Autocomplete from "@mui/material/Autocomplete";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
// import BasicTimeline from "./BasicTimeline";

import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AcceptModalAppOwnerAction } from "../../actions/AcceptModalAppOwnerAction";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
//loader
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

const AcceptModalAppOwner = ({
  open,
  onClose,
  selectedData,
  fetchApprovedListAppOwner,
  fetchDataAppOwner,
}) => {
  const [age, setAge] = React.useState("");
  const [rowData, setRowData] = useState("");
  const [tableData, setTableData] = useState("");
  // const [comments, setComments] = useState("");
  const [developmentStartDate, setDevelopmentStartDate] = useState(null);
  const [developmentEndDate, setDevelopmentEndDate] = useState(null);
  const [testCompletionDate, setTestCompletionDate] = useState(null);
  const [deploymentDate, setDeploymentDate] = useState(null);
  const [impactedDepartment, setimpactedDepartment] = useState([]);
  const [globalSupportNumber, setglobalSupportNumber] = useState("");

  const [recommendRefId, setrecommendRefId] = useState(null);

  const [description, setdescription] = useState("");
  const [selectedOptions, setSelectedOptions] = useState([]);

  const [departmentOptions, setDepartmentOptions] = useState([]);
  const [departmentNames, setDepartmentNames] = useState([]);

  const datas = sessionStorage.getItem("data");
  const data = JSON.parse(datas);
  const token = data?.token;
  const createdById = data?.id;
  const userType = data?.userType;
  const companyId = data?.company.id;

  //loader
  const [openLoader, setOpenLoader] = React.useState(false);
  const [buttonDisabled, setButtonDisabled] = useState(false);

  const handleClose = () => {
    setOpenLoader(false);
  };

  const fetchDepartment = async () => {
    // try {
    //   const departmentUrl =
    //     config.baseUrl +
    //     config.apiEndPoints.getAllDepartment +
    //     `?companyId=${companyId}`;
    //   const response = await axios.get(departmentUrl, {
    //     headers: {
    //       Authorization: `Bearer ${token}`,
    //     },
    //   });
    //   if (response.status === 200) {
    //     setDepartmentOptions(response.data.data);

    //     setDepartmentNames(response.data.data.map((item) => item.name));
    //   }
    // } catch (error) {
    //   console.log(error);
    // }

    try {
      const payload = {
        companyId: companyId,
      };

      const response = await AcceptModalAppOwnerAction.Department(payload);
      if (response.status === 200) {
        setDepartmentOptions(response.data.data);

        setDepartmentNames(response?.data?.data.map((item) => item.name));
      }
    } catch (error) {
      console.log(error);
    }
  };

  const submitApproval = async () => {
    setOpenLoader(true);
    // const submitUrl = config.baseUrl + config.apiEndPoints.acceptByAppOwner;

    // const payload = {
    //   createdBy: {
    //     id: createdById,
    //   },
    //   developmentStartDate: developmentStartDate?developmentStartDate:null,
    //   developementEndDate: developmentEndDate?developmentEndDate:null,
    //   testCompletionDate: testCompletionDate?testCompletionDate:null,
    //   deploymentDate: deploymentDate?deploymentDate:null,
    //   impactedDepartment: impactedDepartment?.join(", "),
    //   globalSupportNumber: globalSupportNumber?globalSupportNumber:"",
    //   recommendRefId: rowData.ReferenceId,
    //   description: "",
    // };
    // axios
    //   .post(submitUrl, payload, {
    //     headers: {
    //       Authorization: `Bearer ${token}`,
    //     },
    //   })
    //   .then((response) => {
    //     console.log(response);
    //   })
    //   .catch((error) => {
    //     console.log(error);
    //   });

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
        description: "",
      };
      const response = await AcceptModalAppOwnerAction.SubmitApproval(payload);

      if (response.data.responseCode === 201) {
        setOpenLoader(false);
        onClose();
        toast(response.data.message);
        fetchApprovedListAppOwner();
        fetchDataAppOwner();
        setDevelopmentStartDate(null);
        setDevelopmentEndDate(null);
        setTestCompletionDate(null);
        setDeploymentDate(null);
        setimpactedDepartment([]);
        setglobalSupportNumber("");
        setrecommendRefId("");
        setdescription("");
        setDepartmentNames([]);
        onClose();
      } else {
        alert(response.data.message);
        setOpenLoader(false);
      }
    } catch (error) {
      setOpenLoader(false);
      console.log(error);
    }
  };

  const formatDate2 = (dateString) => {
    if (!dateString) {
      return ""; // Handle cases where dateString is not provided
    }

    const date = new Date(dateString);
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
      setRowData(selectedData.row);
      setTableData(selectedData.tableData);
      fetchDepartment();
    }
  }, [selectedData]);

  // useEffect(() => {
  //   fetchDepartment();
  // }, []);

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 780,
          height: 475,
          bgcolor: "#EBF9FD",

          boxShadow: 24,
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
              {formatDate2(tableData?.recommendDate)}
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

        {/* 
{userRole === "APPLICATION_OWNER" &&} */}

        <Grid container spacing={2} sx={{ mt: 2 }}>
          {/* <Grid item xs={6}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DemoContainer components={["DatePicker"]}>
                <DatePicker
                  label="Development Start Date"
                  value={developmentStartDate}
                  onChange={(date) => setDevelopmentStartDate(date)}
                  sx={{ width: "30vw", backgroundColor: "" }}
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

          {/* <Grid item xs={6}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DemoContainer components={["DatePicker"]}>
                <DatePicker
                  label="Development End Date"
                  value={developmentEndDate}
                  onChange={(date) => setDevelopmentEndDate(date)}
                  sx={{ width: "30vw" }}
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

          {/* <Grid item xs={6}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DemoContainer components={["DatePicker"]}>
                <DatePicker
                  label="Test Completion Date"
                  value={testCompletionDate}
                  onChange={(date) => setTestCompletionDate(date)}
                  sx={{ width: "30vw" }}
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
                  label="Test Completion Date"
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

          {/* <Grid item xs={6}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DemoContainer components={["DatePicker"]}>
                <DatePicker
                  label="Deployment Date"
                  value={deploymentDate}
                  onChange={(date) => setDeploymentDate(date)}
                  sx={{ width: "30vw" }}
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
          {/* <Grid item xs={6}>
            <Box>
              <Autocomplete
                sx={{ width: "21vw" }}
                multiple
                id="multiple-checkboxes"
                options={Array.isArray(departmentNames) ? departmentNames : []}
                disableCloseOnSelect
                getOptionLabel={(option) => option}
                value={impactedDepartment}
                onChange={(_, newValue) => setimpactedDepartment(newValue)}
                renderOption={(props, option, { selected }) => (
                  <li {...props}>
                    {option}
                    {selected ? checkedIcon : icon}
                  </li>
                )}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Select Options"
                    variant="outlined"
                  />
                )}
              />
            </Box>
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
                options={Array.isArray(departmentNames) ? departmentNames : []}
                disableCloseOnSelect
                getOptionLabel={(option) => option}
                value={impactedDepartment}
                onChange={(_, newValue) => setimpactedDepartment(newValue)}
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

          {/* <Grid item xs={6}>
            <TextField
              sx={{ width: "21vw" }}
              id="outlined-basic"
              label="Global support reference number"
              variant="outlined"
              value={globalSupportNumber}
              onChange={(e) => setglobalSupportNumber(e.target.value)}
            ></TextField>
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
              <TextField
                sx={{
                  "& fieldset": {
                    border: "none",
                    width: "20vw",
                    backgroundColor: "",
                  },
                }}
                id="outlined-basic"
                label="Global support reference number"
                variant="outlined"
                value={globalSupportNumber}
                onChange={(e) => setglobalSupportNumber(e.target.value)}
              ></TextField>
            </Box>
          </Grid>

          <Grid item xs={12} sx={{ backgroundColor: "" }}>
            <TrailModal tableData={tableData} />
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <Button
                variant="contained"
                // sx={{ backgroundColor: "red" }}
                sx={{
                  backgroundColor: "#281C61",
                  width: "11vw",
                  height: "60px",
                  alignSelf: "center",
                  borderRadius: "12px",
                }}
                onClick={submitApproval}
              >
                SEND FOR APPROVAL
              </Button>
            </Box>
          </Grid>
        </Grid>

        {/* <Box sx={{ display: "flex", flexDirection: "column", gap: 7 }}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 5 }}>
            <Typography sx={{ marginTop: 3 }}>Reason For Rejection</Typography>
            <TextField
              id="standard-basic"
              label=""
              variant="standard"
            ></TextField>
          </Box>

          <TextField
            id="standard-basic"
            label="Additional Comments"
            variant="standard"
          ></TextField>
        </Box>

     

        <Box sx={{ display: "flex", justifyContent: "center", p: 2, mt: 5 }}>
          <Button
            variant="contained"
            sx={{
              backgroundColor: "#281C61",
              borderRadius: "12px",
              width: "200px",
              height: "52px",
              padding: "8px 16px",
            }}
          >
            Submit
          </Button>
        </Box> */}

        <div>
          {/* <Button onClick={handleOpen}>Show backdrop</Button> */}
          <Backdrop
            // style={{ zIndex: 1 }}
            sx={{
              color: "#fff",
              zIndex: 1500,

              // zIndex: (theme) => theme.zIndex.modal + 99
            }}
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

export default AcceptModalAppOwner;
