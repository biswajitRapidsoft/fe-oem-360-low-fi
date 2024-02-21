import React, { useState } from "react";
import CloseIcon from "@mui/icons-material/Close";

import { RejectModalAction } from "../actions/rejectModalAction";

import { AGM, APPLICATION_OWNER } from "../constants/constant";
import {
  Box,
  TextField,
  Typography,
  IconButton,
  Grid,
  Button,
} from "@mui/material";
import Modal from "@mui/material/Modal";
import AlertComponent from "../components/AlertComponent";

const RejectModal = (props) => {
  const {
    rowData,
    approverTwoModalOpen,
    handleApproverTwoModalClose,
    snackbarOpen,
    snackbarMessage,
    snackbarSeverity,
    setSnackbarOpen,
    setSnackbarMessage,
    setSnackbarSeverity,
  } = props;

  // snackbar useState in reject modal
  // const [rejectSnackBarOpen, setRejectSnackBarOpen] = useState(false);
  // const [rejectSnackBarMessage, setRejectSnackBarMessage] = useState("");
  // const [rejectSnackbarSeverity, setRejectSnackbarSeverity] =
  //   useState("success");

  const loginInfo = JSON.parse(sessionStorage.getItem("loginresponse"));
  const loggedUserId = loginInfo?.id || null;
  const loggedUserType = loginInfo?.userType || "";

  const [formData, setFormData] = useState({
    createdBy: {
      id: loggedUserId,
    },
    recommendRefId: rowData?.referenceId || "",
    rejectionMessage: "",
    additionalInformation: "",
  });

  // appowner rejection function
  const handleRejectByAppOwner = async (e) => {
    e.preventDefault();

    const payload = {
      createdBy: {
        id: formData.createdBy.id,
      },
      recommendRefId: formData.recommendRefId,
      rejectionMessage: formData.rejectionMessage,
      additionalInformation: formData.additionalInformation,
    };
    if (!formData.rejectionMessage) {
      // setRejectSnackBarMessage("Please enter rejection message");
      // setRejectSnackBarOpen(true);
      // setRejectSnackbarSeverity("warning");
      alert("please enter rejection message");
      console.error("please enter rejection message");
    }
    try {
      const res = await RejectModalAction.handleRejectByAppOwner(payload);

      if (res && (res.status === 200 || res.status === 201)) {
        setSnackbarMessage(res.data.message);
        setSnackbarSeverity("success");
        setSnackbarOpen(true);

        handleApproverTwoModalClose();
      } else {
        console.log("error in rejection", res);
        setSnackbarMessage(res.data.message);
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
        // handleApproverOneModalClose();
        // setTimeout(() => {
        handleApproverTwoModalClose();
        // }, 2000);
        // alert(res.data.message);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // agm rejection function
  const handleRejectByAgm = async (e) => {
    e.preventDefault();

    const payload = {
      createdBy: {
        id: formData.createdBy.id,
      },
      recommendRefId: formData.recommendRefId,
      rejectionMessage: formData.rejectionMessage,
      additionalInformation: formData.additionalInformation,
    };
    if (!formData.rejectionMessage) {
      alert("please enter rejection message");
      console.error("please enter rejection message");
    }
    // console.log("agm rejection payload", payload);

    try {
      const res = await RejectModalAction.handleRejectByAgm(payload);

      if (res && (res.status === 200 || res.status === 201)) {
        setSnackbarMessage(res.data.message);
        setSnackbarSeverity("success");
        setSnackbarOpen(true);
        handleApproverTwoModalClose();
      } else {
        console.log("error in reject by AGM", res);
        setSnackbarMessage(res.data.message);
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
        handleApproverTwoModalClose();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // const handleSnackbarClose = () => {
  //   setSnackbarOpen(false);
  // };

  return (
    <Modal
      open={approverTwoModalOpen}
      onClose={handleApproverTwoModalClose}
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
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
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "700px",
          height: "330px",
          bgcolor: "#EBF9FD",
          // bgcolor: "yellow",
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
              color: "#281C61",
              fontSize: "24px",
              fontWeight: "200",
            }}
          >
            Comments
          </Typography>
          <IconButton
            onClick={handleApproverTwoModalClose}
            sx={{ border: "0.5px solid #281C61" }}
          >
            <CloseIcon sx={{ color: "#281C61", fontSize: "0.5em" }} />
          </IconButton>
        </Box>

        <form>
          <Grid container spacing={4}>
            <Grid item xs={12}>
              <TextField
                id="rejectionReason"
                fullWidth
                label="Reason for rejection"
                variant="standard"
                required
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    rejectionMessage: e.target.value,
                  })
                }
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                id="additionalComments"
                fullWidth
                label="Additional comments"
                variant="standard"
                required
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    additionalInformation: e.target.value,
                  })
                }
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                variant="contained"
                sx={{
                  bgcolor: "#281C61",
                  borderRadius: "10px",
                  fontSize: "13px",
                  height: "4em",
                  width: "10em",
                  fontWeight: 500,
                  marginLeft: "40%",
                }}
                onClick={
                  loggedUserType === AGM
                    ? handleRejectByAgm
                    : loggedUserType === APPLICATION_OWNER
                    ? handleRejectByAppOwner
                    : null
                }
              >
                SUBMIT
              </Button>
            </Grid>
          </Grid>
        </form>

        {/* <AlertComponent
          open={snackbarOpen}
          handleClose={handleSnackbarClose}
          severity={snackbarSeverity}
          message={snackbarMessage}
        /> */}
      </Box>
    </Modal>
  );
};

export default RejectModal;
