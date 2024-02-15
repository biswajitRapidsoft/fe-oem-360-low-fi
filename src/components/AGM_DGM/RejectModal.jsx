import React from "react";
import { useState, useEffect } from "react";

import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import { TextField } from "@mui/material";
import axios from "axios";
import config from "../../config/config";
import { RejectModalAction } from "../../actions/RejectModalAction";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
//loader
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";

const RejectModal = ({
  open,
  onClose,
  row,
  fetchDataAppOwner,
  fetchApprovedListAppOwner,
  fetchDataAgm,
  fetchDataPiechart,
}) => {
  const [reason, setReason] = useState("");
  const [comments, setComments] = useState("");
  const datas = sessionStorage.getItem("data");
  const data = JSON.parse(datas);
  const token = data.token;
  const id = data.id;
  const userType = data.userType;

  //loader
  const [openLoader, setOpenLoader] = React.useState(false);
  const [buttonDisabled, setButtonDisabled] = useState(false);

  const handleClose = () => {
    setOpenLoader(false);
  };

  const handleSubmit = async () => {
    // const submitUrl =`http://192.168.12.54:9092/recommendation/reject/by/agm`

    // let submitUrl
    //   if(userType === 'AGM'){
    //      submitUrl = config.baseUrl + config.apiEndPoints.rejectByAgm
    //   }
    //   else if(userType === 'APPLICATION_OWNER'){
    //      submitUrl = config.baseUrl + config.apiEndPoints.rejectByAppOwner
    //   }
    setOpenLoader(true);
    const payload = {
      recommendRefId: row.ReferenceId,
      createdBy: {
        id: id,
      },
      rejectionMessage: reason,
      addtionalInformation: comments,
    };

    if (userType === "AGM") {
      const response = await RejectModalAction.SubmitRejectAgm(payload);
      if (response.data.responseCode === 200) {
        setOpenLoader(false);
        toast(response.data.message);
        fetchDataAgm();
        fetchDataPiechart();
        setReason("");
        setComments("");
        onClose();
      } else {
        setOpenLoader(false);
        alert(response.data.message);
      }
    }
    if (userType === "APPLICATION_OWNER") {
      const response = await RejectModalAction.SubmitRejectAppOwner(payload);
      if (response.data.responseCode === 200) {
        setOpenLoader(false);
        toast(response.data.message);
        fetchDataAppOwner();
        fetchApprovedListAppOwner();
        setReason("");
        setComments("");
        onClose();
      } else {
        setOpenLoader(false);
        alert(response.data.message);
      }
    }

    // axios.post(submitUrl,payload, {
    //   headers: {
    //     Authorization: `Bearer ${token} `,
    //   },
    // })

    // .then((response)=>{
    //   if(response.responseCode === 200){
    //     alert(response.responseCode.message)

    //   }

    // })
    // .catch((error)=>{
    //   console.log(error)

    // })
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 780,
          height: 404,
          bgcolor: "#EBF9FD",
          // border: "2px solid #000",
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
          <Typography
            id="modal-modal-title"
            variant="h6"
            component="h2"
            sx={{ color: "#281C61", fontSize: "24px", fontWeight: 600 }}
          >
            Comments
          </Typography>

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

        <Box sx={{ display: "flex", flexDirection: "column", gap: 7 }}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 5 }}>
            {/* <Typography sx={{ marginTop: 3 }}>Reason For Rejection</Typography> */}
            <TextField
              id="standard-basic"
              label="Reason For Rejection"
              required
              variant="standard"
              sx={{ marginTop: 3 }}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            ></TextField>
          </Box>

          <TextField
            id="standard-basic"
            label="Additional Comments"
            variant="standard"
            value={comments}
            onChange={(e) => setComments(e.target.value)}
          ></TextField>
        </Box>

        {/* <Typography id="modal-modal-description" sx={{ mt: 2 }}>
          Add your reject reason here.
        </Typography> */}
        {/* <Button onClick={onClose}>Close Modal</Button> */}

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
            onClick={handleSubmit}
          >
            Submit
          </Button>
        </Box>

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

export default RejectModal;
