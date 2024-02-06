import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
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
import { toast } from "react-toastify";

import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import CloseIcon from "@mui/icons-material/Close";
import CircularProgress from "@mui/material/CircularProgress";

import DetailedModalAction from "../../actions/detailedModalAction";
import CommentTimeLine from "../Timeline/CommentTimeLine";
import {
  AGM,
  APPLICATION_OWNER,
  APPROVED,
  OEM_RECOMMENDATION,
  RECOMMENDATION_ACCEPTED,
  RECOMMENDATION_REJECTED,
  REJECTED,
  REVIEW_PROCESS,
} from "../../helper/constant";
import AppLoader from "../AppLoader/AppLoader";

const customFontStyles = {
  fontFamily: "Open Sans !important",
  fontWeight: 600,
  fontSize: "14px",
};

const handleFormDataDateChange = (date) => {
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

const DetailedModal = (props) => {
  const {
    rowData,
    approverOneModalOpen,
    handleApproverOneModalClose,
    isViewingDetails,
    isAgmRejected,
    isAppOwnerRejected,
    isAcceptByAppOwnerAndAgm,
    fetchAllPendingRecommendationForAppOwner,
    fetchAllApprovedRecommendationForAppOwner,
    fetchRecommendationAgmAndOem,
  } = props;

  const messageList = rowData?.messageList || [];

  // console.log("is message list", messageList);

  const loginData = JSON.parse(sessionStorage.getItem("loginData"));
  // console.log(' log data', loginData)
  const loggedUserId = loginData?.id || null;
  const loggedUserType = loginData?.userType || "";
  const loggedUserCompanyId = loginData?.company?.id || null;
  const [impactedDepartmentName, setImpactedDepartmentName] = useState(""); // FOR SOLO SELECT
  const [departments, setDepartments] = useState([]);
  const [isButtonLoading, setIsButtonLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeploymentDateAhead, setIsDeploymentDateAhead] = useState(false);
  // console.log("isDeploymentDateAhead", isDeploymentDateAhead);
  // const [isAgmRejected, setIsAgmRejected] = useState(false);
  // const [isAppOwnerRejected, setIsAppOwnerRejected] = useState(false);
  const recommendationDeploymentDetails =
    rowData?.recommendationDeploymentDetails || null;

  const initialFormData = {
    createdBy: {
      id: loggedUserId,
    },
    recommendRefId: rowData?.referenceId || null,
    developmentStartDate: recommendationDeploymentDetails
      ? handleFormDataDateChange(
          recommendationDeploymentDetails?.developmentStartDate
        )
      : null,
    developmentEndDate: recommendationDeploymentDetails
      ? handleFormDataDateChange(
          recommendationDeploymentDetails?.developementEndDate
        )
      : null,
    testCompletionDate: recommendationDeploymentDetails
      ? handleFormDataDateChange(
          recommendationDeploymentDetails?.testCompletionDate
        )
      : null,
    deploymentDate: recommendationDeploymentDetails
      ? handleFormDataDateChange(
          recommendationDeploymentDetails?.deploymentDate
        )
      : null,
    impactedDepartment:
      recommendationDeploymentDetails?.impactedDepartment || null,
    globalSupportNumber:
      recommendationDeploymentDetails?.globalSupportNumber || "",
    description: "",
  };
  const [formData, setFormData] = useState(initialFormData);

  // useEffect(() => {
  //   if (rowData?.recommendationDeploymentDetails) {
  //     setIsAgmRejected(true);
  //   }

  //   if (!rowData?.recommendationDeploymentDetails) {
  //     setIsAgmRejected(false);
  //   }

  //   if (rowData && rowData?.isAppOwnerRejected === true) {
  //     setIsAppOwnerRejected(true);
  //   }

  //   if (
  //     rowData &&
  //     (rowData?.isAppOwnerRejected === false ||
  //       rowData?.isAppOwnerRejected === null)
  //   ) {
  //     setIsAppOwnerRejected(false);
  //   }
  // }, [rowData]);

  // console.log("modal Data", rowData);

  // console.log("depts options:  ", departments);

  // console.log("selected depts:  ", impactedDepartmentName);
  // console.log("initial data:   ", initialFormData);

  // console.log("form data:   ", formData);

  const fetchAllDepartments = async () => {
    const params = {
      companyId: loggedUserCompanyId,
    };
    try {
      const response = await DetailedModalAction.allDepartments(params);

      if (response && (response.status === 200 || response.status === 201)) {
        const deptResponseData = response?.data?.data || "";
        setDepartments(deptResponseData);
        // console.log('res depts', deptResponseData)
      }
    } catch (error) {
      return error;
    }
  };

  useEffect(() => {
    fetchAllDepartments();
  }, []);

  useEffect(() => {
    if (initialFormData.impactedDepartment && !impactedDepartmentName) {
      // console.log("useeffect hit");
      const departmentNames = initialFormData.impactedDepartment
        .split(",")
        .map((name) => name.trim());

      const selectedDepartments = departments.filter((department) =>
        departmentNames.includes(department.name)
      );

      setImpactedDepartmentName(selectedDepartments);

      setFormData((prevData) => ({
        ...prevData,
        impactedDepartment: initialFormData.impactedDepartment,
      }));
    }
  }, [initialFormData.impactedDepartment, departments, impactedDepartmentName]);

  const handleAppOwnerApprove = async (e) => {
    e.preventDefault();

    const trimmedDescription = formData.description
      ? formData.description.trim()
      : "";

    const trimmedGlobalSupportNumber = formData.globalSupportNumber
      ? formData.globalSupportNumber.trim()
      : "";

    if (!formData.developmentStartDate) {
      toast.warn("Development start date is required !", {
        toastId: "approveAppOwner-warn01",
      });
      return;
    }

    if (!formData.developmentEndDate) {
      toast.warn("Development end date is required !", {
        toastId: "approveAppOwner-warn02",
      });

      return;
    }

    if (!formData.testCompletionDate) {
      toast.warn("Test completion date is required !", {
        toastId: "approveAppOwner-warn03",
      });

      return;
    }

    if (!formData.deploymentDate) {
      toast.warn("Deployement date is required !", {
        toastId: "approveAppOwner-warn04",
      });

      return;
    }

    if (!formData.impactedDepartment) {
      toast.warn("Please select atleast one department !", {
        toastId: "approveAppOwner-warn05",
      });

      return;
    }

    if (!trimmedGlobalSupportNumber) {
      toast.warn("Global support refference number is required !", {
        toastId: "approveAppOwner-warn06",
      });

      return;
    }

    const payload = {
      createdBy: {
        id: formData.createdBy.id,
      },
      recommendRefId: formData.recommendRefId,
      developmentStartDate: formData.developmentStartDate,
      developementEndDate: formData.developmentEndDate,
      testCompletionDate: formData.testCompletionDate,
      deploymentDate: formData.deploymentDate,
      impactedDepartment: formData.impactedDepartment,
      globalSupportNumber: trimmedGlobalSupportNumber,
      description: trimmedDescription,
    };

    // console.log("APP OWNER payload:  ", payload);

    // return;

    try {
      // setIsButtonLoading(true);
      setIsLoading(true);
      const response = await DetailedModalAction.funcAcceptByAppOwner(payload);

      let toastMessge = "";

      if (response && (response.status === 200 || response.status === 201)) {
        // console.log("success response:  ", response);

        toastMessge = response?.data?.message;
        const cleanedMessage = JSON.stringify(toastMessge);
        toast.success(JSON.parse(cleanedMessage), {
          toastId: "approveAppOwner-success01",
        });

        handleApproverOneModalClose();
        if (loggedUserType) {
          if (loggedUserType === AGM) {
            fetchRecommendationAgmAndOem(); //OEM_SI VIEW  &  AGM ACTION
          }

          if (loggedUserType === APPLICATION_OWNER) {
            fetchAllPendingRecommendationForAppOwner(); //APP_OWNER ACTION
            fetchAllApprovedRecommendationForAppOwner();
          }
        }
      } else {
        if (
          response &&
          response.status &&
          (response.status !== 200 || response.status !== 201)
        ) {
          toastMessge = response?.data?.message;
          const cleanedMessage = JSON.stringify(toastMessge);
          toast.error(JSON.parse(cleanedMessage), {
            toastId: "approveAppOwner-err01",
          });
          // console.error("RESPONSE MSG:  ", response.data.message);
        } else {
          toastMessge = response?.message;
          const cleanedMessage = JSON.stringify(toastMessge);
          toast.error(JSON.parse(cleanedMessage), {
            toastId: "approveAppOwner-err02",
          });
          // console.error("AXIOS MSG:  ", response.message);
        }
      }
    } catch (error) {
      console.error("catch error:  ", error);
      return error;
    } finally {
      // setIsButtonLoading(false);
      setIsLoading(false);
    }
  };

  const handleRevertByAgm = async (e) => {
    e.preventDefault();

    const trimmedDescription = formData.description
      ? formData.description.trim()
      : "";

    const payload = {
      createdBy: {
        id: formData.createdBy.id,
      },
      recommendRefId: formData.recommendRefId,
      developmentStartDate: formData.developmentStartDate,
      developementEndDate: formData.developmentEndDate,
      testCompletionDate: formData.testCompletionDate,
      deploymentDate: formData.deploymentDate,
      impactedDepartment: formData.impactedDepartment,
      globalSupportNumber: formData.globalSupportNumber,
      description: trimmedDescription,
    };

    // console.log("AGM  Revert payload:  ", payload);

    try {
      // setIsButtonLoading(true);
      setIsLoading(true);
      const response = await DetailedModalAction.funcRevertByAgm(payload);

      let toastMessge = "";

      if (response && (response.status === 200 || response.status === 201)) {
        // console.log(" agm revert api response:  ", response);

        toastMessge = response?.data?.message;
        const cleanedMessage = JSON.stringify(toastMessge);
        toast.success(JSON.parse(cleanedMessage), {
          toastId: "revertAgm-success01",
        });

        handleApproverOneModalClose();
        if (loggedUserType) {
          if (loggedUserType === AGM) {
            fetchRecommendationAgmAndOem(); //OEM_SI VIEW  &  AGM ACTION
          }

          if (loggedUserType === APPLICATION_OWNER) {
            fetchAllPendingRecommendationForAppOwner(); //APP_OWNER ACTION
            fetchAllApprovedRecommendationForAppOwner();
          }
        }
      } else {
        if (
          response &&
          response.status &&
          (response.status !== 200 || response.status !== 201)
        ) {
          toastMessge = response?.data?.message;
          const cleanedMessage = JSON.stringify(toastMessge);
          toast.error(JSON.parse(cleanedMessage), {
            toastId: "revertAgm-err01",
          });
          // console.error("RESPONSE MSG:  ", response.data.message);
        } else {
          toastMessge = response?.message;
          const cleanedMessage = JSON.stringify(toastMessge);
          toast.error(JSON.parse(cleanedMessage), {
            toastId: "revertAgm-err02",
          });
          // console.error("AXIOS MSG:  ", response.message);
        }
      }
    } catch (error) {
      return error;
    } finally {
      // setIsButtonLoading(false);
      setIsLoading(false);
    }

    // return;
  };

  const handleSubmitApproveByAgm = async (e) => {
    e.preventDefault();

    const trimmedDescription = formData.description
      ? formData.description.trim()
      : "";

    const trimmedGlobalSupportNumber = formData.globalSupportNumber
      ? formData.globalSupportNumber.trim()
      : "";

    // if (!formData.developmentStartDate) {
    //   console.warn("Development start date is required !");
    //   return;
    // }

    // if (!formData.developmentEndDate) {
    //   console.warn("Development end date is required !");
    //   return;
    // }

    // if (!formData.testCompletionDate) {
    //   console.warn("Test completion date is required !");
    //   return;
    // }

    // if (!formData.deploymentDate) {
    //   console.warn("Deployement date is required !");
    //   return;
    // }

    // if (!formData.impactedDepartment) {
    //   console.warn("Please select atleast one department !");
    //   return;
    // }

    // if (!trimmedGlobalSupportNumber) {
    //   console.warn("Global support refference number is required !");
    //   return;
    // }

    const payload = {
      createdBy: {
        id: formData.createdBy.id,
      },
      recommendRefId: formData.recommendRefId,
      developmentStartDate: formData.developmentStartDate,
      developementEndDate: formData.developmentEndDate,
      testCompletionDate: formData.testCompletionDate,
      deploymentDate: formData.deploymentDate,
      impactedDepartment: formData.impactedDepartment,
      globalSupportNumber: trimmedGlobalSupportNumber,
      description: trimmedDescription,
    };

    // console.log("AGM approve payload:  ", payload);

    // return;

    try {
      // setIsButtonLoading(true);
      setIsLoading(true);
      const response = await DetailedModalAction.funcApproveByAgm(payload);

      // console.log(" response code: ", response.status);
      let toastMessge = "";

      if (response && (response.status === 200 || response.status === 201)) {
        // console.log(" agm approve api response:  ", response);

        toastMessge = response?.data?.message;
        const cleanedMessage = JSON.stringify(toastMessge);
        toast.success(JSON.parse(cleanedMessage), {
          toastId: "approveAgm-success01",
        });
        handleApproverOneModalClose();
        if (loggedUserType) {
          if (loggedUserType === AGM) {
            fetchRecommendationAgmAndOem(); //OEM_SI VIEW  &  AGM ACTION
          }

          if (loggedUserType === APPLICATION_OWNER) {
            fetchAllPendingRecommendationForAppOwner(); //APP_OWNER ACTION
            fetchAllApprovedRecommendationForAppOwner();
          }
        }
      } else {
        if (
          response &&
          response.status &&
          (response.status !== 200 || response.status !== 201)
        ) {
          toastMessge = response?.data?.message;
          const cleanedMessage = JSON.stringify(toastMessge);
          toast.error(JSON.parse(cleanedMessage), {
            toastId: "approveAgm-err01",
          });
          // console.error("RESPONSE MSG:  ", response.data.message);
        } else {
          toastMessge = response?.message;
          const cleanedMessage = JSON.stringify(toastMessge);
          toast.error(JSON.parse(cleanedMessage), {
            toastId: "approveAgm-err02",
          });
          // console.error("AXIOS MSG:  ", response.message);
        }
      }
    } catch (error) {
      return error;
    } finally {
      // setIsButtonLoading(false);
      setIsLoading(false);
    }
  };

  // DONT DELETE COMMENTED

  // const handleDepartmentChange = (event) => {
  //   const {
  //     target: { value },
  //   } = event;

  //   console.log('dept ids', typeof(value))

  //   setImpactedDepartmentName(value);

  // };

  //DONT DELETE COMMENTED

  const handleDepartmentChange = (event) => {
    const {
      target: { value },
    } = event;

    // console.log("dept values", value);

    // COMMENT IT FOR SOLO DEPARTMENT ! ! ! !

    if (Array.isArray(value)) {
      const departmentNames = value.map((dept) => dept.name).join(", ");

      setImpactedDepartmentName(value);

      setFormData((prevData) => ({
        ...prevData,
        impactedDepartment: departmentNames,
      }));
    }

    // RELEASE IT FOR SOLO DEPARTMENT ! ! ! !

    // else if (value && typeof value === 'object') {
    //   const departmentId = value.id;

    //   // setImpactedDepartmentName([value]);  // If impactedDepartment is needed to be an array
    //   setImpactedDepartmentName(value);
    //   setFormData((prevData) => ({
    //     ...prevData,
    //     impactedDepartment: [departmentId],
    //   }));
    // }
    else {
      console.error("Invalid value:", value);
    }
  };

  const handleDepartmentCheckboxChange = (event, department) => {
    const isChecked = event.target.checked;

    if (isChecked) {
      setImpactedDepartmentName((prevDepartments) => [
        ...prevDepartments,
        department,
      ]);
    } else {
      setImpactedDepartmentName((prevDepartments) =>
        prevDepartments.filter((dept) => dept.id !== department.id)
      );
    }
  };

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
          <Typography
            sx={{ ...customFontStyles, fontSize: "16.3px", color: "#7e7e7e" }}
          >
            {formattedDate}
          </Typography>
          <Typography
            sx={{
              ...customFontStyles,
              fontSize: "12px",
              fontWeight: 500,
              color: "#7e7e7e",
            }}
          >
            {formattedTime}
          </Typography>
        </>
      );
      // return { formattedDate, formattedTime };
    }
  };

  const handleCommentDateAndTimeChange = (date) => {
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
          <Typography
            component="span"
            sx={{
              ...customFontStyles,
              fontSize: "11px",
              fontWeight: 400,
              color: "#939393",
            }}
          >
            {formattedDate}
          </Typography>
          <Typography
            component="span"
            sx={{
              ...customFontStyles,
              fontSize: "13px",
              fontWeight: 400,
              color: "#939393",
            }}
          >
            {", "}
          </Typography>
          <Typography
            component="span"
            sx={{
              ...customFontStyles,
              fontSize: "11px",
              fontWeight: 400,
              color: "#939393",
            }}
          >
            {formattedTime}
          </Typography>
        </>
      );
      // return { formattedDate, formattedTime };
    }
  };

  const getStatusColor = (statusName) => {
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

  // console.log("help msg: ", helperDeployementDateText);

  return (
    <>
      {approverOneModalOpen && (
        <>
          {ReactDOM.createPortal(
            <>
              <AppLoader isLoading={isLoading} />
              <Box
                sx={{
                  position: "fixed",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  backgroundColor: "rgba(0, 0, 0, 0.5)",
                  backdropFilter: "blur(10px)",
                  zIndex: (theme) => theme.zIndex.modal - 10,
                }}
              />
            </>,
            document.body
          )}
        </>
      )}

      <Modal
        open={approverOneModalOpen}
        // onClose={handleApproverOneModalClose}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
        sx={{
          height: "100%",
          overflowY: "scroll",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            top: isViewingDetails
              ? !messageList || messageList?.length === 0
                ? "22%"
                : "10%"
              : isAgmRejected || isAcceptByAppOwnerAndAgm
              ? "1%"
              : "18%",
            left: "50%",
            transform: "translate(-50%, 2%)",
            // width: 400,
            width: "800px",
            height: "auto",
            bgcolor: "#EBF9FD",
            boxShadow: 24,
            p: 4,
            borderRadius: "16px",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexGrow: 1,
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography
              id="modal-title"
              component="div"
              sx={{
                ...customFontStyles,
                color: "#281C61",
                fontSize: "24px",
                fontWeight: 800,
              }}
            >
              {isViewingDetails
                ? `Reference ID : ${rowData?.referenceId || "--"}`
                : `Deployment details`}
            </Typography>

            <IconButton
              onClick={handleApproverOneModalClose}
              sx={{ border: "0.5px solid #281C61" }}
            >
              <CloseIcon sx={{ color: "#281C61", fontSize: "15px" }} />
            </IconButton>
          </Box>

          {isViewingDetails ? null : (
            <Box sx={{ display: "flex", flexGrow: 1 }}>
              <Typography
                sx={{
                  ...customFontStyles,
                  fontSize: "17px",
                  fontWeight: 400,
                  color: "#343a4099",
                }}
              >
                OEM recommneded deployment date:{" "}
                {handleDateChange(rowData?.recommendDate) || "--"}
              </Typography>
            </Box>
          )}

          {isViewingDetails ||
          isAgmRejected ||
          isAppOwnerRejected ||
          isAcceptByAppOwnerAndAgm ? (
            <Grid
              container
              spacing={2}
              sx={{
                marginTop: "1.5em",
                marginBottom: isViewingDetails ? "1em" : 0,
              }}
            >
              {isViewingDetails ? null : (
                <Grid item xs={12} sm={12} md={12} lg={12}>
                  <Typography
                    sx={{
                      ...customFontStyles,
                      color: "#464646",
                      fontSize: "17px",
                    }}
                  >
                    Reference ID: {rowData?.referenceId || "--"}
                  </Typography>
                </Grid>
              )}

              <Grid item xs={3} sm={3} md={3} lg={3}>
                <Box>
                  <Typography
                    sx={{
                      ...customFontStyles,
                      color: "#464646",
                      fontSize: "14px",
                    }}
                  >
                    Created on
                  </Typography>
                  {handleDateAndTimeChange(rowData?.createdAt) || "--"}
                </Box>
              </Grid>

              <Grid item xs={3} sm={3} md={3} lg={3}>
                <Box>
                  <Typography
                    sx={{
                      ...customFontStyles,
                      color: "#464646",
                      fontSize: "14.1px",
                      fontWeight: 600,
                    }}
                  >
                    Type
                  </Typography>
                  <Typography
                    sx={{
                      ...customFontStyles,
                      color: "#7E7E7E",
                      fontSize: "16.3px",
                      fontWeight: 600,
                    }}
                  >
                    {rowData?.recommendationType?.name || "--"}
                  </Typography>
                </Box>
              </Grid>

              <Grid item xs={3} sm={3} md={3} lg={3}>
                <Box>
                  <Typography
                    sx={{
                      ...customFontStyles,
                      color: "#464646",
                      fontSize: "14.1px",
                      fontWeight: 600,
                    }}
                  >
                    Priority
                  </Typography>
                  <Typography
                    sx={{
                      ...customFontStyles,
                      color: "#7E7E7E",
                      fontSize: "16.3px",
                      fontWeight: 600,
                    }}
                  >
                    {rowData?.priority || "--"}
                  </Typography>
                </Box>
              </Grid>

              <Grid item xs={3} sm={3} md={3} lg={3}>
                <Box>
                  <Typography
                    sx={{
                      ...customFontStyles,
                      color: "#464646",
                      fontSize: "14.1px",
                      fontWeight: 600,
                    }}
                  >
                    Recommended end date
                  </Typography>
                  <Typography
                    sx={{
                      ...customFontStyles,
                      color: "#7E7E7E",
                      fontSize: "16.3px",
                      fontWeight: 600,
                    }}
                  >
                    {handleDateChange(rowData?.recommendDate) || "--"}
                  </Typography>
                </Box>
              </Grid>

              <Grid item xs={3} sm={3} md={3} lg={3}>
                <Box>
                  <Typography
                    sx={{
                      ...customFontStyles,
                      color: "#464646",
                      fontSize: "14.1px",
                      fontWeight: 600,
                    }}
                  >
                    Department
                  </Typography>
                  <Typography
                    sx={{
                      ...customFontStyles,
                      color: "#7E7E7E",
                      fontSize: "16.3px",
                      fontWeight: 600,
                    }}
                  >
                    {rowData?.department?.name || "--"}
                  </Typography>
                </Box>
              </Grid>

              <Grid item xs={3} sm={3} md={3} lg={3}>
                <Box>
                  <Typography
                    sx={{
                      ...customFontStyles,
                      color: "#464646",
                      fontSize: "14.1px",
                      fontWeight: 600,
                    }}
                  >
                    Component name
                  </Typography>
                  <Typography
                    sx={{
                      ...customFontStyles,
                      color: "#7E7E7E",
                      fontSize: "16.3px",
                      fontWeight: 600,
                    }}
                  >
                    {rowData?.component?.name || "--"}
                  </Typography>
                </Box>
              </Grid>

              <Grid item xs={3} sm={3} md={3} lg={3}>
                <Box>
                  <Typography
                    sx={{
                      ...customFontStyles,
                      color: "#464646",
                      fontSize: "14.1px",
                      fontWeight: 600,
                    }}
                  >
                    Approver
                  </Typography>
                  <Typography
                    sx={{
                      ...customFontStyles,
                      color: "#7E7E7E",
                      fontSize: "16.3px",
                      fontWeight: 600,
                    }}
                  >
                    {rowData?.approver?.userName || "--"}
                  </Typography>
                </Box>
              </Grid>

              <Grid item xs={3} sm={3} md={3} lg={3}>
                <Box>
                  <Typography
                    sx={{
                      ...customFontStyles,
                      color: "#464646",
                      fontSize: "14.1px",
                      fontWeight: 600,
                    }}
                  >
                    Status
                  </Typography>
                  <Typography
                    sx={{
                      ...customFontStyles,
                      color: getStatusColor(rowData?.status?.statusName),
                      fontSize: "16.3px",
                      fontWeight: 600,
                    }}
                  >
                    {rowData?.status?.statusName || "--"}
                  </Typography>
                </Box>
              </Grid>

              <Grid item xs={3} sm={3} md={3} lg={3}>
                <Box>
                  <Typography
                    sx={{
                      color: "#464646",
                      fontSize: "14.1px",
                      fontWeight: 600,
                    }}
                  >
                    Description
                  </Typography>
                  <Typography
                    sx={{
                      ...customFontStyles,
                      color: "#7E7E7E",
                      fontSize: "16.3px",
                      fontWeight: 600,
                    }}
                  >
                    {rowData?.descriptions || "--"}
                  </Typography>
                </Box>
              </Grid>

              <Grid item xs={3} sm={3} md={3} lg={3}>
                <Box>
                  <Typography
                    sx={{
                      ...customFontStyles,
                      color: "#464646",
                      fontSize: "14.1px",
                      fontWeight: 600,
                    }}
                  >
                    Development start date
                  </Typography>
                  <Typography
                    sx={{
                      ...customFontStyles,
                      color: "#7E7E7E",
                      fontSize: "16.3px",
                      fontWeight: 600,
                    }}
                  >
                    {handleDateChange(
                      rowData?.recommendationDeploymentDetails
                        ?.developmentStartDate
                    ) || "--"}
                  </Typography>
                </Box>
              </Grid>

              <Grid item xs={3} sm={3} md={3} lg={3}>
                <Box>
                  <Typography
                    sx={{
                      ...customFontStyles,
                      color: "#464646",
                      fontSize: "14.1px",
                      fontWeight: 600,
                    }}
                  >
                    Development end date
                  </Typography>
                  <Typography
                    sx={{
                      ...customFontStyles,
                      color: "#7E7E7E",
                      fontSize: "16.3px",
                      fontWeight: 600,
                    }}
                  >
                    {handleDateChange(
                      rowData?.recommendationDeploymentDetails
                        ?.developementEndDate
                    ) || "--"}
                  </Typography>
                </Box>
              </Grid>

              <Grid item xs={3} sm={3} md={3} lg={3}>
                <Box>
                  <Typography
                    sx={{
                      ...customFontStyles,
                      color: "#464646",
                      fontSize: "14.1px",
                      fontWeight: 600,
                    }}
                  >
                    Task completion date
                  </Typography>
                  <Typography
                    sx={{
                      ...customFontStyles,
                      color: "#7E7E7E",
                      fontSize: "16.3px",
                      fontWeight: 600,
                    }}
                  >
                    {handleDateChange(
                      rowData?.recommendationDeploymentDetails
                        ?.testCompletionDate
                    ) || "--"}
                  </Typography>
                </Box>
              </Grid>

              <Grid item xs={3} sm={3} md={3} lg={3}>
                <Box>
                  <Typography
                    sx={{
                      ...customFontStyles,
                      color: "#464646",
                      fontSize: "14.1px",
                      fontWeight: 600,
                    }}
                  >
                    Deployment date
                  </Typography>
                  <Typography
                    sx={{
                      ...customFontStyles,
                      color: "#7E7E7E",
                      fontSize: "16.3px",
                      fontWeight: 600,
                    }}
                  >
                    {handleDateChange(
                      rowData?.recommendationDeploymentDetails?.deploymentDate
                    ) || "--"}
                  </Typography>
                </Box>
              </Grid>

              <Grid item xs={3} sm={3} md={3} lg={3}>
                <Box>
                  <Typography
                    sx={{
                      ...customFontStyles,
                      color: "#464646",
                      fontSize: "14.1px",
                      fontWeight: 600,
                    }}
                  >
                    Impacted department
                  </Typography>
                  <Typography
                    sx={{
                      ...customFontStyles,
                      color: "#7E7E7E",
                      fontSize: "16.3px",
                      fontWeight: 600,
                    }}
                  >
                    {rowData?.impactedDepartment || "--"}
                  </Typography>
                </Box>
              </Grid>

              <Grid item xs={3} sm={3} md={3} lg={3}>
                <Box>
                  <Typography
                    sx={{
                      ...customFontStyles,
                      color: "#464646",
                      fontSize: "14.1px",
                      fontWeight: 600,
                    }}
                  >
                    Past experience comment
                  </Typography>
                  <Typography
                    sx={{
                      ...customFontStyles,
                      color: "#7E7E7E",
                      fontSize: "16.3px",
                      fontWeight: 600,
                    }}
                  >
                    {rowData?.pastExperienceComment || "--"}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          ) : null}

          {isViewingDetails ? (
            <>
              <hr style={{ borderColor: "#FFFFFF", borderWidth: "0.1px" }} />
              <Typography
                sx={{ ...customFontStyles, color: "#464646", fontSize: "17px" }}
              >
                Comment:
              </Typography>
              {messageList && messageList.length > 0 ? (
                <>
                  <Box sx={{ width: "100%" }}>
                    {messageList.map((item, index) => {
                      // console.log(" message list:  ", messageList);
                      return (
                        <div key={index} style={{ marginBottom: "5px" }}>
                          <Typography
                            sx={{ ...customFontStyles, fontSize: "14px" }}
                          >
                            <Typography
                              component="span"
                              sx={{ ...customFontStyles, fontSize: "13px" }}
                            >
                              {item?.createdBy?.userName}
                            </Typography>{" "}
                            (
                            <Typography
                              component="span"
                              sx={{ ...customFontStyles, fontSize: "11px" }}
                            >
                              {item?.createdBy?.userType}
                            </Typography>
                            )
                          </Typography>
                          {item?.rejectionReason && (
                            <Typography
                              sx={{
                                ...customFontStyles,
                                fontSize: "15px",
                                color: "#7E7E7E",
                              }}
                            >
                              {item?.rejectionReason || "--"}
                            </Typography>
                          )}
                          {!item?.rejectionReason && (
                            <Typography
                              sx={{
                                ...customFontStyles,
                                fontSize: "15px",
                                color: "#7E7E7E",
                              }}
                            >
                              {item?.additionalMessage || "--"}
                            </Typography>
                          )}
                          {/* <Typography sx={{ bgcolor:'orange'}}> */}
                          {handleCommentDateAndTimeChange(item?.createdAt) ||
                            "--"}
                          {/* </Typography> */}
                        </div>
                      );
                    })}
                  </Box>
                </>
              ) : (
                <Typography
                  sx={{
                    ...customFontStyles,
                    fontSize: "13px",
                    color: "#49505799",
                  }}
                >
                  (no comments)
                </Typography>
              )}
            </>
          ) : (
            <Grid container spacing={5} sx={{ marginTop: "1px" }}>
              {loggedUserType !== AGM && (
                <>
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
                          label="Deployment start date"
                          format="DD-MM-YYYY"
                          slots={{
                            openPickerIcon: () => (
                              <CalendarMonthIcon sx={{ color: "#281C61" }} />
                            ),
                          }}
                          // required
                          // value={revertedFormData.developmentStartDate}
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
                              // required: true,
                            },
                          }}
                          onChange={(date) =>
                            setFormData({
                              ...formData,
                              developmentStartDate:
                                handleFormDataDateChange(date),
                            })
                          }
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
                          label="Deployment end date"
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
                              // required: true,
                            },
                          }}
                          onChange={(date) =>
                            setFormData({
                              ...formData,
                              developmentEndDate:
                                handleFormDataDateChange(date),
                            })
                          }
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
                              // required: true,
                            },
                          }}
                          onChange={(date) =>
                            setFormData({
                              ...formData,
                              testCompletionDate:
                                handleFormDataDateChange(date),
                            })
                          }
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
                              helperText: isDeploymentDateAhead
                                ? `*OEM recommended deployment date (${handleDateChange(
                                    rowData?.recommendDate
                                  )}). This breaches the OEM recommended deployment date.`
                                : "",
                              FormHelperTextProps: {
                                sx: {
                                  color: "#281C61",
                                  marginTop: "10px",
                                  fontSize: "11px",
                                },
                              },
                              variant: "standard",
                              InputProps: {
                                disableUnderline: true,
                              },

                              sx: { height: "3.5em", width: "100%" },
                              // required: true,
                            },
                          }}
                          onChange={(date) => {
                            const selectedDate = handleFormDataDateChange(date);
                            setFormData({
                              ...formData,
                              deploymentDate: handleFormDataDateChange(date),
                            });

                            // debugger;

                            if (selectedDate && rowData?.recommendDate) {
                              const recommendedDate = dayjs(
                                rowData?.recommendDate
                              );

                              const comparedSelectedDate = date
                                ? dayjs(date)
                                : null;

                              if (
                                dayjs.isDayjs(recommendedDate) &&
                                dayjs.isDayjs(comparedSelectedDate)
                              ) {
                                // const selectedDayjs = dayjs(
                                //   selectedDate.format("YYYY-MM-DD")
                                // );

                                if (
                                  comparedSelectedDate.isAfter(recommendedDate)
                                ) {
                                  setIsDeploymentDateAhead(true);
                                } else {
                                  setIsDeploymentDateAhead(false);
                                }
                              } else {
                                setIsDeploymentDateAhead(false); // Reset the state to avoid lingering state
                              }
                            } else {
                              setIsDeploymentDateAhead(false); // Reset the state to avoid lingering state
                            }
                          }}
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
                      {/* FOR MULTIPLE */}

                      <FormControl
                        variant="standard"
                        sx={{
                          width: "100%",
                          height: "3.5em",
                          maxHeight: "3.5em",
                        }}
                        fullWidth
                        // required
                      >
                        <InputLabel htmlFor="demo-simple-select-standard-label">
                          Department
                        </InputLabel>
                        <Select
                          multiple
                          labelId="demo-simple-select-standard-label"
                          id="demo-simple-select-standard"
                          disableUnderline={true}
                          // multiple
                          value={impactedDepartmentName || []}
                          onChange={handleDepartmentChange}
                          label="Department"
                          renderValue={(selected) =>
                            selected.map((dept) => dept.name).join(", ")
                          }
                          MenuProps={{
                            PaperProps: {
                              style: {
                                maxHeight: 48 * 4.5 + 8,
                                width: 250,
                                marginTop: 5,
                              },
                              variant: "standard",
                            },
                          }}
                        >
                          {departments?.map((item) => (
                            <MenuItem
                              key={item?.id}
                              value={item}
                              sx={{
                                height: "40px",
                                fontSize: "12px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                padding: "8px",
                              }}
                            >
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                }}
                              >
                                <Checkbox
                                  checked={
                                    !!(
                                      impactedDepartmentName &&
                                      impactedDepartmentName.some(
                                        (dept) => dept.id === item.id
                                      )
                                    )
                                  }
                                  style={{
                                    color: !!(
                                      impactedDepartmentName &&
                                      impactedDepartmentName.some(
                                        (dept) => dept.id === item.id
                                      )
                                    )
                                      ? "#3f51b5"
                                      : "#ccc",
                                  }}
                                  onChange={(event) =>
                                    handleDepartmentCheckboxChange(event, item)
                                  }
                                />
                                <ListItemText
                                  primary={
                                    <Typography
                                      variant="body2"
                                      sx={{
                                        fontSize: "12px",
                                        color:
                                          impactedDepartmentName.indexOf(
                                            item?.name
                                          ) > -1
                                            ? "#464646"
                                            : "#7E7E7E",
                                      }}
                                    >
                                      {item?.name}
                                    </Typography>
                                  }
                                />
                              </div>
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>

                      {/* FOR SOLO */}

                      {/* <FormControl
                variant="standard"
                sx={{ width: "100%", height: "3.5em", maxHeight: "3.5em" }}
                fullWidth
                required
              >
                <InputLabel htmlFor="demo-simple-select-standard-label">
                  Department
                </InputLabel>
                <Select
                  labelId="demo-simple-select-standard-label"
                  id="demo-simple-select-standard"
                  disableUnderline={true}
                  value={impactedDepartmentName || ""}
                  onChange={handleDepartmentChange}
                  label="Department"
                  renderValue={(selected) => selected.name}
                  MenuProps={{
                    PaperProps: {
                      style: {
                        maxHeight: 48 * 4.5 + 8,
                        width: 250,
                        marginTop: 5,
                      },
                      variant: "standard",
                    },
                  }}
                >
                  {departments?.map((item) => (
                    <MenuItem
                      key={item.id}
                      value={item}
                      sx={{
                        height: "40px",
                        fontSize: "12px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "8px",
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <Checkbox
                          checked={
                            Array.isArray(impactedDepartmentName) &&
                            impactedDepartmentName.indexOf(item?.name) > -1
                          }
                          style={{
                            color:
                              Array.isArray(impactedDepartmentName) &&
                              impactedDepartmentName.indexOf(item?.name) > -1
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
                                  impactedDepartmentName &&
                                  impactedDepartmentName.id === item.id
                                    ? "#464646"
                                    : "#7E7E7E",
                              }}
                            >
                              {item.name}
                            </Typography>
                          }
                        />
                      </div>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl> */}
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
                        variant="standard" // <== changed this
                        // variant='outlined'
                        value={formData.globalSupportNumber || ""}
                        size="small"
                        // required
                        fullWidth
                        id="refNumber"
                        name="globalSupportRefNumber"
                        label="Global support reference number"
                        InputProps={{
                          // endAdornment: <AccountCircle />, // <== adjusted this
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

              {isAgmRejected ||
              isAppOwnerRejected ||
              isAcceptByAppOwnerAndAgm ? (
                <>
                  <Grid item xs={12} sm={12} md={12} lg={12}>
                    <Typography
                      sx={{
                        ...customFontStyles,
                        color: "#464646",
                        fontSize: "17px",
                        marginBottom: "1px",
                      }}
                    >
                      Comment:
                    </Typography>
                    <CommentTimeLine messageList={messageList} />
                  </Grid>

                  <Grid item xs={12} sm={12} md={12} lg={12}>
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
                          ...customFontStyles,
                          resize: "none",
                          width: "95%",
                          background: "#FFFFFF00",
                          border: "0.1px solid #281C61 !important",
                          borderRadius: "16px",
                          minHeight: "5em",
                          maxHeight: "5em",
                          fontSize: "17px",
                          color: "#2E2E2E",
                          padding: "7px 15px",
                          boxSizing: "border-box",
                        }}
                        maxRows={4}
                        maxLength={220}
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
                    disabled={isButtonLoading}
                    sx={{
                      ...customFontStyles,
                      bgcolor: "#281C61",
                      borderRadius: "12px",
                      // paddingX: "32px",
                      paddingY: "17px",
                      // width: "100%",
                      minWidth: "16em",
                      maxWidth: "16em",
                      minHeight: "58px",
                      maxHeight: "58px",
                      fontSize: "17px",
                      fontWeight: 600,
                      "&:hover": { bgcolor: "#322475", overflow: "hidden" },
                      "&:disabled": {
                        background: "#E0E0E0",
                        // color: "#B5B5B5"
                      },
                    }}
                    onClick={
                      loggedUserType === APPLICATION_OWNER
                        ? handleAppOwnerApprove
                        : loggedUserType === AGM
                        ? isAppOwnerRejected
                          ? handleRevertByAgm
                          : handleSubmitApproveByAgm
                        : null
                    }
                  >
                    {isButtonLoading ? (
                      <CircularProgress
                        size="2.3em"
                        sx={{ color: "#818181" }}
                      />
                    ) : (
                      (loggedUserType === APPLICATION_OWNER &&
                        "SEND FOR APPROVAL") ||
                      (loggedUserType === AGM
                        ? isAppOwnerRejected
                          ? "REVERT"
                          : "APPROVE"
                        : "")
                    )}

                    {/* {loggedUserType === APPLICATION_OWNER
                    ? "SEND FOR APPROVAL"
                    : loggedUserType === AGM
                    ? isAppOwnerRejected
                      ? "REVERT"
                      : "APPROVE"
                    : ""} */}
                  </Button>
                </Box>
              </Grid>
            </Grid>
          )}
        </Box>
      </Modal>
    </>
  );
};

export default DetailedModal;
