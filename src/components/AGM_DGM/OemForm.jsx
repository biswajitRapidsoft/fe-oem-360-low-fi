import React from "react";
import { useState, useEffect, useRef } from "react";
import { Box, Typography, Grid, Paper, Button } from "@mui/material";
import { styled } from "@mui/material/styles";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import config from "../../config/config";
import axios from "axios";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import AttachFileIcon from "@mui/icons-material/AttachFile";
// import "../../css/OemForm.css";
import { OemFormAction } from "../../actions/OemFormAction";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Opacity } from "@mui/icons-material";
import InputLabel from "@mui/material/InputLabel";
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

const OemForm = ({ fetchDataAgm }) => {
  const [description, setDescription] = useState("");

  const [type, setType] = useState([]);
  const [selectedType, setSelectedType] = useState({ id: null, name: "" });

  const [priority, setPriority] = useState([]);
  const [selectedPriority, setSelectedPriority] = useState({
    id: null,
    name: "",
  });

  const [componentName, setComponentName] = useState([]);
  const [selectedComponentName, setSelectedComponentName] = useState({
    id: null,
    name: "",
  });

  const [recommendEndDate, setRecommendEndDate] = useState(null);

  const [department, setDepartment] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState([]);

  const [expectedImpact, setExpectedImpact] = useState("");

  //token
  const datas = sessionStorage.getItem("data");
  const data = JSON.parse(datas);
  const token = data.token;
  const userType = data.userType;
  const id = data.id;

  const allData = async () => {
    try {
      // const allDataUrl = `${config.baseUrl}${config.apiEndPoints.pageData}?companyId=${id}`;

      // const response = await axios.get(allDataUrl, {
      //   headers: {
      //     Authorization: `Bearer ${token}`,
      //   },
      // });
      const payload = {
        companyId: id,
      };

      const response = await OemFormAction.allData(payload);

      if (response.status === 200) {
        setType(response.data.data.recommendationTypeList.map((item) => item));
        setPriority(response.data.data.priorityList.map((item) => item));
        setComponentName(response.data.data.componentList.map((item) => item));
        setDepartment(response.data.data.departmentList.map((item) => item));
      }
    } catch (error) {
      console.log(error);
    }
  };

  //handle type change
  const handleTypeChange = (event, newValue) => {
    if (!newValue) {
      setSelectedType({ id: null, name: "" });
    } else {
      setSelectedType(newValue);
    }
  };

  //handlePriorityChange
  const handlePriorityChange = (event, newValue) => {
    if (!newValue) {
      setSelectedPriority({ id: null, name: "" });
    } else {
      setSelectedPriority(newValue);
    }
  };

  //handle Component change
  const handleComponentChange = (event, newValue) => {
    if (!newValue) {
      setSelectedComponentName({ id: null, name: "" });
    } else {
      setSelectedComponentName(newValue);
    }
  };

  const fileInputRef = useRef(null);
  const [fileName, setFileName] = useState("");

  const handleAttachIconClick = () => {
    fileInputRef.current.click();
  };

  const handleFileInputChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setFileName(file.name);
    } else {
      setFileName("");
    }
  };

  const [copyLink, setCopyLink] = useState("");

  //loader
  const [open, setOpen] = React.useState(false);
  const [buttonDisabled, setButtonDisabled] = useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  const submit = async () => {
    // debugger;
    setOpen(true);

    try {
      setButtonDisabled(true);
      // const submitUrl = config.baseUrl + config.apiEndPoints.addRecommendation;
      const departmentIds = selectedDepartment.map((dept) => dept.id);

      const formattedRecommendDate = recommendEndDate
        ? recommendEndDate.format("YYYY-MM-DD")
        : "";

      const formData = new FormData();
      formData.append("description", description);
      formData.append("typeId", selectedType.id);
      formData.append("priorityId", selectedPriority.id);
      formData.append("recommendDate", formattedRecommendDate);
      formData.append("departmentIds", departmentIds.join(","));
      formData.append("componentId", selectedComponentName.id);
      formData.append("expectedImpact", expectedImpact);
      formData.append("createdBy", 1);
      const fileInput = fileInputRef.current;
      if (fileInput && fileInput.files && fileInput.files[0]) {
        formData.append("file", fileInput.files[0]);
      }
      formData.append("urlLink", copyLink);

      // const response = await axios.post(submitUrl, formData, {
      //   headers: {
      //     Authorization: `Bearer ${token}`,
      //     'Content-Type': 'multipart/form-data',
      //   },
      // });

      const response = await OemFormAction.submit(formData);
      // debugger;
      if (response.data.responseCode === 201) {
        setOpen(false);

        toast(response.data.message);
        fetchDataAgm();
        setDescription("");
        setSelectedType({ id: null, name: "" });
        setSelectedPriority({ id: null, name: "" });
        setSelectedComponentName({ id: null, name: "" });
        setRecommendEndDate(null);
        setSelectedDepartment([]);
        setExpectedImpact("");
        setFileName("");
        setCopyLink("");

        allData();
      } else {
        alert(response.data.message);
        setOpen(false);
      }
    } catch (error) {
      setOpen(false);
      console.log(error);
    } finally {
      setButtonDisabled(false);
    }
  };

  useEffect(() => {
    allData();
  }, []);

  return (
    <>
      <Box
        sx={{
          display: "flex",
          height: 350,
          width: "90vw",
          backgroundColor: "#00B1E7",
          borderRadius: 5,
          flexDirection: "column",
          alignItems: "flexStart",
          // flexGrow: 1,
        }}
      >
        {/*       
        <Grid container>
          <Grid item xs={12}>
            <Box sx={{ float: "left" }}>
              <Typography
                sx={{
                  color: "white",
                  marginLeft: 3,
                  marginTop: 2,
                  fontSize: "20px",
                }}
              >
                Add recommendation
              </Typography>
            </Box>
          </Grid>

          <Box sx={{ display: "flex", flexDirection: "row", gap: 10 }}>
            <Grid item>
              <TextField
                id="outlined-basic"
                label="Description"
                variant="outlined"
                required
                sx={{
                  backgroundColor: " #D6F2FB",
                  width: "45vw",
                  marginLeft: 3,
                  borderRadius: 2,
                }}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              ></TextField>
            </Grid>
            <Grid item>
              <Autocomplete
                disablePortal
                id="combo-box-demo"
                options={Array.isArray(type) ? type : []}
                disableCloseOnSelect={false}
                getOptionLabel={(option) =>
                  option !== null ? `${option.name}` : ""
                }
            

                value={selectedType}
                onChange={handleTypeChange}
                sx={{
                  width: "15vw",
                  backgroundColor: " #D6F2FB",
                  marginLeft: 10,
                  borderRadius: 2,
                }}
                renderInput={(params) => <TextField {...params} label="Type" />}
              />
            </Grid>
            <Grid item>
              <Autocomplete
                disablePortal
                id="combo-box-demo"
                options={Array.isArray(priority) ? priority : []}
                disableCloseOnSelect={false}
                getOptionLabel={(option) =>
                  option !== null ? `${option.name}` : ""
                }
                value={selectedPriority}
                onChange={handlePriorityChange}
                sx={{
                  width: "15vw",
                  backgroundColor: " #D6F2FB",
                  borderRadius: 2,
                }}
                renderInput={(params) => (
                  <TextField {...params} label="Priority" />
                )}
              />
            </Grid>
          </Box>
          <Box sx={{ display: "flex", flexDirection: "row", gap: 1 }}>
            <Grid item xs={3} sx={{ marginLeft: 3, marginTop: 0 }}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DemoContainer components={["DatePicker"]}>
                  <DatePicker
                    label="Recommend End Date"
                    required
                    sx={{
                      width: "17vw",
                      backgroundColor: " #D6F2FB",
                      borderRadius: 2,
                    }}
                    value={recommendEndDate}
                    onChange={(date) => setRecommendEndDate(date)}
                  />
                </DemoContainer>
              </LocalizationProvider>
            </Grid>
            <Grid item xs={3}>
            

              <Autocomplete
                sx={{
                  width: "17vw",

                  backgroundColor: " #D6F2FB",
                  borderRadius: 2,
                }}
                multiple
                id="multiple-checkboxes"
                options={Array.isArray(department) ? department : []}
                disableCloseOnSelect
                getOptionLabel={(option) => option.name}
                value={selectedDepartment}
                onChange={(_, newValue) => setSelectedDepartment(newValue)}
                renderOption={(props, option, { selected }) => (
                  <li {...props}>
                    {option.name}
                    {selected ? checkedIcon : icon}
                  </li>
                )}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Department"
                    variant="outlined"
                  />
                )}
              />
            </Grid>
            <Grid item xs={3}>
              <Autocomplete
                disablePortal
                id="combo-box-demo"
                options={Array.isArray(componentName) ? componentName : []}
                disableCloseOnSelect={false}
                getOptionLabel={(option) =>
                  option !== null ? `${option.name}` : ""
                }
                value={selectedComponentName}
                onChange={handleComponentChange}
                sx={{
                  width: "17vw",
                  backgroundColor: " #D6F2FB",
                  borderRadius: 2,
                }}
                renderInput={(params) => (
                  <TextField {...params} label="Component Name" />
                )}
              />
            </Grid>
            <Grid item xs={3}>
              <TextField
                id="outlined-basic"
                label="Expected Impact"
                variant="outlined"
                required
                sx={{
                  backgroundColor: " #D6F2FB",
                  width: "27vw",
                  marginLeft: 3,
                  borderRadius: 2,
                }}
                value={expectedImpact}
                onChange={(e) => setExpectedImpact(e.target.value)}
              ></TextField>
            </Grid>
          </Box>

          <Box sx={{ display: "flex", flexDirection: "row" }}>
          

            <Grid item xs={4} sx={{}}>
              

              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  backgroundColor: "#D6F2FB",
                  width: "25vw",
                  height: "40px",
                  marginLeft: 3,
                  borderRadius: 2,
                  padding: 1,
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
                  id="fileInput"
                  ref={fileInputRef}
                  type="file"
                  style={{
                    display: "none",
                  }}
                  onChange={handleFileInputChange}
                />
                <AttachFileIcon
                  onClick={handleAttachIconClick}
                  style={{ cursor: "pointer", transform: "rotate(-50deg)" }}
                />
              </Box>
            </Grid>

            <Grid item xs={4} sx={{ marginLeft: 3 }}>
              <TextField
                id="outlined-basic"
                type="text"
                label="Copy link"
                variant="outlined"
                sx={{
                  backgroundColor: " #D6F2FB",
                  width: "30vw",
                  borderRadius: 2,
                }}
                value={copyLink}
                onChange={(e) => setCopyLink(e.target.value)}
              ></TextField>
            </Grid>
            <Grid item xs={4}>
              <Button
                variant="contained"
                sx={{
                  width: "12vw",
                  height: "52px",
                  mt: 1,
                  backgroundColor: "#281C61",
                  borderRadius: 2,
                  marginLeft: 20,
                }}
                onClick={submit}
              >
                Recommend
              </Button>
            </Grid>
          </Box>
        </Grid> */}
        <Box sx={{ display: "flex", alignItems: "flex-start" }}>
          <Typography
            sx={{
              padding: 2,
              margin: 2,
              fontSize: "20px",
              fontWeight: 400,
              color: "#FFFF",
            }}
          >
            Add Recommendation
          </Typography>
        </Box>

        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            width: "100%", // Adjust the width as needed
            marginBottom: "1rem",
            backgroundColor: "",
          }}
        >
          <Box>
            <TextField
              id="outlined-basic"
              label="Description"
              variant="outlined"
              required
              sx={{
                backgroundColor: " #D6F2FB",
                width: "50vw",
                marginLeft: "1rem",
                borderRadius: 2,
                flex: "1", // Take remaining space
                marginRight: "1rem", // Add margin between fields
              }}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            ></TextField>
          </Box>

          <Box>
            <Autocomplete
              disablePortal
              id="combo-box-demo"
              options={Array.isArray(type) ? type : []}
              disableCloseOnSelect={false}
              getOptionLabel={(option) =>
                option !== null ? `${option.name}` : ""
              }
              value={selectedType}
              onChange={handleTypeChange}
              sx={{
                width: "15vw",
                backgroundColor: " #D6F2FB",
                // marginLeft: 10,
                borderRadius: 2,
                flex: "1", // Take remaining space
                marginRight: "1rem", // Add margin between fields
              }}
              renderInput={(params) => <TextField {...params} label="Type" />}
            />
          </Box>
          <Box>
            <Autocomplete
              disablePortal
              id="combo-box-demo"
              options={Array.isArray(priority) ? priority : []}
              disableCloseOnSelect={false}
              getOptionLabel={(option) =>
                option !== null ? `${option.name}` : ""
              }
              value={selectedPriority}
              onChange={handlePriorityChange}
              sx={{
                width: "15vw",
                backgroundColor: " #D6F2FB",
                borderRadius: 2,
                marginRight: "1rem",
              }}
              renderInput={(params) => (
                <TextField {...params} label="Priority" />
              )}
            />
          </Box>
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            width: "100%", // Adjust the width as needed
            marginBottom: "1rem",
            backgroundColor: "",
          }}
        >
          <Box
            sx={{
              backgroundColor: "",
              marginLeft: "1rem", // Take remaining space
              marginRight: "4rem",
              marginBottom: "1rem",
            }}
          >
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DemoContainer components={["DatePicker"]}>
                <DatePicker
                  label="Recommend End Date"
                  required
                  sx={{
                    width: "17vw",
                    backgroundColor: " #D6F2FB",
                    marginLeft: "5rem",
                    borderRadius: 2,
                  }}
                  value={recommendEndDate}
                  onChange={(date) => setRecommendEndDate(date)}
                />
              </DemoContainer>
            </LocalizationProvider>
          </Box>
          <Box
            sx={{
              flex: "1", // Take remaining space
              marginRight: "1rem",
              marginTop: "0.5rem",
            }}
          >
            <Autocomplete
              sx={{
                width: "17vw",

                backgroundColor: " #D6F2FB",
                borderRadius: 2,
              }}
              multiple
              id="multiple-checkboxes"
              options={Array.isArray(department) ? department : []}
              disableCloseOnSelect
              getOptionLabel={(option) => option.name}
              value={selectedDepartment}
              onChange={(_, newValue) => setSelectedDepartment(newValue)}
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

                    <div>{option.name}</div>
                  </div>
                </li>
              )}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Select Department"
                  variant="outlined"
                />
              )}
              renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                  <span key={index} style={{ marginRight: 5 }}>
                    {option.name}
                    {index !== value.length - 1 ? "," : ""}
                  </span>
                ))
              }
            />
          </Box>
          <Box
            sx={{
              flex: "1", // Take remaining space
              marginRight: "1rem",
              marginTop: "0.5rem",
            }}
          >
            <Autocomplete
              disablePortal
              id="combo-box-demo"
              options={Array.isArray(componentName) ? componentName : []}
              disableCloseOnSelect={false}
              getOptionLabel={(option) =>
                option !== null ? `${option.name}` : ""
              }
              value={selectedComponentName}
              onChange={handleComponentChange}
              sx={{
                width: "17vw",
                backgroundColor: " #D6F2FB",
                borderRadius: 2,
              }}
              renderInput={(params) => (
                <TextField {...params} label="Component Name" />
              )}
            />
          </Box>
          <Box
            sx={{
              flex: "1", // Take remaining space
              marginRight: "1rem",
              marginTop: "0.5rem",
            }}
          >
            <TextField
              id="outlined-basic"
              label="Expected Impact"
              variant="outlined"
              required
              sx={{
                backgroundColor: " #D6F2FB",
                width: "27vw",
                marginLeft: 3,
                borderRadius: 2,
              }}
              value={expectedImpact}
              onChange={(e) => setExpectedImpact(e.target.value)}
            ></TextField>
          </Box>
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            width: "100%", // Adjust the width as needed
            marginBottom: "1rem",
            backgroundColor: "",
          }}
        >
          <Box
            sx={{
              flex: "1", // Take remaining space
              marginRight: "1rem",
              marginLeft: "1rem",
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                backgroundColor: "#D6F2FB",
                width: "32vw",
                height: "40px",

                borderRadius: 2,
                padding: 1,
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
                id="fileInput"
                ref={fileInputRef}
                type="file"
                style={{
                  display: "none",
                }}
                onChange={handleFileInputChange}
              />
              <AttachFileIcon
                onClick={handleAttachIconClick}
                style={{ cursor: "pointer", transform: "rotate(-50deg)" }}
              />
            </Box>
          </Box>

          <Typography variant="h5" sx={{ marginTop: 1, color: "#464646" }}>
            or
          </Typography>
          <Box
            sx={{
              flex: "1", // Take remaining space
              marginRight: "1rem",
              marginLeft: "1rem",
            }}
          >
            <TextField
              id="outlined-basic"
              type="text"
              label="Copy link"
              variant="outlined"
              sx={{
                backgroundColor: " #D6F2FB",
                width: "32vw",
                borderRadius: 2,
              }}
              value={copyLink}
              onChange={(e) => setCopyLink(e.target.value)}
            ></TextField>
          </Box>
          <Box
            sx={{
              // Take remaining space
              marginRight: "1rem",
              marginLeft: "",
              marginBottom: "2rem",
            }}
          >
            <Button
              variant="contained"
              disabled={buttonDisabled}
              sx={{
                width: "12vw",
                height: "52px",

                backgroundColor: "#281C61",
                borderRadius: 2,
              }}
              onClick={submit}
            >
              Recommend
            </Button>
          </Box>
        </Box>

        <div>
          {/* <Button onClick={handleOpen}>Show backdrop</Button> */}
          <Backdrop
            // style={{ zIndex: 1 }}
            sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.modal + 1 }}
            open={open}
            onClick={handleClose}
          >
            <CircularProgress color="inherit" />
          </Backdrop>
        </div>
      </Box>
    </>
  );
};
export default OemForm;
