import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Box,
  Button,
  Checkbox,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  ListItemText,
  MenuItem,
  Modal,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { TextareaAutosize } from "@mui/base/TextareaAutosize";
import dayjs from "dayjs";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import CloseIcon from "@mui/icons-material/Close";

// import action file
import { ParentModalAction } from "../actions/parentModalAction";

import {
  AGM,
  APPLICATION_OWNER,
  APPROVED,
  OEM_RECOMMENDATION,
  REJECTED,
  REVIEW_PROCESS,
  RECOMMENDATION_ACCEPTED,
  RECOMMENDATION_REJECTED,
} from "../constants/constant";
import ModalTimeline from "../components/ModalTimeline";
import AlertComponent from "../components/AlertComponent";

const ParentModal = (props) => {
  // const [snackbarOpen, setSnackbarOpen] = useState(false);
  // const [snackbarMessage, setSnackbarMessage] = useState("");
  // const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  // console.log("snackbaropen", snackbarOpen);
  const {
    rowData,
    isViewingDetails,
    isAgmRejected,
    isAppOwnerRejected,
    isAcceptByAppOwnerAndAgm,
    approverOneModalOpen,
    handleApproverOneModalClose,
    setSnackbarOpen,
    setSnackbarMessage,
    setSnackbarSeverity,
  } = props;

  const loginInfo = JSON.parse(sessionStorage.getItem("loginresponse"));
  const loggedUserId = loginInfo?.id || null;
  const loggedUserType = loginInfo?.userType || "";
  const loggedUserCompanyId = loginInfo?.company?.id || null;

  const recommendationDeploymentDetails =
    rowData?.recommendationDeploymentDetails || null;

  const [affectedDepartment, setAffectedDepartment] = useState("");
  const [allDepartment, setAllDepartment] = useState([]);

  const messageList = rowData?.messageList || [];
  console.log("message list in array", messageList);
  const [formData, setFormData] = useState({
    createdBy: {
      id: loggedUserId,
    },
    recommendRefId: rowData?.referenceId || null,
    developmentEndDate: recommendationDeploymentDetails
      ? recommendationDeploymentDetails?.developementEndDate
      : null,
    testCompletionDate: recommendationDeploymentDetails
      ? recommendationDeploymentDetails?.testCompletionDate
      : null,
    deploymentDate: recommendationDeploymentDetails
      ? recommendationDeploymentDetails?.deploymentDate
      : null,
    impactedDepartment:
      recommendationDeploymentDetails?.impactedDepartment || null,
    globalSupportNumber:
      recommendationDeploymentDetails?.globalSupportNumber || "",
    description: "",
  });

  // useState for determing the validity of selected deployment date
  // const [selectedDeploymentDate, setSelectedDeploymentDate] = useState(null);
  const selectedDeploymentDate = formData.deploymentDate;
  const oemRecommendedDeploymentDate = rowData?.recommendDate || null;

  // function to check if the deployment date is higher than the OEM recommended deployment date

  const isHigherThanRecommendedDate = () => {
    if (!selectedDeploymentDate || !oemRecommendedDeploymentDate) {
      return false;
    }
    return dayjs(selectedDeploymentDate).isAfter(oemRecommendedDeploymentDate);
  };

  // const fetchDepartments = async () => {
  //   const params = {
  //     companyId: loggedUserCompanyId,
  //   };
  //   try {
  //     const response = await ParentModalAction.allDepartments(params);

  //     if (response && response.status === 200) {
  //       console.log("response", response);
  //       const responseData = response?.data?.data || "";
  //       setAllDepartment(responseData);
  //     }
  //   } catch (err) {
  //     console.error(err);
  //   }
  // };

  // useEffect(() => {
  //   fetchDepartments();
  // }, []);

  // callback used to remove warning
  const fetchDepartments = useCallback(async () => {
    const params = {
      companyId: loggedUserCompanyId,
    };
    try {
      const response = await ParentModalAction.allDepartments(params);
      if (response && response.status === 200) {
        const responseData = response?.data?.data || "";
        setAllDepartment(responseData);
      }
    } catch (err) {
      console.error(err);
    }
  }, [loggedUserCompanyId]);

  const memoizedAllDepartment = useMemo(() => allDepartment, [allDepartment]);

  useEffect(() => {
    fetchDepartments();
  }, [fetchDepartments]);
  // -------------------------------------------------------------------
  // useEffect(() => {
  //   if (formData.affectedDepartment && !affectedDepartment) {
  //     const departmentNames = formData.impactedDepartment
  //       .split(",")
  //       .map((name) => name.trim());
  //     const selectedDepartments = allDepartment.filter((department) =>
  //       departmentNames.includes(department.name)
  //     );

  //     setAffectedDepartment(selectedDepartments);
  //     setFormData((prevData) => ({
  //       ...prevData,
  //       impactedDepartment: formData.impactedDepartment,
  //     }));
  //   }
  // }, [formData.impactedDepartment, allDepartment, affectedDepartment]);
  // second callback
  const handleDepartmentChangeCallback = useCallback(() => {
    if (formData.affectedDepartment && !affectedDepartment) {
      const departmentNames = formData.impactedDepartment
        .split(",")
        .map((name) => name.trim());
      const selectedDepartments = allDepartment.filter((department) =>
        departmentNames.includes(department.name)
      );

      setAffectedDepartment(selectedDepartments);
      setFormData((prevData) => ({
        ...prevData,
        impactedDepartment: formData.impactedDepartment,
      }));
    }
  }, [
    formData.affectedDepartment,
    affectedDepartment,
    formData.impactedDepartment,
    allDepartment,
  ]);

  useEffect(() => {
    handleDepartmentChangeCallback();
  }, [handleDepartmentChangeCallback]);

  // appowner approval fuction
  const handleAppOwnerApproval = async (e) => {
    e.preventDefault();

    const payload = {
      createdBy: {
        id: formData.createdBy.id,
      },
      recommendRefId: formData.recommendRefId,
      description: formData.description,
      developmentStartDate: formData.developmentStartDate,
      developementEndDate: formData.developmentEndDate,
      testCompletionDate: formData.testCompletionDate,
      deploymentDate: formData.deploymentDate,
      impactedDepartment: formData.impactedDepartment,
      globalSupportNumber: formData.globalSupportNumber,
      // description: formData.description,
    };

    try {
      const res = await ParentModalAction.handleAcceptByAppOwner(payload);
      if (res && (res.status === 200 || res.status === 201)) {
        // display snack success message
        setSnackbarMessage(res.data.message);
        setSnackbarSeverity("success");
        setSnackbarOpen(true);
        handleApproverOneModalClose();
        // setTimeout(() => {
        //   handleApproverOneModalClose();
        // }, 2000);
        // alert(res.data.message);
      } else {
        console.error("failed in my responsibilities", res);
        setSnackbarMessage(res.data.message);
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
        // setTimeout(() => {
        //   handleApproverOneModalClose();
        // }, 2000);
        // alert(res.data.message);
        handleApproverOneModalClose();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // const handleSnackbarClose = () => {
  //   setSnackbarOpen(false);
  // };

  // handling the revert functionality by agm
  const handleRevertByAgm = async (e) => {
    e.preventDefault();

    const payload = {
      createdBy: {
        id: formData.createdBy.id,
      },
      recommendRefId: formData.recommendRefId,
      description: formData.description,
      developmentStartDate: formData.developmentStartDate,
      developementEndDate: formData.developmentEndDate,
      testCompletionDate: formData.testCompletionDate,
      deploymentDate: formData.deploymentDate,
      impactedDepartment: formData.impactedDepartment,
      globalSupportNumber: formData.globalSupportNumber,
      // description: formData.description,
    };
    try {
      const res = await ParentModalAction.handleRevertByAgm(payload);
      if (res && (res.status === 200 || res.status === 201)) {
        setSnackbarMessage(res.data.message);
        setSnackbarSeverity("success");
        setSnackbarOpen(true);
        // setTimeout(() => {
        //   handleApproverOneModalClose();
        // }, 2000);
        handleApproverOneModalClose();
        // alert(res.data.message);
      } else {
        console.log("agm unable to revert", res);
        setSnackbarMessage(res.data.message);
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
        setTimeout(() => {
          handleApproverOneModalClose();
        }, 2000);
        // alert(res.data.message);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleApproveAgm = async (e) => {
    e.preventDefault();

    const payload = {
      createdBy: {
        id: formData.createdBy.id,
      },
      recommendRefId: formData.recommendRefId,
      description: formData.description,
      developmentStartDate: formData.developmentStartDate,
      developementEndDate: formData.developmentEndDate,
      testCompletionDate: formData.testCompletionDate,
      deploymentDate: formData.deploymentDate,
      impactedDepartment: formData.impactedDepartment,
      globalSupportNumber: formData.globalSupportNumber,
      // description: formData.description,
    };

    try {
      const res = await ParentModalAction.handleApproveByAgm(payload);
      if (res && (res.status === 200 || res.status === 201)) {
        setSnackbarMessage(res.data.message);
        setSnackbarSeverity("success");
        setSnackbarOpen(true);
        handleApproverOneModalClose();
        // setTimeout(() => {
        //   handleApproverOneModalClose();
        // }, 2000);
        // handleApproverOneModalClose();
        // alert(res.data.message);
      } else {
        console.error("unable to approve by agm", res);
        setSnackbarMessage(res.data.message);
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
        handleApproverOneModalClose();
        // setTimeout(() => {
        //   handleApproverOneModalClose();
        // }, 2000);
        // alert(res.data.message);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // department change function

  const handleDepartmentChange = (event) => {
    const {
      target: { value },
    } = event;

    if (Array.isArray(value)) {
      const departmentNames = value.map((dept) => dept.name).join(", ");

      setAffectedDepartment(value);

      setFormData((prevData) => ({
        ...prevData,
        impactedDepartment: departmentNames,
      }));
    } else {
      console.error("give a valid reason for coming here:", value);
    }
  };

  const handleDepartmentCheckboxChange = (event, department) => {
    const isChecked = event.target.checked;

    if (isChecked) {
      setAffectedDepartment((prevDepartments) => [
        ...prevDepartments,
        department,
      ]);
    } else {
      setAffectedDepartment((prevDepartments) =>
        prevDepartments.filter((dept) => dept.id !== department.id)
      );
    }
  };

  // handling the dates
  const handleDateChange = (date) => {
    if (date) {
      const dateObject = new Date(date);
      const year = dateObject.getFullYear();
      const month = dateObject.getMonth() + 1;
      const day = dateObject.getDate();
      const formattedDate = `${day}/${month}/${year}`;
      return formattedDate;
    }
  };

  //  handling the dates and time

  const handleDateAndTimeChange = (date) => {
    if (date) {
      const dateObject = new Date(date);
      const year = dateObject.getFullYear();
      const month = dateObject.getMonth() + 1;
      const day = dateObject.getDate();
      const formattedDate = `${day}/${month}/${year}`;

      const hours = dateObject.getHours();
      const minutes = String(dateObject.getMinutes()).padStart(2, "0");
      const ampm = hours >= 12 ? "pm" : "am";
      const formattedTime = `${hours % 12 || 12}.${minutes} ${ampm}`;

      return (
        <>
          <Typography>{formattedDate}</Typography>
          <Typography
            sx={{
              fontSize: "11px",
              fontWeight: 500,
            }}
          >
            {formattedTime}
          </Typography>
        </>
      );
    }
  };

  // changing the status color
  const statusColor = (statusName) => {
    let color;

    if (statusName === APPROVED) {
      color = "#8BB610";
    } else if (statusName === REVIEW_PROCESS) {
      color = "#E27D20";
    } else if (statusName === REJECTED) {
      color = "#DC4040";
    } else if (statusName === OEM_RECOMMENDATION) {
      color = "#b9d370";
    } else if (statusName === RECOMMENDATION_ACCEPTED) {
      color = "#E27D20";
    } else if (statusName === RECOMMENDATION_REJECTED) {
      color = "#DC4040";
    } else {
      color = "#7E7E7E";
    }

    return color;
  };

  return (
    <Modal
      open={approverOneModalOpen}
      onClose={handleApproverOneModalClose}
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
      sx={{
        height: "100%",
        overflowY: "scroll",
        marginTop: !isViewingDetails ? 0 : "10em",
      }}
      BackdropProps={{
        sx: {
          backdropFilter: "blur(2.4px)",
          backgroundColor: "rgba(0, 0, 0, 0.8)",
        },
      }}
    >
      <Box
        sx={{
          position: "absolute",
          left: "50%",
          width: "800px",
          height: "auto",
          borderRadius: "16px",
          bgcolor: "#EBF9FD",
          boxShadow: 24,
          p: 4,
          transform: "translate(-50%, 1%)",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexGrow: 1,
          }}
        >
          <Typography
            id="modal-title"
            component="div"
            sx={{ color: "#281C61", fontSize: "24px", fontWeight: 600 }}
          >
            {isViewingDetails
              ? `Reference ID:${rowData?.referenceId || "--"}`
              : `Deployment details`}
          </Typography>
          <IconButton
            onClick={handleApproverOneModalClose}
            sx={{ border: "0.9px solid #281C61" }}
          >
            <CloseIcon sx={{ color: "#281C61", fontSize: "10px" }} />
          </IconButton>
        </Box>

        {/* oem recommended deploytment details text */}
        {isViewingDetails ||
        isAgmRejected ||
        isAppOwnerRejected || (
          <isAcceptByAppOwnerAndAgm></isAcceptByAppOwnerAndAgm>
        ) ? (
          <Box sx={{ display: "flex", marginBottom: "2em" }}>
            <Typography>
              OEM Recommended deployment date:
              {handleDateChange(rowData?.recommendDate) || "--"}
            </Typography>
          </Box>
        ) : null}

        {/* displaying the backend api data */}
        {isViewingDetails ||
        isAgmRejected ||
        isAppOwnerRejected ||
        isAcceptByAppOwnerAndAgm ? (
          <Grid container spacing={2}>
            {isViewingDetails ? (
              <Grid item xs={12}>
                <Typography
                  sx={{ color: "#464646", fontSize: "16px", fontWeight: 600 }}
                >
                  Reference ID:{rowData?.referenceId || "--"}
                </Typography>
              </Grid>
            ) : null}
            <Grid item xs={2}>
              <Box>
                <Typography
                  sx={{ color: "#464646", fontSize: "13px", fontWeight: 600 }}
                >
                  Created on
                </Typography>
                {handleDateAndTimeChange(rowData.createdAt) || "--"}
              </Box>
            </Grid>

            <Grid item xs={2}>
              <Box>
                <Typography
                  sx={{ color: "#464646", fontSize: "13px", fontWeight: 600 }}
                >
                  Type
                </Typography>
                <Typography
                  sx={{ color: "gray", fontSize: "16px", fontWeight: 600 }}
                >
                  {rowData?.recommendationType?.name || ""}
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={2}>
              <Box>
                <Typography
                  sx={{ color: "#464646", fontSize: "13px", fontWeight: 600 }}
                >
                  Priority
                </Typography>
                <Typography
                  sx={{ color: "gray", fontSize: "16px", fontWeight: 600 }}
                >
                  {rowData?.priority || ""}
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={2}>
              <Box>
                <Typography
                  sx={{ color: "#464646", fontSize: "13px", fontWeight: 600 }}
                >
                  Recommended end date
                </Typography>
                <Typography
                  sx={{ color: "gray", fontSize: "16px", fontWeight: 600 }}
                >
                  {handleDateChange(rowData?.recommendDate) || "--"}
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={2}>
              <Box>
                <Typography
                  sx={{ color: "#464646", fontSize: "13px", fontWeight: 600 }}
                >
                  Department
                </Typography>
                <Typography
                  sx={{ color: "gray", fontSize: "16px", fontWeight: 600 }}
                >
                  {rowData?.department?.name || "--"}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={2}>
              <Box>
                <Typography
                  sx={{ color: "#464646", fontSize: "13px", fontWeight: 600 }}
                >
                  Component name
                </Typography>
                <Typography
                  sx={{ color: "gray", fontSize: "16px", fontWeight: 600 }}
                >
                  {rowData?.component?.name || "--"}
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={2}>
              <Box>
                <Typography
                  sx={{ color: "#464646", fontSize: "13px", fontWeight: 600 }}
                >
                  Approver
                </Typography>
                <Typography
                  sx={{ color: "gray", fontSize: "16px", fontWeight: 600 }}
                >
                  {rowData?.approver?.userName || "--"}
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={2}>
              <Box>
                <Typography
                  sx={{ color: "#464646", fontSize: "13px", fontWeight: 600 }}
                >
                  Status
                </Typography>
                <Typography
                  sx={{
                    color: statusColor(rowData?.status?.statusName),
                    fontSize: "16px",
                    fontWeight: 600,
                    wordWrap: "break-word",
                  }}
                >
                  {rowData?.status?.statusName || "--"}
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={2}>
              <Box>
                <Typography
                  sx={{ color: "#464646", fontSize: "13px", fontWeight: 600 }}
                >
                  Description
                </Typography>
                <Typography
                  sx={{
                    color: "gray",
                    fontSize: "16px",
                    fontWeight: 600,
                    wordWrap: "break-word",
                  }}
                >
                  {rowData?.descriptions || "--"}
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={2}>
              <Box>
                <Typography
                  sx={{ color: "#464646", fontSize: "13px", fontWeight: 600 }}
                >
                  Development start date
                </Typography>
                <Typography
                  sx={{ color: "gray", fontSize: "16px", fontWeight: 600 }}
                >
                  {handleDateChange(
                    rowData?.recommendationDeploymentDetails
                      ?.developmentStartDate
                  ) || "--"}{" "}
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={2}>
              <Box>
                <Typography
                  sx={{ color: "#464646", fontSize: "13px", fontWeight: 600 }}
                >
                  Development end date
                </Typography>
                <Typography
                  sx={{ color: "gray", fontSize: "16px", fontWeight: 600 }}
                >
                  {handleDateChange(
                    rowData?.recommendationDeploymentDetails
                      ?.developementEndDate
                  ) || "--"}
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={2}>
              <Box>
                <Typography
                  sx={{ color: "#464646", fontSize: "13px", fontWeight: 600 }}
                >
                  Task completion date
                </Typography>
                <Typography
                  sx={{ color: "gray", fontSize: "16px", fontWeight: 600 }}
                >
                  {handleDateChange(
                    rowData?.recommendationDeploymentDetails?.testCompletionDate
                  ) || "--"}
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={2}>
              <Box>
                <Typography
                  sx={{ color: "#464646", fontSize: "13px", fontWeight: 600 }}
                >
                  Deployment date
                </Typography>
                <Typography
                  sx={{ color: "gray", fontSize: "16px", fontWeight: 600 }}
                >
                  {handleDateChange(
                    rowData?.recommendationDeploymentDetails?.deploymentDate
                  ) || "--"}
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={2}>
              <Box>
                <Typography
                  sx={{ color: "#464646", fontSize: "13px", fontWeight: 600 }}
                >
                  Impacted department
                </Typography>
                <Typography
                  sx={{ color: "gray", fontSize: "16px", fontWeight: 600 }}
                >
                  {rowData?.impactedDepartment || "--"}
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={2}>
              <Box>
                <Typography
                  sx={{ color: "#464646", fontSize: "13px", fontWeight: 600 }}
                >
                  Past experience comment
                </Typography>
                <Typography
                  sx={{ color: "gray", fontSize: "16px", fontWeight: 600 }}
                >
                  {rowData?.pastExperienceComment || "--"}
                </Typography>
              </Box>
            </Grid>
          </Grid>
        ) : null}

        {isViewingDetails ? (
          <>
            <hr style={{ borderColor: "#FFF" }} />
            <Typography sx={{ fontSize: "16px" }}>Comment:</Typography>
            {messageList && messageList.length > 0 ? (
              <>
                <Box sx={{ width: "100%" }}>
                  {messageList.map((item, index) => {
                    return (
                      <div key={index} style={{ marginBottom: "5px" }}>
                        <Typography sx={{ fontSize: "12px" }}>
                          <Typography
                            component="span"
                            sx={{ fontSize: "14px" }}
                          >
                            {item?.createdBy?.userName}
                          </Typography>{" "}
                          (
                          <Typography
                            component="span"
                            sx={{ fontSize: "12px" }}
                          >
                            {item?.createdBy?.userType}
                          </Typography>
                          )
                        </Typography>
                        {item?.rejectionReason && (
                          <Typography
                            sx={{
                              fontSize: "12px",
                              color: "#7E7E7E",
                            }}
                          >
                            {item?.rejectionReason || "--"}
                          </Typography>
                        )}
                        {!item?.rejectionReason && (
                          <Typography
                            sx={{
                              fontSize: "12px",
                              color: "#7E7E7E",
                            }}
                          >
                            {item?.additionalMessage || "--"}
                          </Typography>
                        )}

                        {item?.createdAt || "--"}
                      </div>
                    );
                  })}
                </Box>
              </>
            ) : (
              <Typography
                sx={{
                  fontSize: "11px",
                  color: "#49505799",
                }}
              >
                (no comments)
              </Typography>
            )}
          </>
        ) : (
          <Grid container spacing={4} sx={{ marginTop: "1px" }}>
            {loggedUserType !== AGM && (
              <>
                <Grid item xs={6} sm={6} md={6} lg={6}>
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
                        label="Development start date"
                        format="DD-MM-YYYY"
                        slots={{
                          openPickerIcon: () => (
                            <CalendarMonthIcon sx={{ color: "#281C61" }} />
                          ),
                        }}
                        value={
                          formData.developmentStartDate
                            ? dayjs(formData.developmentStartDate)
                            : null
                        }
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
                            developmentStartDate: date,
                          })
                        }
                      />
                    </LocalizationProvider>
                  </Box>
                </Grid>

                <Grid item xs={6}>
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
                        label="Development end date"
                        format="DD-MM-YYYY"
                        slots={{
                          openPickerIcon: () => (
                            <CalendarMonthIcon sx={{ color: "#281C61" }} />
                          ),
                        }}
                        // required
                        value={
                          formData.developmentEndDate
                            ? dayjs(formData.developmentEndDate)
                            : null
                        }
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
                            developmentEndDate: date,
                          })
                        }
                      />
                    </LocalizationProvider>
                  </Box>
                </Grid>

                <Grid item xs={6}>
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
                        value={
                          formData.testCompletionDate
                            ? dayjs(formData.testCompletionDate)
                            : null
                        }
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
                            testCompletionDate: date,
                          })
                        }
                      />
                    </LocalizationProvider>
                  </Box>
                </Grid>

                <Grid item xs={6}>
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
                        label="Deployment date"
                        format="DD-MM-YYYY"
                        slots={{
                          openPickerIcon: () => (
                            <CalendarMonthIcon sx={{ color: "#281C61" }} />
                          ),
                        }}
                        // required
                        value={
                          formData.testCompletionDate
                            ? dayjs(formData.deploymentDate)
                            : null
                        }
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
                            deploymentDate: date,
                          })
                        }
                      />
                    </LocalizationProvider>
                  </Box>
                  {/* Helper text based on the comparison */}
                  {isHigherThanRecommendedDate() && (
                    <span style={{ color: "#281C61", fontSize: "13px" }}>
                      *OEM recommended deployment date (
                      {handleDateChange(oemRecommendedDeploymentDate)}) is
                      breached by the selected deployment date.
                    </span>
                  )}
                </Grid>

                <Grid item xs={6}>
                  <Box
                    sx={{
                      bgcolor: "#D6F2FB",
                      paddingX: "10px",
                      paddingY: "2px",
                      borderRadius: "10px",
                      // width:'100%'
                    }}
                  >
                    {/* FOR MULTIPLE */}

                    <FormControl
                      variant="standard"
                      sx={{
                        width: "100%",
                        height: "3.5em",
                        maxHeight: "3.5em",
                      }}
                      fullWidth
                      required
                    >
                      <InputLabel htmlFor="demo-simple-select-standard-label">
                        Department
                      </InputLabel>
                      <Select
                        multiple
                        labelId="demo-simple-select-standard-label"
                        id="demo-simple-select-standard"
                        disableUnderline={true}
                        value={affectedDepartment || []}
                        onChange={handleDepartmentChange}
                        label="Department"
                        renderValue={(selected) =>
                          selected.map((dept) => dept.name).join(", ")
                        }
                        MenuProps={{
                          PaperProps: {
                            style: {
                              maxHeight: 48 * 4.5 + 8,
                              width: 300,
                              marginTop: 8,
                            },
                            variant: "standard",
                          },
                        }}
                      >
                        {memoizedAllDepartment?.map((item) => (
                          <MenuItem key={item?.id} value={item}>
                            <div
                              style={{ display: "flex", alignItems: "center" }}
                            >
                              <Checkbox
                                checked={
                                  !!(
                                    affectedDepartment &&
                                    affectedDepartment.some(
                                      (dept) => dept.id === item.id
                                    )
                                  )
                                }
                                onChange={(event) =>
                                  handleDepartmentCheckboxChange(event, item)
                                }
                              />
                              <ListItemText
                                primary={
                                  <Typography sx={{ fontSize: "0.9rem" }}>
                                    {item?.name}
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

                <Grid item xs={6} sm={6} md={6} lg={6}>
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
                      value={formData.globalSupportNumber || ""}
                      size="small"
                      required
                      fullWidth
                      id="refNumber"
                      name="globalSupportRefNumber"
                      label="Global support reference number"
                      InputProps={{
                        disableUnderline: true,
                      }}
                      inputProps={{
                        maxLength: 150,
                      }}
                      sx={{ height: "3.5em", maxHeight: "3.5em" }}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          globalSupportNumber: e.target.value,
                        })
                      }
                    />
                  </Box>
                </Grid>
              </>
            )}

            {isAgmRejected || isAppOwnerRejected || isAcceptByAppOwnerAndAgm ? (
              <>
                <Grid item xs={12}>
                  <Typography
                    sx={{
                      fontSize: "18px",
                      fontWeight: 600,
                      marginBottom: "1px",
                    }}
                  >
                    Comment:
                  </Typography>
                  <ModalTimeline messageList={messageList} />
                </Grid>

                <Grid item xs={12}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      width: "100%",
                    }}
                  >
                    <TextareaAutosize
                      style={{
                        resize: "none",
                        width: "95%",
                        background: "#FFFFFF00",
                        borderRadius: "14px",
                        minHeight: "5em",
                        maxHeight: "5em",
                        fontSize: "17px",
                        padding: "7px 15px",
                        boxSizing: "border-box",
                      }}
                      maxRows={3}
                      maxLength={300}
                      aria-label="maximum height"
                      placeholder="If any, enter your comment here.."
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          description: e.target.value,
                        })
                      }
                    />
                  </Box>
                </Grid>
              </>
            ) : null}

            <Grid item xs={12} sm={12} md={12} lg={12}>
              <Box
                sx={{
                  display: "flex",
                  flexGrow: 1,
                  justifyContent: "center",
                  alignItems: "center",
                  marginTop: "1em",
                }}
              >
                <Button
                  variant="contained"
                  sx={{
                    bgcolor: "#281C61",
                    borderRadius: "12px",
                    paddingX: "32px",
                    paddingY: "17px",
                    // width: "100%",
                    width: "16em",
                    height: "3.5em",
                    fontSize: "16px",
                    fontWeight: 600,
                    "&:hover": { bgcolor: "#322475", overflow: "hidden" },
                  }}
                  onClick={
                    loggedUserType === APPLICATION_OWNER
                      ? handleAppOwnerApproval
                      : loggedUserType === AGM
                      ? isAppOwnerRejected
                        ? handleRevertByAgm
                        : handleApproveAgm
                      : null
                  }
                >
                  {loggedUserType === APPLICATION_OWNER
                    ? "SEND FOR APPROVAL"
                    : loggedUserType === AGM
                    ? isAppOwnerRejected
                      ? "REVERT"
                      : "APPROVE"
                    : ""}
                </Button>

                {/* <AlertComponent
                  open={snackbarOpen}
                  handleClose={handleSnackbarClose}
                  severity={snackbarSeverity}
                  message={snackbarMessage}
                /> */}
              </Box>
            </Grid>
          </Grid>
        )}
      </Box>
    </Modal>
  );
};

export default ParentModal;
