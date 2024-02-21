import React, { useEffect, useState } from "react";
import "../css/Navbar.css";
import sbi from "../assets/sbilogo.svg";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import {
  Badge,
  Box,
  Divider,
  IconButton,
  Paper,
  Typography,
} from "@mui/material";
import Avatar from "@mui/material/Avatar";
// import KeyboardArrowDownOutlinedIcon from "@mui/icons-material/KeyboardArrowDownOutlined";
import Popover from "@mui/material/Popover";

// importing menu item
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

// importing menuitem
import Button from "@mui/material/Button";

// import actions
import { navbarActions } from "../actions/navbarAction";

import Modal from "@mui/material/Modal";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 500,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  display: "flex",
  flexDirection: "column",
};

const Navbar = () => {
  const navigate = useNavigate();

  const loginInfo = JSON.parse(sessionStorage.getItem("loginresponse"));
  console.log("image url", loginInfo.imageUrl?.loginInfo.imageUrl);
  // console.log("loginInfo.userName", loginInfo.userName);
  // function to format date to dd/mm/yyyy
  const formatDate = (isoDateString) => {
    const date = new Date(isoDateString);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };
  // useState for selected message on clicking view details button
  const [selectedMessage, setSelectedMessage] = useState("");

  // console.log("selectedMessage.id", selectedMessage);

  // menu item for logout
  const [anchorEl2, setAnchorEl2] = React.useState(null);
  const open2 = Boolean(anchorEl2);
  const handleClick2 = (event) => {
    setAnchorEl2(event.currentTarget);
  };
  const handleClose2 = () => {
    setAnchorEl2(null);
    toast.success("logged out successfully");
    sessionStorage.removeItem("loginresponse");
    sessionStorage.removeItem("notificationData");
    navigate("/");
  };

  // stuffs for menuitem
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClickmenu = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  // modal functionalities
  const [openModal, setOpenModal] = useState(false);
  const handleOpenModal = () => {
    // markNotifications();
    setOpenModal(true);
  };

  const handleCloseModal = () => setOpenModal(false);

  // useStates for handling the notification data
  const [notificationData, setNotificationData] = useState("");

  // function for handling the notifications
  const handleNotifications = async () => {
    const res = await navbarActions.getNotifications();
    if (res.status === 200) {
      const data = res?.data?.data;
      setNotificationData(data);
    }
  };
  useEffect(() => {
    // Call handleNotifications initially
    handleNotifications();

    // Set interval to call handleNotifications every 30 seconds
    const intervalId = setInterval(() => {
      handleNotifications();
    }, 30000);

    // Cleanup function to clear the interval when component unmounts
    return () => clearInterval(intervalId);
  }, []);

  // function for marking notification as seen
  // const markNotifications = async () => {
  //   try {
  //     const res = await navbarActions.markNotifications();
  //     console.log("res for mark seen", res);
  //   } catch (err) {
  //     console.error(err);
  //   }
  // };
  const markNotifications = async (id) => {
    const payload = {
      id: id,
    };
    try {
      const res = await navbarActions.markNotifications(payload);
      // console.log("res for mark seen", res);
      if (res.status === 200) {
        handleNotifications();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="main_nav_div">
      <div className="nav_container">
        <img src={sbi} alt="sbi" style={{ height: "50%" }} />
        <div className="nav_second">
          <div style={{ marginRight: "1em" }}>
            <Badge badgeContent={notificationData.length} color="primary">
              <NotificationsNoneOutlinedIcon
                sx={{ cursor: "pointer" }}
                onClick={handleClickmenu}
              />
            </Badge>

            {/* menuitem goes here */}
            <Menu
              id="basic-menu"
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              MenuListProps={{
                "aria-labelledby": "basic-button",
              }}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "right",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              PaperProps={{
                style: {
                  maxHeight: "23rem",
                  width: "30rem",
                },
              }}
              // sx={{ border: "2px solid black" }}
              // sx={{ backgroundColor: "black" }}
            >
              <Box>
                <Box
                  sx={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "center",
                    position: "sticky",
                    top: 0,
                    backgroundColor: "white",
                    zIndex: 1,
                  }}
                >
                  <Typography sx={{ fontSize: 20, fontWeight: 500 }}>
                    Notifications
                  </Typography>
                </Box>
                {notificationData.length > 0 &&
                  notificationData.map((item, index) => (
                    <MenuItem key={index}>
                      <Box
                        sx={{
                          display: "flex",
                          // backgroundColor: "green",
                          width: "100%",
                          justifyContent: "space-between",
                        }}
                      >
                        <Box sx={{ width: "70%" }}>
                          <Typography sx={{ textWrap: "wrap" }}>
                            {item.message}
                          </Typography>
                        </Box>
                        <Box>
                          <Button
                            variant="outlined"
                            color="primary"
                            onClick={() => {
                              setSelectedMessage(item);
                              sessionStorage.setItem(
                                "notificationData",
                                JSON.stringify(item)
                              );

                              handleOpenModal();
                              markNotifications(item.id);
                            }}
                          >
                            View Details
                          </Button>
                        </Box>
                      </Box>
                    </MenuItem>
                  ))}
              </Box>
            </Menu>
            {/* logout popover goes here */}
            <Popover
              open={open2}
              anchorEl={anchorEl2}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "right",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              PaperProps={{
                style: {
                  backgroundColor: "#FFFFFF00",
                  boxShadow: "none",
                },
              }}
              sx={{
                mt: "0.6em",
                ml: "1.2em",
                zIndex: (theme) => theme.zIndex.modal - 400,
                filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
              }}
            >
              <Box
                sx={{
                  position: "relative",
                  mt: "10px",
                  "&::before": {
                    backgroundColor: "white",
                    content: '""',
                    display: "block",
                    position: "absolute",
                    width: 12,
                    height: 12,
                    top: -6,
                    transform: "rotate(45deg)",
                    right: 20,
                  },
                }}
              />

              <Paper
                elevation={5}
                sx={{
                  p: 1,
                  bgcolor: "white",
                  minWidth: "4em",
                  userSelect: "none",
                  cursor: "pointer",
                }}
                onClick={handleClose2}
              >
                <Typography sx={{ width: "100%", textAlign: "center" }}>
                  Logout
                </Typography>
              </Paper>
            </Popover>

            {/* modal goes here */}
            <Modal
              open={openModal}
              onClose={handleCloseModal}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
            >
              <Box sx={style}>
                <Typography
                  sx={{
                    fontSize: "20px",
                    fontWeight: "bold",
                    color: "#281C61",
                  }}
                >
                  {selectedMessage.referenceId}
                </Typography>
                <Box>
                  <Typography sx={{ fontSize: "20px" }}>
                    Descriptions:
                  </Typography>
                  <Typography sx={{ color: "gray" }}>
                    {selectedMessage.message}
                  </Typography>
                </Box>
                <Box>
                  <Typography sx={{ fontSize: "20px" }}>Updated At:</Typography>
                  <Typography sx={{ color: "gray" }}>
                    {formatDate(selectedMessage.updatedAt)}
                  </Typography>
                </Box>
              </Box>
            </Modal>
          </div>

          <Divider orientation="vertical" flexItem />

          <div style={{ display: "flex", gap: "0.5em" }}>
            <IconButton onClick={handleClick2}>
              {/* <Avatar alt="Travis Howard" src="/static/images/avatar/2.jpg" /> */}
              <Avatar
                alt="Travis Howard"
                src={loginInfo.imageUrl?.loginInfo.imageUrl}
              />
            </IconButton>
            <div>
              {/* <Typography>{loginInfo?.loginInfo.userName}</Typography> */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-start",
                  width: "11rem",
                }}
              >
                <Typography sx={{ cursor: "pointer" }}>
                  {loginInfo.userName}
                </Typography>
              </div>
              {/* <Typography>Nikhil</Typography> */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-start",
                  width: "11rem",
                }}
              >
                <Typography sx={{ marginLeft: 0 }}>
                  {loginInfo.userType}
                </Typography>
              </div>
            </div>
          </div>
          {/* <KeyboardArrowDownOutlinedIcon sx={{ cursor: "pointer" }} /> */}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
