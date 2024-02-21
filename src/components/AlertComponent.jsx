import React from "react";
import ReactDOM from "react-dom";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

const AlertComponent = ({ open, message, severity, handleClose }) => {
  return ReactDOM.createPortal(
    <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
      <Alert
        onClose={handleClose}
        severity={severity}
        variant="filled"
        sx={{ width: "100%" }}
      >
        {message}
      </Alert>
    </Snackbar>,
    document.getElementById("portal")
  );
};

export default AlertComponent;
