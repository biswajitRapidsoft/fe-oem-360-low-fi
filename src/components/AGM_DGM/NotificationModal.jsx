import React from "react";
import { useState, useEffect } from "react";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import Typography from "@mui/material/Typography";
import { Box, Button, Paper } from "@mui/material";
import { NotificationModalAction } from "../../actions/NotificationModalAction";
import NewModal from "./NewModal";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import config from "../../config/config";
import axios from "axios";
import Avatar from "@mui/material/Avatar";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";

import Tooltip from "@mui/material/Tooltip";
import PersonAdd from "@mui/icons-material/PersonAdd";
import Settings from "@mui/icons-material/Settings";
import Logout from "@mui/icons-material/Logout";

import "../../css/NotificationModal.css";

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

  //menue item
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = isOpen;
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const seenNotification = async (id) => {
    try {
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
      {/* <Dialog
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
          backgroundColor: "yellow",
        }}
      >
        <DialogContent dividers sx={{ backgroundColor: "blue" }}>
          {recommendations.length === 0 ? (
            <Box
              sx={{
                width: "10vw",
                height: "5vh",
                top: 0,
                backgroundColor: "red",
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
      /> */}
      <React.Fragment>
        {/* <Menu
          anchorEl={anchorEl}
          id="account-menu"
          open={open}
          onClose={handleClose}
          onClick={handleClose}
          PaperProps={{
            elevation: 0,
            sx: {
              overflow: "visible",
              filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
              mt: 1.5,
              "& .MuiAvatar-root": {
                width: 32,
                height: 32,
                ml: -0.5,
                mr: 1,
              },
              "&::before": {
                content: '""',
                display: "block",
                position: "absolute",
                top: 0,
                right: 14,
                width: 10,
                height: 10,
                bgcolor: "background.paper",
                transform: "translateY(-50%) rotate(45deg)",
                zIndex: 0,
              },
            },
          }}
          transformOrigin={{ horizontal: "right", vertical: "top" }}
          anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        > */}
        {recommendations.length !== 0 && (
          <Menu
            anchorEl={anchorEl}
            id="account-menu"
            open={open}
            onClose={onClose}
            onClick={handleClose}
            PaperProps={{
              elevation: 0,
              sx: {
                overflow: "visible",
                filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                mt: 1.5,
                "& .MuiAvatar-root": {
                  width: 32,
                  height: 32,
                  ml: -0.5,
                  mr: 1,
                },
                "&::before": {
                  content: '""',
                  display: "block",
                  position: "absolute",
                  top: 0,
                  right: 14,
                  width: 10,
                  height: 10,
                  bgcolor: "background.paper",
                  transform: "translateY(-50%) rotate(45deg)",
                  zIndex: 0,
                },
              },
            }}
            transformOrigin={{ horizontal: "left", vertical: "top" }}
            anchorOrigin={{ horizontal: "left", vertical: "top" }}
            sx={{ marginLeft: "34%", top: "3.5%" }}
          >
            <Box sx={{ maxHeight: 250, overflow: "auto" }}>
              {recommendations.map((recommendation) => (
                <MenuItem
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    gap: 2,
                    overflowY: "auto",
                  }}
                  key={recommendation.id}
                >
                  <Box>
                    <Typography gutterBottom>
                      {recommendation.message}
                    </Typography>
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
                </MenuItem>
              ))}
            </Box>
          </Menu>
        )}
        {recommendations.length === 0 && (
          <Menu
            anchorEl={anchorEl}
            id="account-menu"
            open={open}
            onClose={onClose}
            onClick={handleClose}
            PaperProps={{
              elevation: 0,
              sx: {
                overflow: "visible",
                filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                mt: 1.5,
                "& .MuiAvatar-root": {
                  width: 32,
                  height: 32,
                  ml: -0.5,
                  mr: 1,
                },
                "&::before": {
                  content: '""',
                  display: "block",
                  position: "absolute",
                  top: 0,
                  right: 14,
                  width: 10,
                  height: 10,
                  bgcolor: "background.paper",
                  transform: "translateY(-50%) rotate(45deg)",
                  zIndex: 0,
                },
              },
            }}
            transformOrigin={{ horizontal: "left", vertical: "top" }}
            anchorOrigin={{ horizontal: "left", vertical: "top" }}
            sx={{ marginLeft: "62%", top: "3.5%" }}
          >
            <Box>
              <MenuItem
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
                <Typography sx={{ fontSize: "17px", alignSelf: "center" }}>
                  No new notifications
                </Typography>
              </MenuItem>
            </Box>
          </Menu>
        )}
        {/* </Menu> */}
      </React.Fragment>

      <NewModal
        isOpen={isViewDetailsModalOpen}
        onClose={handleCloseViewDetailsModal}
        recommendation={selectedRecommendation}
      />
    </>
  );
}

export default NotificationModal;
