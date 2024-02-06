import React, { useState } from "react";
import ReactDOM from "react-dom";
import {
  Box,
  Button,
  Grid,
  IconButton,
  Modal,
  TextField,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import CircularProgress from "@mui/material/CircularProgress";

import RejectModalAction from "../../actions/rejectModalAction";
import { AGM, APPLICATION_OWNER } from "../../helper/constant";
import { toast } from "react-toastify";
import AppLoader from "../AppLoader/AppLoader";

const customFontStyles = {
  fontFamily: "Open Sans !important",
  fontWeight: 600,
};

const RejectModal = (props) => {
  const {
    rowData,
    approverTwoModalOpen,
    handleApproverTwoModalClose,
    fetchAllPendingRecommendationForAppOwner,
    fetchAllApprovedRecommendationForAppOwner,
    fetchRecommendationAgmAndOem,
  } = props;
  const loginData = JSON.parse(sessionStorage.getItem("loginData"));
  const loggedUserId = loginData?.id || null;
  const loggedUserType = loginData?.userType || "";
  const initialFormData = {
    createdBy: {
      id: loggedUserId,
    },
    recommendRefId: rowData?.referenceId || "",
    rejectionMessage: "",
    additionalInformation: "",
  };

  const [formData, setFormData] = useState(initialFormData);
  const [isButtonLoading, setIsButtonLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  // console.log("form data:  ", formData)

  const handleRejectByAgm = async (e) => {
    e.preventDefault();
    const trimmedRejectionMessage = formData.rejectionMessage
      ? formData.rejectionMessage.trim()
      : "";

    const trimmedAdditionalInformation = formData.additionalInformation
      ? formData.additionalInformation.trim()
      : "";

    if (!trimmedRejectionMessage) {
      toast.warn("Please provide a message of rejection !", {
        toastId: "reject-warn01",
      });
      return;
    }

    const payload = {
      createdBy: {
        id: formData.createdBy.id,
      },
      recommendRefId: formData.recommendRefId,
      rejectionMessage: trimmedRejectionMessage,
      additionalInformation: trimmedAdditionalInformation,
    };

    // console.log(" rejected by agm payload:  ", payload);

    // return;

    try {
      // setIsButtonLoading(true);
      setIsLoading(true);
      const response = await RejectModalAction.funcRejectByAgm(payload);

      let toastMessge = "";

      if (response && (response.status === 200 || response.status === 201)) {
        // console.log("rejected by agm response", response);

        toastMessge = response?.data?.message;
        const cleanedMessage = JSON.stringify(toastMessge);
        toast.success(JSON.parse(cleanedMessage), {
          toastId: "rejectAgm-success01",
        });
        handleApproverTwoModalClose();
        setFormData(initialFormData);
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
            toastId: "rejectAgm-err01",
          });
          // console.error("RESPONSE MSG:  ", response.data.message);
        } else {
          toastMessge = response?.message;
          const cleanedMessage = JSON.stringify(toastMessge);
          toast.error(JSON.parse(cleanedMessage), {
            toastId: "rejectAgm-err02",
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

  const handleRejectByAppOwner = async (e) => {
    e.preventDefault();

    const trimmedRejectionMessage = formData.rejectionMessage
      ? formData.rejectionMessage.trim()
      : "";

    const trimmedAdditionalInformation = formData.additionalInformation
      ? formData.additionalInformation.trim()
      : "";

    if (!trimmedRejectionMessage) {
      toast.warn("Please provide a message of rejection !", {
        toastId: "reject-warn02",
      });
      return;
    }

    const payload = {
      createdBy: {
        id: formData.createdBy.id,
      },
      recommendRefId: formData.recommendRefId,
      rejectionMessage: trimmedRejectionMessage,
      additionalInformation: trimmedAdditionalInformation,
    };

    // console.log(" rejected by APP_OWNER payload:  ", payload);

    // return;

    try {
      // setIsButtonLoading(true);
      setIsLoading(true);
      const response = await RejectModalAction.funcRejectByAppOwner(payload);

      let toastMessge = "";

      if (response && (response.status === 200 || response.status === 201)) {
        // console.log("rejected by APP_OWNER response", response);

        toastMessge = response?.data?.message;
        const cleanedMessage = JSON.stringify(toastMessge);
        toast.success(JSON.parse(cleanedMessage), {
          toastId: "rejectAppOwner-success01",
        });
        handleApproverTwoModalClose();
        setFormData(initialFormData);
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
            toastId: "rejectAppOwner-err01",
          });
          // console.error("RESPONSE MSG:  ", response.data.message);
        } else {
          toastMessge = response?.message;
          const cleanedMessage = JSON.stringify(toastMessge);
          toast.error(JSON.parse(cleanedMessage), {
            toastId: "rejectAppOwner-err02",
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

  return (
    <>
      {approverTwoModalOpen && (
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
        open={approverTwoModalOpen}
        // onClose={handleApproverTwoModalClose}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            // width: 400,
            width: "700px",
            height: "330px",
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
              marginBottom: "1.5em",
            }}
          >
            <Typography
              id="modal-title"
              component="div"
              sx={{
                ...customFontStyles,
                color: "#281C61",
                fontSize: "24px",
              }}
            >
              Comments
            </Typography>

            <IconButton
              onClick={handleApproverTwoModalClose}
              sx={{ border: "0.5px solid #281C61" }}
            >
              <CloseIcon sx={{ color: "#281C61", fontSize: "15px" }} />
            </IconButton>
          </Box>
          <form>
            <Grid container spacing={4}>
              <Grid item xs={12} sm={12} md={12} lg={12}>
                <TextField
                  id="rejectionReason"
                  label="Reason for rejection"
                  variant="standard"
                  fullWidth
                  // required
                  size="large"
                  //   sx={{...customFontStyles}}
                  InputProps={{
                    style: {
                      ...customFontStyles,
                      color: "#515354",
                      fontSize: "16px",
                    },
                  }}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      rejectionMessage: e.target.value,
                    })
                  }
                />
              </Grid>

              <Grid item xs={12} sm={12} md={12} lg={12}>
                <TextField
                  id="additionalComments"
                  label="Additional comments"
                  variant="standard"
                  fullWidth
                  size="large"
                  //   sx={{...customFontStyles}}
                  InputProps={{
                    style: {
                      ...customFontStyles,
                      color: "#515354",
                      fontSize: "16px",
                    },
                  }}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      additionalInformation: e.target.value,
                    })
                  }
                />
              </Grid>

              <Grid item xs={12} sm={12} md={12} lg={12}>
                <Box
                  sx={{
                    display: "flex",
                    flexGrow: 1,
                    justifyContent: "center",
                    alignItems: "center",
                    marginTop: "2em",
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
                      minWidth: "13em",
                      maxWidth: "13em",
                      minHeight: "58px",
                      maxHeight: "58px",
                      fontSize: "16px",
                      fontWeight: 600,
                      "&:hover": { bgcolor: "#322475", overflow: "hidden" },
                      "&:disabled": {
                        background: "#E0E0E0",
                        // color: "#B5B5B5"
                      },
                    }}
                    onClick={
                      loggedUserType === AGM
                        ? handleRejectByAgm
                        : loggedUserType === APPLICATION_OWNER
                        ? handleRejectByAppOwner
                        : null
                    }
                  >
                    {isButtonLoading ? (
                      <CircularProgress
                        size="2.3em"
                        sx={{ color: "#818181" }}
                      />
                    ) : (
                      "SUBMIT"
                    )}
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </form>
        </Box>
      </Modal>
    </>
  );
};

export default RejectModal;
