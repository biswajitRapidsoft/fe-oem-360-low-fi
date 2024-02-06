import * as React from "react";
// import AppBar from "@mui/material/AppBar";
import { styled } from "@mui/material/styles";
import MuiAppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { Avatar, Badge, List, ListItem, Paper, Popover } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import SBI_LOGO from "../../assets/sbilogo.svg";
import navbarAction from "../../actions/navbarAction";
import { useEffect } from "react";
import NotificationViewModal from "../Modals/NotificationViewModal";
import {
  AGM,
  APPLICATION_OWNER,
  GM_IT_INFRA,
  OEM_SI,
} from "../../helper/constant";

const customFontStyles = {
  fontFamily: "Open Sans !important",
  fontWeight: 600,
  fontSize: "14px",
};

const AppBar = styled(
  MuiAppBar,
  {}
)(({ theme }) => ({
  zIndex: theme.zIndex.modal - 500,
}));

export default function Navbar() {
  const loginData = JSON.parse(sessionStorage.getItem("loginData"));
  const loggedUserId = loginData?.id || null;
  const loggedUserName = loginData?.userName || "";
  const loggedUserType = loginData?.userType || "";
  const loggedUserImageUrl = loginData?.imageUrl || null;
  const navigate = useNavigate();
  const [isProfileExpanded, setIsProfileExpanded] = useState(false);
  const [profileMenuAnchorEl, setProfileMenuAnchorEl] = useState(null);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [notiPopoverAnchorEl, setNotiPopoverAnchorEl] = useState(null);
  const [notiPopoverOpen, setNotiPopoverOpen] = useState(false);
  const [notiPopoverItems, setNotiPopoverItems] = useState([]);
  const [notiBadgeCount, setNotiBadgeCount] = useState(0);
  const [notiViewModalOpen, setNotiViewModalOpen] = useState(false);
  const [notiViewModalData, setNotiViewModalData] = useState([]);

  const charactersPerLine = 53;

  const truncateMessage = (text) => {
    if (text.length > charactersPerLine) {
      return text.substring(0, charactersPerLine) + "...";
    }
    return text;
  };

  const handleNotiViewModalOpen = (modalData) => {
    setNotiViewModalData(modalData);
    setNotiViewModalOpen(true);
    // console.log("mesage id:  ", modalData?.id);
    handleNotificationMarkSeen(modalData?.id || null);
    handleGetNotifications();
  };

  // console.log("notiViewModalOpen", notiViewModalOpen);

  const handlenotiViewModalClose = () => {
    setNotiViewModalOpen(false);
    setNotiViewModalData([]);
  };

  const handleProfileMenuOpen = (e) => {
    setProfileMenuAnchorEl(e.currentTarget);
    setIsProfileExpanded(true);
    setProfileMenuOpen(true);
  };

  const handleProfileMenuClose = () => {
    setProfileMenuAnchorEl(null);
    setIsProfileExpanded(false);
    setProfileMenuOpen(false);
  };

  const handleNotiPopoverOpen = (e) => {
    // handleGetNotifications();
    setNotiPopoverAnchorEl(e.currentTarget);
    setNotiPopoverOpen(true);
  };
  const handleNotiPopoverClose = () => {
    setNotiPopoverAnchorEl(null);
    setNotiPopoverOpen(false);
  };

  const handleLogout = () => {
    sessionStorage.removeItem("loginData");
    navigate("/");
  };

  const handleGetNotifications = async () => {
    const params = {
      userId: loggedUserId,
    };

    try {
      const response = await navbarAction.funcGetNotifications(params);

      if (response && (response.status === 200 || response.status === 201)) {
        const notificationData = response?.data?.data || null;
        // console.log("notifications res:  ", notificationData);

        let notificationItem = null;
        let messageCount = 0;

        if (notificationData && notificationData.length > 0) {
          messageCount = notificationData.length;
          setNotiBadgeCount(messageCount);
          notificationItem = (
            <>
              <List
                sx={{
                  width: "100%",
                }}
              >
                {notificationData.map((dataItem) => {
                  let message = dataItem?.message || null;
                  let id = dataItem?.id || null;

                  return (
                    <React.Fragment key={id}>
                      <ListItem
                        // key={index}
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          width: "100%",
                          paddingX: 1,
                          minHeight: "60px",
                          maxHeight: "60px",
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            flexGrow: 1,
                            flexDirection: "row",
                            justifyContent: "space-between",
                            alignItems: "center",
                            gap: 1,
                          }}
                        >
                          {/* <Typography
                            sx={{ fontSize: "14px", wordBreak: "break-word" }}
                          >
                            {message}
                          </Typography> */}

                          <Typography
                            sx={{
                              ...customFontStyles,
                              fontSize: "13px",
                              color: "#9e9e9e",
                              wordBreak: "break-word",
                              maxWidth: "200px", // Set your desired max width
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                            }}
                          >
                            {truncateMessage(message)}
                          </Typography>
                          <Button
                            variant="outlined"
                            size="small"
                            onClick={() => handleNotiViewModalOpen(dataItem)}
                            sx={{
                              ...customFontStyles,
                              padding: 0,
                              fontSize: "10px",
                              minWidth: "9em",
                              maxWidth: "9em",
                              minHeight: "3.5em",
                              maxHeight: "3.5em",
                              borderRadius: "10px",
                            }}
                          >
                            VIEW DETAILS
                          </Button>
                        </Box>
                      </ListItem>
                    </React.Fragment>
                  );
                })}
              </List>
            </>
          );
        }

        setNotiPopoverItems(notificationItem);
      }
    } catch (error) {
      console.error("Unable to get notfications:  ", error);
    }
  };

  const handleNotificationMarkSeen = async (messageId) => {
    const payload = {
      id: messageId,
    };

    try {
      const response = await navbarAction.funcNotificationMarkSeen(payload);

      if (response && (response.status === 200 || response.status === 201)) {
        // console.log("mark seen res:  ", response);
      } else {
        console.error("unable to mark seen:  ", response);
      }
    } catch (error) {
      console.error("something went wrong: ", error);
    }
  };

  useEffect(() => {
    handleGetNotifications();

    const intervalNotifications = setInterval(() => {
      handleGetNotifications();
    }, 15000);

    return () => clearInterval(intervalNotifications);
  }, [loggedUserId]);

  return (
    <AppBar
      position="fixed"
      sx={{
        boxShadow: "none",
        bgcolor: "#FFFFFF",
        paddingX: "40px",
        paddingY: "7px",
      }}
    >
      <Toolbar>
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <img
            src={SBI_LOGO}
            alt="SBI Logo"
            style={{
              maxWidth: "100px",
              maxHeight: "50px",
              pointerEvents: "none",
            }}
          />
        </Box>
        <Typography
          variant="h6"
          component="div"
          sx={{ flexGrow: 1 }}
        ></Typography>
        <Box
          sx={{ display: "flex", flexDirection: "row", alignItems: "center" }}
        >
          <Box sx={{ position: "relative" }}>
            <IconButton
              onClick={
                notiPopoverOpen ? handleNotiPopoverClose : handleNotiPopoverOpen
              }
            >
              <Badge
                badgeContent={notiBadgeCount}
                sx={{
                  "& .MuiBadge-badge": {
                    position: "absolute",
                    top: 11,
                    right: 8,
                    color: "#281C61",
                    backgroundColor: "#FFCD00",
                    fontWeight: 700,
                  },
                }}
              >
                <NotificationsOutlinedIcon
                  sx={{
                    color: "#281C61",
                    fontSize: "42px",
                  }}
                />
              </Badge>
            </IconButton>
            <Popover
              open={notiPopoverOpen}
              anchorEl={notiPopoverAnchorEl}
              onClose={handleNotiPopoverClose}
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
                ml: "-0.4em",
                zIndex: notiPopoverOpen
                  ? 100
                  : (theme) => theme.zIndex.modal - 400,
                filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
              }}
            >
              <Box
                sx={{
                  position: "relative",
                  mt: "10px",
                  "&::before": {
                    backgroundColor: "#FFFFFF00",
                    content: '""',
                    display: "block",
                    position: "absolute",
                    width: 0,
                    height: 0,
                    borderLeft: "10px solid transparent", // Adjust the size of the triangle
                    borderRight: "10px solid transparent", // Adjust the size of the triangle
                    borderBottom: "8px solid white", // Adjust the size and color of the triangle
                    top: -8,
                    right: 13,
                  },
                }}
              />
              <Paper
                elevation={5}
                sx={{
                  p: 1,
                  bgcolor: "white",
                  minWidth: "22em",
                  maxWidth: "22em",
                  userSelect: "none",
                  cursor: "pointer",
                }}
              >
                {/* <Grid container>
                  <Grid item xs={12} sm={12} md={12} lg={12}> */}
                <Typography
                  sx={{
                    ...customFontStyles,
                    fontSize: "16px",
                    fontWeight: 600,
                    width: "100%",
                    color: "black",
                  }}
                >
                  Notifications
                </Typography>
                {/* </Grid>
                  <Grid item xs={12} sm={12} md={12} lg={12}> */}
                <Box
                  sx={{
                    minWidth: "100%",
                    minHeight: "50px",
                    maxHeight: "300px",
                    overflowY: "auto",
                    scrollbarWidth: "thin",
                    scrollbarColor: "#B5B5B5 transparent",
                    "&::-webkit-scrollbar": {
                      width: "8px",
                    },
                    "&::-webkit-scrollbar-thumb": {
                      backgroundColor: "#B5B5B5",
                      borderRadius: "8px",
                    },
                    "&::-webkit-scrollbar-track": {
                      backgroundColor: "transparent",
                    },
                    // padding:0,
                    // bgcolor:'cyan'
                  }}
                >
                  {notiPopoverItems}

                  {(!notiBadgeCount || notiBadgeCount === 0) && (
                    <>
                      <List
                        sx={{
                          width: "100%",
                        }}
                      >
                        <ListItem
                          sx={{
                            display: "flex",
                            justifyContent: "center",
                            width: "100%",
                            paddingX: 1,
                          }}
                        >
                          <Typography sx={{ color: "black" }}>
                            No new notifications...
                          </Typography>
                        </ListItem>
                      </List>
                    </>
                  )}
                </Box>
                {/* </Grid>
                </Grid> */}
              </Paper>
            </Popover>

            {/* <div
              // onClick={handleStatusUpdate}
              style={{
                position: "absolute",
                top: 16,
                right: 12,
                zIndex: 1,
                width: "7px",
                height: "7px",
                backgroundColor: "#F8DA00",
                borderRadius: "50%",
                border: "1.2px solid #FFFFFF",
              }}
            /> */}
          </Box>
          <div
            style={{
              flex: 1,
              minWidth: "0.5px",
              maxWidth: "0.5px",
              background: "#C1C1C1",
              // marginLeft: "4.2px",
              // minHeight: "4.5em",
              minHeight: "30px",
              maxHeight: "30px",
              display: "block",
              marginLeft: "2%",
              marginRight: "20px",
            }}
          />
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              minWidth: "10em",
              // maxWidth: "14em",
              minHeight: "4em",
              maxHeight: "4em",
              gap: 1,
              userSelect: "none",
              cursor: "pointer",
              justifyContent: "space-between",
            }}
            onClick={
              isProfileExpanded ? handleProfileMenuClose : handleProfileMenuOpen
            }
          >
            <Avatar sx={{ width: "44px", height: "44px" }}>
              {loggedUserImageUrl ? (
                <img
                  src={loggedUserImageUrl}
                  alt="No DP"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
              ) : (
                <AccountCircleIcon sx={{ fontSize: "55px" }} />
              )}
            </Avatar>
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                gap: 1,
              }}
            >
              <Box>
                <Typography
                  sx={{
                    color: "#212529",
                    fontSize: "18px",
                    fontWeight: 700,
                    whiteSpace: "nowrap",
                  }}
                >
                  {loggedUserName || "NA"}
                </Typography>
                <Typography
                  sx={{
                    color: "#000000",
                    fontSize: "14px",
                    fontWeight: 400,
                    whiteSpace: "nowrap",
                  }}
                >
                  {loggedUserType === OEM_SI
                    ? "OEM/SI"
                    : loggedUserType === APPLICATION_OWNER
                    ? "Application Owner"
                    : loggedUserType === AGM
                    ? "AGM"
                    : loggedUserType === GM_IT_INFRA
                    ? "GM IT Infra"
                    : "NA"}
                </Typography>
              </Box>
              <Box
                sx={{
                  marginTop: "-15px",
                  minWidth: "25px",
                  maxWidth: "25px",
                }}
              >
                {isProfileExpanded ? (
                  <ExpandLessIcon sx={{ color: "#495057", fontSize: "25px" }} />
                ) : (
                  <ExpandMoreIcon sx={{ color: "#495057", fontSize: "25px" }} />
                )}
              </Box>
            </Box>

            <Popover
              open={profileMenuOpen}
              anchorEl={profileMenuAnchorEl}
              // onClose={handleProfileMenuClose}
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
                  zIndex: (theme) => theme.zIndex.modal - 400,
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
                    // left: "calc(50% - 6px)",
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
                onClick={handleLogout}
              >
                <Typography sx={{ width: "100%", textAlign: "center" }}>
                  Logout
                </Typography>
              </Paper>
            </Popover>

            {/* <Menu
              elevation={2}
              sx={{
                // zIndex:1500,
                // overflow: "visible",
                filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                mt: "3.2em",
                zIndex: (theme) => theme.zIndex.modal - 400,
                paddingTop: 0,
                // bgcolor:'red'
                // mr: "7em",
              }}
              PaperProps={{
                style: {
                  backgroundColor: "#FFFFFF00",
                  boxShadow: "none",
                },
              }}
              anchorEl={profileMenuAnchorEl}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              id="profile-menu"
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={profileMenuOpen}
              onClose={handleProfileMenuClose}
            >
              <Box
                sx={{
                  position: "relative",
                  zIndex: (theme) => theme.zIndex.modal - 400,
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
                    // left: "calc(50% - 6px)",
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
                }}
              >
                <Typography>Logout</Typography>
              </Paper>
            </Menu> */}
          </Box>
        </Box>
      </Toolbar>

      {/* HR BOTTOM LINE */}
      <div
        style={{
          minWidth: "98%",
          maxWidth: "98%",
          position: "absolute",
          left: 27,
          bottom: -8.3,
          zIndex: (theme) => theme.zIndex.modal - 500,
          display: "flex",
          flexGrow: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <hr
          style={{
            borderColor: "#a9a4c069",
            width: "95.5%",
          }}
        />
        {notiViewModalOpen && (
          <NotificationViewModal
            notiViewModalData={notiViewModalData}
            notiViewModalOpen={notiViewModalOpen}
            handlenotiViewModalClose={handlenotiViewModalClose}
          />
        )}
      </div>
    </AppBar>
  );
}
