import { Box, Grid, IconButton, Modal, Typography } from "@mui/material";
import React from "react";
import CloseIcon from "@mui/icons-material/Close";

const customFontStyles = {
  fontFamily: "Open Sans !important",
  fontWeight: 600,
  fontSize: "14px",
};

const NotificationViewModal = (props) => {
  const { notiViewModalData, notiViewModalOpen, handlenotiViewModalClose } =
    props;

  // console.log(" noti prop data:  ", notiViewModalData);

  // console.log("noti open:  ", notiViewModalOpen);

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
            component="span"
            sx={{ ...customFontStyles, fontSize: "14px", color: "#7E7E7E" }}
          >
            {formattedDate}
          </Typography>
          <Typography
            component="span"
            sx={{ ...customFontStyles, fontSize: "14px", color: "#7E7E7E" }}
          >
            {" "}
          </Typography>
          <Typography
            component="span"
            sx={{ ...customFontStyles, fontSize: "14px", color: "#7E7E7E" }}
          >
            {formattedTime}
          </Typography>
        </>
      );

      // return { formattedDate, formattedTime };
    }
  };

  return (
    <>
      <Modal
        open={true}
        onClose={handlenotiViewModalClose}
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
                fontWeight: 800,
              }}
            >
              Reference ID : {notiViewModalData?.referenceId}
            </Typography>

            <IconButton
              onClick={handlenotiViewModalClose}
              sx={{ border: "0.5px solid #281C61" }}
            >
              <CloseIcon sx={{ color: "#281C61", fontSize: "15px" }} />
            </IconButton>
          </Box>
          <Grid container spacing={4} sx={{ marginTop: "2em" }}>
            <Grid item xs={12} sm={12} md={12} lg={12}>
              <Typography
                sx={{ ...customFontStyles, fontSize: "16px", color: "#464646" }}
              >
                Message:
              </Typography>
              <Typography
                sx={{ ...customFontStyles, fontSize: "14px", color: "#7E7E7E" }}
              >
                {notiViewModalData?.message}
              </Typography>
            </Grid>

            <Grid item xs={12} sm={12} md={12} lg={12}>
              <Typography
                sx={{ ...customFontStyles, fontSize: "16px", color: "#464646" }}
              >
                Time:
              </Typography>
              <Typography
                sx={{ ...customFontStyles, fontSize: "14px", color: "#7E7E7E" }}
              >
                {handleDateAndTimeChange(notiViewModalData?.updatedAt) || "NA"}
              </Typography>
            </Grid>
          </Grid>
        </Box>
      </Modal>
      {notiViewModalOpen && (
        <Box
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.5)", // Adjust the color and transparency
            backdropFilter: "blur(10px)", // Adjust the blur strength
            zIndex: (theme) => theme.zIndex.modal - 10,
          }}
        />
      )}
    </>
  );
};

export default NotificationViewModal;
