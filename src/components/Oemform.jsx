import React, { useRef } from "react";
import { useEffect, useState } from "react";
import "../css/DasForm.css";
import dayjs from "dayjs";

import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";

import TextField from "@mui/material/TextField";

import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import AttachmentIcon from "@mui/icons-material/Attachment";
import { LoadingButton } from "@mui/lab";

// import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { Divider, IconButton, Typography } from "@mui/material";

import ListItemText from "@mui/material/ListItemText";
import Checkbox from "@mui/material/Checkbox";

import { Oemactions } from "../actions/oemAction";

import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";

// mui snack component
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
      padding: "0.75rem",
      borderRadius: "0.5rem",
      background: "#FFF",
      marginTop: "0.2em",
    },
  },
};

const paperStyles = {
  padding: "0.75rem",
  flexDirection: "column",
  alignItems: "flex-start",
  gap: "0.75rem",
  borderRadius: "0.5rem",
  background: "#FFF",
  marginTop: "0.2em",
};

const Oemform = ({ fetchTableDataOemAndAgm }) => {
  // snackbar useState
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [updates, setUpdates] = useState("");
  // console.log("response.data.data in usestate", updates)

  // integrating the loading button
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchUpdatetype = async () => {
      const response = await Oemactions.Updatetype();
      // console.log("response that is to be updates in usestate", response.data.data)
      setUpdates(response.data.data);
      // sessionStorage.setItem("formdata", JSON.stringify(response.data.data))
    };

    fetchUpdatetype();
  }, []);
  const fileInputRef = useRef(null);
  const [fileName, setFileName] = useState("");

  // file input functions
  const handleFileInputChange = (event) => {
    let file = event.target.files[0];
    if (file) {
      setFileName(file.name);
      setFormdata((prevFormdata) => ({
        ...prevFormdata,
        documentFile: file,
      }));
    } else {
      setFileName("");
      setFormdata((prevFormdata) => ({
        ...prevFormdata,
        documentFile: null,
      }));
    }
  };

  const openFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  // handling the time change function
  const handleDateChange = (date) => {
    if (date) {
      const dateObject = new Date(date);
      const year = dateObject.getFullYear();
      const month = String(dateObject.getMonth() + 1).padStart(2, "0");
      const day = String(dateObject.getDate()).padStart(2, "0");
      const formattedDate = `${year}-${month}-${day}`;
      return formattedDate;
    }
  };
  // managing the complete form data

  const [formData, setFormdata] = useState({
    description: "",
    type: "",
    priority: "",
    endDate: null,
    department: [],
    componentname: [],
    expectedimpact: "",
    documentFile: null,
    copyLink: "",
  });

  const handleChange = (e) => {
    const { name, value, type } = e.target;

    if (type === "file") {
      setFormdata({
        ...formData,
        [name]: e.target.files[0],
      });
      // } else if (name === "endDate" && value) {
      //   const formattedDate = new Date(value).toLocaleDateString("en-CA");
      //   setFormdata({
      //     ...formData,
      //     [name]: formattedDate,
      //   });
    } else {
      setFormdata({
        ...formData,
        [name]: value,
      });
    }
  };

  // handle close snackbar component
  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  // handlesubmit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (
      !formData.description ||
      !formData.type ||
      !formData.priority ||
      !formData.endDate ||
      !formData.department ||
      !formData.componentname ||
      !formData.expectedimpact ||
      !formData.documentFile ||
      !formData.copyLink
    ) {
      setSnackbarMessage("please fill all the details");
      setSnackbarOpen(true);
      setSnackbarSeverity("warning");

      // alert("please fill all the details");
      setIsLoading(false);
      return;
    }

    const typeID =
      updates.recommendationTypeList.find((type) => type.name === formData.type)
        ?.id || null;
    const priorityID =
      updates.priorityList.find(
        (priority) => priority.name === formData.priority
      )?.id || null;

    // extracting ids from multi select dropdown list
    const departmentIDs = formData.department.map(
      (departmentName) =>
        updates.departmentList.find(
          (department) => department.name === departmentName
        )?.id || null
    );

    const componentIDs = formData.componentname.map(
      (componentName) =>
        updates.componentList.find(
          (component) => component.name === componentName
        )?.id || null
    );
    const payload = new FormData();
    payload.append("description", formData.description);
    payload.append("typeId", typeID);
    payload.append("createdBy", 1);
    payload.append("priorityId", priorityID);
    payload.append("componentId", componentIDs[0]);
    payload.append("departmentIds", [departmentIDs]);
    payload.append("recommendDate", formData.endDate);
    payload.append("expectedImpact", formData.expectedimpact);
    payload.append("file", formData.documentFile);
    payload.append("urlLink", formData.copyLink);

    try {
      const response = await Oemactions.recommendation(payload);
      console.log("payload for deptid", payload);
      if (response && (response.status === 200 || response.status === 201)) {
        setSnackbarMessage(response.data.message);
        setSnackbarOpen(true);
        setSnackbarSeverity("success");
        // Reset endDate state
        setFormdata((prevFormData) => ({
          ...prevFormData,
          endDate: "",
        }));
        fetchTableDataOemAndAgm();
        // alert(response.data.message);
      } else {
        // alert("unable to add recommendations");
        setSnackbarMessage("unable to add recommendations");
        setSnackbarOpen(true);
        setSnackbarSeverity("error");
      }
    } catch (err) {
      setSnackbarMessage("unable to add recommendations");
      setSnackbarOpen(true);
      setSnackbarSeverity("error");
    } finally {
      setIsLoading(false);
    }

    setFormdata({
      description: "",
      type: "",
      priority: "",
      endDate: "",
      department: [],
      componentname: [],
      expectedimpact: "",
      documentFile: null,
      // fileName: "",

      copyLink: "",
    });
    setFileName("");
  };

  return (
    <div
      style={{
        display: "flex",
        gap: "1em",
        width: "100%",
        marginTop: "1.5em",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Box className="blue_box">
        <div
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "flex-start",
          }}
        >
          <Typography
            sx={{
              color: "#fff",
              fontFamily: "Open Sans",
              fontSize: "1.25rem",
              fontStyle: "normal",
              fontWeight: "400",
              lineHeight: "normal",
              textTransform: "capitalize",
            }}
          >
            Add Recommendations
          </Typography>
        </div>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Box
              sx={{
                bgcolor: "#D6F2FB",
                paddingX: "10px",
                paddingY: "2px",
                borderRadius: "10px",
              }}
            >
              <TextField
                id="filled-basic"
                label="Description"
                required
                variant="standard"
                size="small"
                name="description"
                value={formData.description}
                onChange={handleChange}
                fullWidth
                sx={{
                  backgroundColor: "#D6F2FB",
                  borderRadius: "0.25em",
                  height: "3.4em",
                }}
                InputProps={{
                  disableUnderline: true,
                }}
              />
            </Box>
          </Grid>
          <Grid item xs={3}>
            <Box
              sx={{
                bgcolor: "#D6F2FB",
                paddingX: "10px",
                paddingY: "2px",
                borderRadius: "10px",
              }}
            >
              <FormControl
                fullWidth
                variant="standard"
                sx={{
                  backgroundColor: "#D6F2FB",
                  borderRadius: "0.25em",
                  height: "3.4em",
                }}
              >
                <InputLabel id="demo-simple-select-label" required>
                  Type
                </InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  label="Type"
                  sx={{ height: "100%" }}
                  disableUnderline={true}
                  MenuProps={{
                    PaperProps: {
                      style: paperStyles,
                    },
                  }}
                  name="type"
                  value={formData.type || ""}
                  onChange={handleChange}
                >
                  {updates &&
                    updates.recommendationTypeList.map((type, index) => [
                      <MenuItem key={type.id} value={type.name}>
                        {type.name}
                      </MenuItem>,
                      index < updates.recommendationTypeList.length - 1 && (
                        <Divider key={`divider-${index}`} />
                      ),
                    ])}
                </Select>
              </FormControl>
            </Box>
          </Grid>

          {/* priority dropdown */}

          <Grid item xs={3}>
            <Box
              sx={{
                bgcolor: "#D6F2FB",
                paddingX: "10px",
                paddingY: "2px",
                borderRadius: "10px",
              }}
            >
              <FormControl
                fullWidth
                variant="standard"
                sx={{
                  backgroundColor: "#D6F2FB",
                  borderRadius: "0.25em",
                  height: "3.4em",
                }}
              >
                <InputLabel
                  id="demo-simple-select-label"
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                  required
                >
                  Priority
                </InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  disableUnderline={true}
                  label="Priority"
                  sx={{ height: "100%" }}
                  MenuProps={{
                    PaperProps: {
                      style: paperStyles,
                    },
                  }}
                  name="priority"
                  value={formData.priority}
                  onChange={handleChange}
                >
                  {updates &&
                    updates.priorityList.map((priority, index) => [
                      <MenuItem key={priority.id} value={priority.name}>
                        {priority.name}
                      </MenuItem>,
                      index < updates.priorityList.length - 1 && (
                        <Divider key={`divider-${index}`} />
                      ),
                    ])}
                </Select>
              </FormControl>
            </Box>
          </Grid>

          <Grid item xs={2.8}>
            <Box
              sx={{
                bgcolor: "#D6F2FB",
                paddingX: "10px",
                paddingY: "2px",
                borderRadius: "10px",
              }}
            >
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  // name="endDate"
                  // value={formData.endDate}
                  // onChange={(date) =>
                  //   handleChange({ target: { name: "endDate", value: date } })
                  // }
                  value={formData.endDate ? dayjs(formData.endDate) : null}
                  label="Recommended end date"
                  format="YYYY-MM-DD"
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
                    setFormdata({
                      ...formData,
                      endDate: handleDateChange(date),
                    })
                  }
                />
              </LocalizationProvider>
            </Box>
          </Grid>

          <Grid item xs={2.8}>
            <Box
              sx={{
                bgcolor: "#D6F2FB",
                paddingX: "10px",
                paddingY: "2px",
                borderRadius: "10px",
              }}
            >
              <FormControl
                fullWidth
                sx={{
                  backgroundColor: "#D6F2FB",
                  borderRadius: "0.25em",
                  width: "100%",
                  height: "3.4em",
                }}
                variant="standard"
                required
              >
                <InputLabel id="demo-simple-select-label" required>
                  Department
                </InputLabel>
                <Select
                  labelId="demo-simple-select-standard-label"
                  id="demo-simple-select-standard"
                  multiple
                  disableUnderline={true}
                  value={formData.department}
                  onChange={(e) =>
                    handleChange({
                      target: { name: "department", value: e.target.value },
                    })
                  }
                  // input={<OutlinedInput label="Tag" />}
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
                  {updates &&
                    updates.departmentList.map((department, index) => [
                      <MenuItem key={department.id} value={department.name}>
                        <Checkbox
                          checked={
                            formData.department.indexOf(department.name) > -1
                          }
                        />
                        <ListItemText primary={department.name} />
                      </MenuItem>,
                      index < updates.departmentList.length - 1 && (
                        <Divider key={`divider-${index}`} />
                      ),
                    ])}
                </Select>
              </FormControl>
            </Box>
          </Grid>

          <Grid item xs={2.8}>
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
                fullWidth
                sx={{
                  backgroundColor: "#D6F2FB",
                  borderRadius: "0.25em",
                  width: "100%",
                  height: "3.4em",
                }}
              >
                <InputLabel htmlFor="demo-simple-select-standard-label">
                  Component name
                </InputLabel>
                <Select
                  labelId="demo-simple-select-standard-label"
                  id="demo-simple-select-standard"
                  disableUnderline={true}
                  multiple
                  value={formData.componentname}
                  onChange={(e) =>
                    handleChange({
                      target: { name: "componentname", value: e.target.value },
                    })
                  }
                  // input={<OutlinedInput label="Tag" />}
                  renderValue={(selected) => selected.join(", ")}
                  MenuProps={MenuProps}
                >
                  {updates &&
                    updates.componentList.map((component, index) => [
                      <MenuItem key={component.id} value={component.name}>
                        <Checkbox
                          checked={
                            formData.componentname.indexOf(component.name) > -1
                          }
                        />
                        <ListItemText primary={component.name} />
                      </MenuItem>,
                      index < updates.componentList.length - 1 && (
                        <Divider key={`divider-${index}`} />
                      ),
                    ])}
                </Select>
              </FormControl>
            </Box>
          </Grid>
          <Grid item xs={3.6}>
            <Box
              sx={{
                bgcolor: "#D6F2FB",
                paddingX: "10px",
                paddingY: "2px",
                borderRadius: "10px",
              }}
            >
              <TextField
                id="filled-basic"
                label="Expected Impact"
                variant="standard"
                fullWidth
                sx={{
                  backgroundColor: "#D6F2FB",
                  borderRadius: "0.25em",
                  height: "3.4em",
                }}
                name="expectedimpact"
                value={formData.expectedimpact}
                onChange={handleChange}
                InputProps={{
                  disableUnderline: true,
                }}
              />
            </Box>
          </Grid>
          <Grid item xs={4.5}>
            {/* <TextField
              id="outlined-basic"
              fullWidth
              variant="outlined"
              type="file"
              placeholder="attach document"
              sx={{ backgroundColor: "#D6F2FB", borderRadius: "0.25em" }}
              name="documentFile"
              onChange={handleChange}
            /> */}
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
                htmlFor="file-input"
                sx={{ display: "flex", flexGrow: 1 }}
              >
                <Typography variant="body1">
                  {fileName || "Attach Document"}
                </Typography>
              </InputLabel>
              <input
                type="file"
                id="file-input"
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
          <Grid item xs={4.5}>
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
                id="filled-basic"
                label="Copy Link"
                variant="standard"
                type={"url"}
                fullWidth
                sx={{
                  backgroundColor: "#D6F2FB",
                  borderRadius: "0.25em",
                  height: "3.5em",
                }}
                name="copyLink"
                value={formData.copyLink}
                onChange={handleChange}
                InputProps={{
                  disableUnderline: true,
                }}
              />
            </Box>
          </Grid>
          <Grid
            item
            xs={3}
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              // backgroundColor: "red",
            }}
          >
            {/* <button className="style_btn" onClick={handleSubmit}>
              RECOMMEND
            </button> */}

            <LoadingButton
              variant="contained"
              sx={{
                width: "12.125rem",
                height: "3.25rem",
                fontSize: "1.10rem",
                textTransform: "none",
                fontWeight: "550",
                backgroundColor: "#281c61",
                borderRadius: "0.75rem",
                marginRight: "2rem",
              }}
              loading={isLoading}
              onClick={handleSubmit}
            >
              RECOMMEND
            </LoadingButton>
          </Grid>
        </Grid>
      </Box>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          elevation={6}
          variant="filled"
          onClose={handleCloseSnackbar}
          severity={snackbarSeverity}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default Oemform;
