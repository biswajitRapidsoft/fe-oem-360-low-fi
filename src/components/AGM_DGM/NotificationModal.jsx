import React from "react";
import { useState, useEffect } from "react";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import Typography from "@mui/material/Typography";
import { Box, Button } from "@mui/material";
import { NotificationModalAction } from "../../actions/NotificationModalAction";
import NewModal from "./NewModal";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import config from "../../config/config";
import axios from "axios";

function NotificationModal({ isOpen, onClose, recommendations }) {
  //token
  const datas = sessionStorage.getItem("data");
  const data = JSON.parse(datas);
  const token = data.token;
  const userType = data.userType;
  const userName = data.userName;
  const id = data.id;

  const [isViewDetailsModalOpen, setIsViewDetailsModalOpen] = useState(false);
  const [selectedRecommendation, setSelectedRecommendation] = useState(null);
  const [selectedRecommendationId, setSelectedRecommendationId] =
    useState(null);

  const handleViewDetailsClick = (recommendation) => {
    setSelectedRecommendation(recommendation);
    setSelectedRecommendationId(recommendation.id);

    seenNotification(recommendation.id);

    setIsViewDetailsModalOpen(true);
  };

  const handleCloseViewDetailsModal = () => {
    setIsViewDetailsModalOpen(false);
    onClose();
  };

  const seenNotification = async (id) => {
    try {
      // const seenNotificationUrl =
      //   config.baseUrl +
      //   config.apiEndPoints.notificationMarkSeen +
      //   `?id=` +
      //   `${id}`;

      // const response = await axios.post(seenNotificationUrl, null, {
      //   headers: {
      //     Authorization: `Bearer ${token}`,
      //   },
      // });
      const payload = {
        id: id,
      };

      const response = await NotificationModalAction.seenNotification(payload);
      if (response.status === 200) {
        console.log(response);
      }
    } catch (error) {
      toast.error(error.response.data.message);
      console.log("Error marking notification as seen:", error);
    }
  };

  return (
    <>
      <Dialog
        open={isOpen}
        onClose={onClose}
        sx={{
          // maxWidth: "35vw",
          width: "40vw",
          maxHeight: "50vh",
          // overflowY: "auto",
          position: "absolute",
          top: "5%",
          left: "50%",
          // transform: "translate(-10%, -20%)",
          boxShadow: "none",
        }}
      >
        <DialogContent dividers>
          {recommendations.length === 0 ? (
            <Box
              sx={{
                width: "10vw",
                height: "5vh",
                top: 0,
                backgroundColor: "",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Typography sx={{ fontSize: "20px", alignSelf: "center" }}>
                No new notifications
              </Typography>
            </Box>
          ) : (
            recommendations.map((recommendation) => (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  gap: 2,
                }}
                key={recommendation.id}
              >
                <Box>
                  <Typography gutterBottom>{recommendation.message}</Typography>
                </Box>

                <Box>
                  <Button
                    sx={{ width: "8vw", height: "3vh" }}
                    variant="outlined"
                  >
                    <Typography
                      fontSize="12px"
                      onClick={() => handleViewDetailsClick(recommendation)}
                    >
                      View Details
                    </Typography>
                  </Button>
                </Box>
              </Box>
            ))
          )}
        </DialogContent>
      </Dialog>
      <NewModal
        isOpen={isViewDetailsModalOpen}
        onClose={handleCloseViewDetailsModal}
        recommendation={selectedRecommendation}
      />
    </>
  );
}

export default NotificationModal;
