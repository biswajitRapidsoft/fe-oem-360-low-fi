import {
  Box,
  Button,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import Checkbox from "@mui/material/Checkbox";
import ListItemText from "@mui/material/ListItemText";
import AttachmentIcon from "@mui/icons-material/Attachment";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import RecommendationFormAction from "../../actions/recommendationFormAction";
import CircularProgress from "@mui/material/CircularProgress";

import { toast } from "react-toastify";
import AppLoader from "../AppLoader/AppLoader";

const RecommendationForm = (props) => {
  const { fetchRecommendationAgmAndOem } = props;
  const loginData = JSON.parse(sessionStorage.getItem("loginData"));
  // console.log(" logged user data", loginData);

  const loggedUserCompany = loginData?.company || {};
  const loggedUserId = loginData?.id || null;

  const fileInputRef = useRef(null);
  const [fileName, setFileName] = useState("");
  const [selectedDepartmentName, setSelectedDepartmentName] = useState([]);
  const [selectedTypeName, setSelectedTypeName] = useState([]);
  const [selectedComponentName, setSelectedComponentName] = useState([]);
  const [selectedPriorityName, setSelectedPriorityName] = useState([]);
  const [types, setTypes] = useState([]);
  const [priorities, setPriorities] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [components, setcomponents] = useState([]);
  const [isButtonLoading, setIsButtonLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const initialFormData = {
    componentId: null,
    createdBy: loggedUserId,
    departmentId: null,
    description: "",
    expectedImpact: "",
    file: null,
    priorityId: null,
    recommendDate: null,
    typeId: null,
    urlLink: "",
  };

  const [formData, setFormData] = useState(initialFormData);

  const fetchPageData = async () => {
    const params = {
      companyId: loggedUserCompany?.id || null,
    };
    try {
      const response = await RecommendationFormAction.pageData(params);

      if (response && response.status === 200) {
        // console.log("DATAA:  ", response.data.data);
        const pageData = response.data.data;

        setTypes(pageData?.recommendationTypeList);
        setPriorities(pageData?.priorityList);
        setDepartments(pageData?.departmentList);
        setcomponents(pageData?.componentList);
      } else {
        if (response && response.status && response.status !== 200) {
          console.error("RESPONSE MSG:  ", response.data.message);
          return response.data;
        } else {
          console.error("AXIOS MSG:  ", response.message);
          return response.message;
        }
      }
    } catch (error) {
      return error;
    }
  };

  useEffect(() => {
    fetchPageData();
  }, []);

  // console.log("form dataaa:    ", formData);

  const handleChange2 = (fieldName) => (event) => {
    const {
      target: { value },
    } = event;

    switch (fieldName) {
      case "department":
        const newDepartmentValue =
          typeof value === "string" ? value.split(",") : value;
        // console.log('newDepartmentValue', newDepartmentValue)
        setSelectedDepartmentName(newDepartmentValue);
        setFormData((prevFormData) => ({
          ...prevFormData,
          departmentId:
            newDepartmentValue.length > 0
              ? departments.find((item) => item.name === newDepartmentValue[0])
                  ?.id || null
              : null,
        }));
        break;
      case "type":
        const newTypeValue =
          typeof value === "string" ? value.split(",") : value;
        setSelectedTypeName(newTypeValue);
        setFormData((prevFormData) => ({
          ...prevFormData,
          typeId:
            newTypeValue.length > 0
              ? types.find((item) => item.name === newTypeValue[0])?.id || null
              : null,
        }));
        break;
      case "component":
        const newComponentValue =
          typeof value === "string" ? value.split(",") : value;
        setSelectedComponentName(newComponentValue);
        // Assuming components have a unique identifier like "id"
        setFormData((prevFormData) => ({
          ...prevFormData,
          componentId:
            newComponentValue.length > 0
              ? components.find((item) => item.name === newComponentValue[0])
                  ?.id || null
              : null,
        }));
        break;

      case "priority":
        const newPriorityValue =
          typeof value === "string" ? value.split(",") : value;
        setSelectedPriorityName(newPriorityValue);
        setFormData((prevFormData) => ({
          ...prevFormData,
          priorityId:
            newPriorityValue.length > 0
              ? priorities.find((item) => item.name === newPriorityValue[0])
                  ?.id || null
              : null,
        }));
        break;
      case "description":
        setFormData((prevFormData) => ({
          ...prevFormData,
          description: value,
        }));
        break;
      case "expectedImpact":
        setFormData((prevFormData) => ({
          ...prevFormData,
          expectedImpact: value,
        }));
        break;
      case "urlLink":
        setFormData((prevFormData) => ({
          ...prevFormData,
          urlLink: value,
        }));
        break;
      default:
        break;
    }
  };

  const handleDateChange = (date) => {
    if (date) {
      const dateObject = new Date(date); // Explicitly convert to a Date object
      const year = dateObject.getFullYear();
      const month = String(dateObject.getMonth() + 1).padStart(2, "0");
      const day = String(dateObject.getDate()).padStart(2, "0");
      const formattedDate = `${year}-${month}-${day}`;
      // console.log(formattedDate);
      return formattedDate;
    }
  };

  const handleFileInputChange = (event) => {
    let file = event.target.files[0];
    if (file) {
      setFileName(file.name);
      setFormData((prevFormData) => ({
        ...prevFormData,
        file: file,
      }));
    } else {
      setFileName("");
      setFormData((prevFormData) => ({
        ...prevFormData,
        file: null,
      }));
    }

    const fileInput = document.getElementById("fileInputRecommendation");
    if (fileInput) {
      fileInput.value = ""; // Clear the selected file
    }
  };

  const openFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleAddRecommendation = async () => {
    const trimmedDescription = formData.description
      ? formData.description.trim()
      : "";
    const trimmedExpectedImpact = formData.expectedImpact
      ? formData.expectedImpact.trim()
      : "";
    const trimmedUrlLink = formData.urlLink ? formData.urlLink.trim() : "";

    if (
      !trimmedDescription ||
      !formData.typeId ||
      !formData.priorityId ||
      !formData.priorityId ||
      !formData.recommendDate ||
      !formData.departmentId ||
      !formData.componentId
    ) {
      toast.warn("Please fill required fields !", {
        toastId: "rcmdFrom-warn01",
      });
      return;
    }

    if (!trimmedDescription) {
      toast.warn("Description is required !", {
        toastId: "rcmdFrom-warn02",
      });
      return;
    }

    if (!formData.typeId) {
      toast.warn("Please choose Type !", {
        toastId: "rcmdFrom-warn03",
      });
      return;
    }

    if (!formData.priorityId) {
      toast.warn("Please choose Priority !", {
        toastId: "rcmdFrom-warn04",
      });
      return;
    }

    if (!formData.recommendDate) {
      toast.warn("Recommendaed date is required !", {
        toastId: "rcmdFrom-warn05",
      });
      return;
    }

    if (!formData.departmentId) {
      toast.warn("Department is required !", {
        toastId: "rcmdFrom-warn06",
      });
      return;
    }

    if (!formData.componentId) {
      toast.warn("Component is required !", {
        toastId: "rcmdFrom-warn07",
      });
      return;
    }

    if (formData.expectedImpact && !trimmedExpectedImpact) {
      toast.warn("Expected impact can't be empty if required !", {
        toastId: "rcmdFrom-warn08",
      });
      return;
    }

    if (!formData.file && !trimmedUrlLink) {
      toast.warn("Either Please choose a file or provide a link !", {
        toastId: "rcmdFrom-warn09",
      });
      return;
    }

    if (formData.file) {
      const fileSizeInMB = formData.file.size / (1024 * 1024);
      if (fileSizeInMB > 1) {
        toast.warn("File size shouldn't be larger than 1 MB !", {
          toastId: "rcmdFrom-warn10",
        });
        return;
      }
    }

    // if (!trimmedUrlLink) {
    //   toast.warn("Url is required !", {
    //     toastId: "rcmdFrom-warn11",
    //   });
    //   return;
    // }

    const payload = new FormData();
    payload.append("description", trimmedDescription);
    payload.append("typeId", formData.typeId);
    payload.append("priorityId", formData.priorityId);
    payload.append("recommendDate", formData.recommendDate);
    payload.append("departmentIds", [formData.departmentId]);
    payload.append("createdBy", formData.createdBy);
    payload.append("file", formData.file);
    payload.append("urlLink", trimmedUrlLink);
    payload.append("componentId", formData.componentId);
    payload.append("expectedImpact", trimmedUrlLink);

    // console.log("payload", payload);

    // return
    // debugger

    try {
      // setIsButtonLoading(true);
      setIsLoading(true);
      const response = await RecommendationFormAction.addRecommendation(
        payload
      );

      let toastMessge = "";

      if (response && (response.status === 200 || response.status === 201)) {
        // console.log(" added recommend response", response);
        toastMessge = response?.data?.message;
        const cleanedMessage = JSON.stringify(toastMessge);
        toast.success(JSON.parse(cleanedMessage), {
          toastId: "rcmdForm-success01",
        });
        setFormData(initialFormData);
        setFileName("");
        setSelectedDepartmentName([]);
        setSelectedTypeName([]);
        setSelectedComponentName([]);
        setSelectedPriorityName([]);
        fetchRecommendationAgmAndOem();
      } else {
        if (
          response &&
          response.status &&
          (response.status !== 200 || response.status !== 201)
        ) {
          toastMessge = response?.data?.message;
          const cleanedMessage = JSON.stringify(toastMessge);
          toast.error(JSON.parse(cleanedMessage), {
            toastId: "rcmdForm-err01",
          });
          // console.error("RESPONSE MSG:  ", response.data.message);
          const fileInput = document.getElementById("fileInputRecommendation");
          if (fileInput) {
            fileInput.value = "";
          }
        } else {
          toastMessge = response?.message;
          const cleanedMessage = JSON.stringify(toastMessge);
          toast.error(JSON.parse(cleanedMessage), {
            toastId: "rcmdForm-err02",
          });
          // console.error("AXIOS MSG:  ", response.message);
          const fileInput = document.getElementById("fileInputRecommendation");
          if (fileInput) {
            fileInput.value = "";
          }
        }
      }
    } catch (error) {
      console.error("Something went wrong:  ", error);
    } finally {
      // setIsButtonLoading(false);
      setIsLoading(false);
    }
  };

  return (
    <>
      <AppLoader isLoading={isLoading} />

      <Box
        sx={{
          mt: "10px",
          bgcolor: "#00B1E7",
          borderRadius: "20px",
          paddingX: "40px",
          paddingY: "20px",
          filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.42))",
          // width:'90%'
        }}
      >
        <form>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={12} md={12} lg={12}>
              <Typography sx={{ fontSize: "20px", color: "#ffffff" }}>
                Add recommendation
              </Typography>
            </Grid>

            <Grid item xs={8} sm={8} md={8} lg={8}>
              <Box
                sx={{
                  bgcolor: "#D6F2FB",
                  paddingX: "10px",
                  paddingY: "2px",
                  borderRadius: "10px",
                }}
              >
                <TextField
                  variant="standard"
                  size="small"
                  required
                  fullWidth
                  id="description"
                  name="Description"
                  label="Description"
                  value={formData.description || ""}
                  onChange={handleChange2("description")}
                  InputProps={{
                    // endAdornment: <AccountCircle />,
                    disableUnderline: true,
                  }}
                  inputProps={{
                    maxLength: 150,
                  }}
                  sx={{ height: "3.5em", maxHeight: "3.5em" }}
                />
              </Box>
            </Grid>

            <Grid item xs={2} sm={2} md={2} lg={2}>
              <Box
                sx={{
                  bgcolor: "#D6F2FB",
                  paddingX: "10px",
                  paddingY: "2px",
                  borderRadius: "10px",
                }}
              >
                <FormControl
                  variant="standard"
                  sx={{ width: "100%", height: "3.5em", maxHeight: "3.5em" }}
                  fullWidth
                  required
                  // disableUnderline={true}
                >
                  <InputLabel htmlFor="demo-simple-select-standard-label">
                    Type
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-standard-label"
                    id="demo-simple-select-standard"
                    // value={selectedTypeName}
                    value={selectedTypeName.length > 0 ? selectedTypeName : ""}
                    disableUnderline={true}
                    onChange={handleChange2("type")}
                    renderValue={(selected) => selected.join(" ")}
                    label="Type"
                  >
                    {types.map((dataItem, index) => {
                      let name = dataItem?.name || null;
                      return (
                        <MenuItem
                          key={index}
                          value={name}
                          sx={{
                            height: "40px",
                            fontSize: "12px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            borderBottom:
                              index !== types.length - 1
                                ? "1px solid #ccc"
                                : "none",
                            padding: "8px", // Adjust padding as needed
                          }}
                        >
                          <div
                            style={{ display: "flex", alignItems: "center" }}
                          >
                            <ListItemText
                              primary={
                                <Typography
                                  variant="body2"
                                  sx={{
                                    fontSize: "12px",
                                    color:
                                      selectedTypeName.indexOf(name) > -1
                                        ? "#464646"
                                        : "#7E7E7E",
                                  }}
                                >
                                  {name}
                                </Typography>
                              }
                            />
                          </div>
                        </MenuItem>
                      );
                    })}
                  </Select>
                </FormControl>
              </Box>
            </Grid>

            <Grid item xs={2} sm={2} md={2} lg={2}>
              <Box
                sx={{
                  bgcolor: "#D6F2FB",
                  paddingX: "10px",
                  paddingY: "2px",
                  borderRadius: "10px",
                  // width:'100%'
                }}
              >
                <FormControl
                  variant="standard"
                  sx={{ width: "100%", height: "3.5em", maxHeight: "3.5em" }}
                  fullWidth
                  required
                  // disableUnderline={true}
                >
                  <InputLabel htmlFor="demo-simple-select-standard-label">
                    Priority
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-standard-label"
                    id="demo-simple-select-standard"
                    disableUnderline={true}
                    value={
                      selectedPriorityName.length > 0
                        ? selectedPriorityName
                        : ""
                    }
                    onChange={handleChange2("priority")}
                    label="Priority"
                    renderValue={(selected) => selected.join(" ")}
                    MenuProps={{
                      PaperProps: {
                        style: {
                          maxHeight: 48 * 4.5 + 8,
                          width: 250,
                          marginTop: "15px",
                        },
                        variant: "standard",
                      },
                    }}
                  >
                    {Array.isArray(priorities) &&
                      priorities.map((dataItem, index) => {
                        let name = dataItem?.name || null;
                        return (
                          <MenuItem
                            key={index}
                            value={name}
                            sx={{
                              height: "40px",
                              fontSize: "12px",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-between",
                              borderBottom:
                                index !== priorities.length - 1
                                  ? "1px solid #ccc"
                                  : "none",
                              padding: "8px",
                            }}
                          >
                            <div
                              style={{ display: "flex", alignItems: "center" }}
                            >
                              <ListItemText
                                primary={
                                  <Typography
                                    variant="body2"
                                    sx={{
                                      fontSize: "12px",
                                      color:
                                        selectedPriorityName.indexOf(name) > -1
                                          ? "#464646"
                                          : "#7E7E7E",
                                    }}
                                  >
                                    {name}
                                  </Typography>
                                }
                              />
                            </div>
                          </MenuItem>
                        );
                      })}
                  </Select>
                </FormControl>
              </Box>
            </Grid>

            <Grid item xs={3} sm={3} md={3} lg={3}>
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
                    label="Recommended end date"
                    format="YYYY-MM-DD"
                    value={
                      formData.recommendDate
                        ? dayjs(formData.recommendDate)
                        : null
                    }
                    slots={{
                      openPickerIcon: () => (
                        <CalendarMonthIcon sx={{ color: "#281C61" }} />
                      ),
                    }}
                    required
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
                    onChange={(date) =>
                      setFormData({
                        ...formData,
                        recommendDate: handleDateChange(date),
                      })
                    }

                    // onChange={(date) => handleDateChange(date)}
                  />
                </LocalizationProvider>
              </Box>
            </Grid>

            <Grid item xs={2.5} sm={2.5} md={2.5} lg={2.5}>
              <Box
                sx={{
                  bgcolor: "#D6F2FB",
                  paddingX: "10px",
                  paddingY: "2px",
                  borderRadius: "10px",
                  // width:'100%'
                }}
              >
                <FormControl
                  variant="standard"
                  sx={{ width: "100%", height: "3.5em", maxHeight: "3.5em" }}
                  fullWidth
                  required
                  // disableUnderline={true}
                >
                  <InputLabel htmlFor="demo-simple-select-standard-label">
                    Department Name
                  </InputLabel>
                  <Select
                    // multiple
                    labelId="demo-simple-select-standard-label"
                    id="demo-simple-select-standard"
                    disableUnderline={true}
                    value={
                      selectedDepartmentName.length > 0
                        ? selectedDepartmentName
                        : ""
                    } // comment it for MULTIPLE
                    // value={selectedDepartmentName} // release it for MULTIPLE
                    onChange={handleChange2("department")}
                    label="Department Name"
                    renderValue={(selected) => selected.join(", ")}
                    MenuProps={{
                      PaperProps: {
                        style: {
                          maxHeight: 48 * 4.5 + 8,
                          width: 250,
                          // borderRadius: "12px",
                        },
                        variant: "standard",
                      },
                    }}
                  >
                    {departments.map((dataItem, index) => {
                      let name = dataItem?.name || null;
                      return (
                        <MenuItem
                          key={index}
                          value={name}
                          sx={{
                            height: "40px",
                            fontSize: "12px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            borderBottom:
                              index !== departments.length - 1
                                ? "1px solid #ccc"
                                : "none",
                            padding: "8px",
                          }}
                        >
                          <div
                            style={{ display: "flex", alignItems: "center" }}
                          >
                            <Checkbox
                              checked={
                                selectedDepartmentName.indexOf(name) > -1
                              }
                              style={{
                                color:
                                  selectedDepartmentName.indexOf(name) > -1
                                    ? "#3f51b5"
                                    : "#ccc",
                              }}
                            />
                            <ListItemText
                              primary={
                                <Typography
                                  variant="body2"
                                  sx={{
                                    fontSize: "12px",
                                    color:
                                      selectedDepartmentName.indexOf(name) > -1
                                        ? "#464646"
                                        : "#7E7E7E",
                                  }}
                                >
                                  {name}
                                </Typography>
                              }
                            />
                          </div>
                        </MenuItem>
                      );
                    })}
                  </Select>
                </FormControl>
              </Box>
            </Grid>

            <Grid item xs={2.5} sm={2.5} md={2.5} lg={2.5}>
              <Box
                sx={{
                  bgcolor: "#D6F2FB",
                  paddingX: "10px",
                  paddingY: "2px",
                  borderRadius: "10px",
                  // width:'100%'
                }}
              >
                <FormControl
                  variant="standard"
                  sx={{ width: "100%", height: "3.5em", maxHeight: "3.5em" }}
                  fullWidth
                  required
                  // disableUnderline={true}
                >
                  <InputLabel htmlFor="demo-simple-select-standard-label">
                    Component Name
                  </InputLabel>
                  <Select
                    // multiple
                    labelId="demo-simple-select-standard-label"
                    id="demo-simple-select-standard"
                    disableUnderline={true}
                    value={
                      selectedComponentName.length > 0
                        ? selectedComponentName
                        : ""
                    } // comment it for MULTIPLE
                    // value={selectedDepartmentName} // release it for MULTIPLE
                    onChange={handleChange2("component")}
                    label="Component Name"
                    renderValue={(selected) => selected.join(", ")}
                    MenuProps={{
                      PaperProps: {
                        style: {
                          maxHeight: 48 * 4.5 + 8,
                          width: 250,
                          // borderRadius: "12px",
                        },
                        variant: "standard",
                      },
                    }}
                  >
                    {components.map((dataItem, index) => {
                      let name = dataItem?.name || null;
                      return (
                        <MenuItem
                          key={index}
                          value={name}
                          sx={{
                            height: "40px",
                            fontSize: "12px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            borderBottom:
                              index !== components.length - 1
                                ? "1px solid #ccc"
                                : "none",
                            padding: "8px",
                          }}
                        >
                          <div
                            style={{ display: "flex", alignItems: "center" }}
                          >
                            <Checkbox
                              checked={selectedComponentName.indexOf(name) > -1}
                              style={{
                                color:
                                  selectedComponentName.indexOf(name) > -1
                                    ? "#3f51b5"
                                    : "#ccc",
                              }}
                            />
                            <ListItemText
                              primary={
                                <Typography
                                  variant="body2"
                                  sx={{
                                    fontSize: "12px",
                                    color:
                                      selectedComponentName.indexOf(name) > -1
                                        ? "#464646"
                                        : "#7E7E7E",
                                  }}
                                >
                                  {name}
                                </Typography>
                              }
                            />
                          </div>
                        </MenuItem>
                      );
                    })}
                  </Select>
                </FormControl>
              </Box>
            </Grid>

            <Grid item xs={4} sm={4} md={4} lg={4}>
              <Box
                sx={{
                  bgcolor: "#D6F2FB",
                  paddingX: "10px",
                  paddingY: "2px",
                  borderRadius: "10px",
                }}
              >
                <TextField
                  variant="standard" // <== changed this
                  // variant='outlined'
                  size="small"
                  // required
                  fullWidth
                  id="expectedImpact"
                  name="expectedImpact"
                  label="Expected Impact"
                  value={formData.expectedImpact || ""}
                  onChange={handleChange2("expectedImpact")}
                  InputProps={{
                    // endAdornment: <AccountCircle />, // <== adjusted this
                    disableUnderline: true, // <== added this
                  }}
                  sx={{ height: "3.5em", maxHeight: "3.5em" }}
                />
              </Box>
            </Grid>
            <Grid item xs={4.75} sm={4.75} md={4.75} lg={4.75}>
              <Box
                sx={{
                  bgcolor: "#D6F2FB",
                  paddingX: "10px",
                  paddingY: "2px",
                  borderRadius: "10px",
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  height: "3.5em",
                }}
              >
                <InputLabel
                  htmlFor="fileInputRecommendation"
                  sx={{ display: "flex", flexGrow: 1 }}
                >
                  <Typography variant="body1">
                    {fileName || "Attach Document"}
                  </Typography>
                </InputLabel>
                <input
                  type="file"
                  id="fileInputRecommendation"
                  style={{ display: "none" }}
                  onChange={handleFileInputChange}
                  ref={fileInputRef}
                  // disabled={formData.urlLink}
                />
                <IconButton onClick={openFileInput}>
                  <AttachmentIcon
                    sx={{
                      transform: "rotate(-100deg)",
                      fontSize: "29px",
                      fontWeight: 400,
                      color: "#858585",
                    }}
                  />
                </IconButton>
              </Box>
            </Grid>
            <Grid item xs={0.5} sm={0.5} md={0.5} lg={0.5}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  width: "100%",
                  height: "100%",
                }}
              >
                <Typography>or</Typography>
              </Box>
            </Grid>
            <Grid item xs={4.75} sm={4.75} md={4.75} lg={4.75}>
              <Box
                sx={{
                  bgcolor: "#D6F2FB",
                  paddingX: "10px",
                  paddingY: "2px",
                  borderRadius: "10px",
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  height: "3.5em",
                }}
              >
                <TextField
                  variant="standard" // <== changed this
                  // variant='outlined'
                  size="small"
                  // required
                  type={"url"}
                  fullWidth
                  id="urlLink"
                  name="urlLink"
                  label="Copy link"
                  value={formData.urlLink || ""}
                  onChange={handleChange2("urlLink")}
                  InputProps={{
                    // endAdornment: <AccountCircle />, // <== adjusted this
                    disableUnderline: true, // <== added this
                  }}
                  sx={{ height: "3.5em", maxHeight: "3.5em" }}
                />
              </Box>
            </Grid>
            <Grid item xs={2} sm={2} md={2} lg={2}>
              <Button
                variant="contained"
                disabled={isButtonLoading}
                onClick={handleAddRecommendation}
                sx={{
                  overflow: "hidden",
                  bgcolor: "#281C61",
                  borderRadius: "12px",
                  paddingX: "32px",
                  paddingY: "14.5px",
                  width: "100%",
                  minHeight: "58.75px",
                  maxHeight: "58.75px",
                  fontSize: "17px",
                  fontWeight: 600,
                  "&:hover": { bgcolor: "#322475", overflow: "hidden" },

                  "&:disabled": {
                    background: "#E0E0E0",
                    // color: "#B5B5B5"
                  },
                }}
              >
                {isButtonLoading ? (
                  <CircularProgress size="2.3em" sx={{ color: "#818181" }} />
                ) : (
                  "RECOMMEND"
                )}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Box>
    </>
  );
};

export default RecommendationForm;
