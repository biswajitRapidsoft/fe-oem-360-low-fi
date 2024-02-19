import * as React from "react";
import { useState, useEffect } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import AdbIcon from "@mui/icons-material/Adb";
import sbilogo from "../../img/sbilogo.png";
import { Divider } from "@mui/material";
import Badge from "@mui/material/Badge";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import config from "../../config/config";
import axios from "axios";
import NotificationModal from "../AGM_DGM/NotificationModal";
import { NotificationModalAction } from "../../actions/NotificationModalAction";

const settings = ["Logout"];

function Navbar({
  fetchDataAppOwner,
  fetchApprovedListAppOwner,
  fetchDataAgm,
}) {
  //token
  const datas = sessionStorage.getItem("data");
  const data = JSON.parse(datas);
  const token = data.token;
  const userType = data.userType;
  const userName = data.userName;
  const id = data.id;

  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);

  const [notificationData, setNotificationData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const getNotifications = async () => {
    try {
      // const getNotificationsUrl =
      //   config.baseUrl +
      //   config.apiEndPoints.getNotifications +
      //   `?` +
      //   `userId=${id}`;
      // const response = await axios.get(getNotificationsUrl, {
      //   headers: {
      //     Authorization: `Bearer ${token}`,
      //   },
      // });

      const payload = {
        userId: id,
      };
      const response = await NotificationModalAction.notification(payload);
      if (response.status === 200) {
        setNotificationData(response.data.data);
        console.log(response.data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleBadgeClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    getNotifications();
    if (
      userType === "AGM" ||
      userType === "OEM_SI" ||
      userType === "GM_IT_INFRA"
    ) {
      fetchDataAgm();
    } else if (userType === "APPLICATION_OWNER") {
      fetchDataAppOwner();
      fetchApprovedListAppOwner();
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("data");
    window.location.href = "/";
  };

  useEffect(() => {
    getNotifications();

    const intervalId = setInterval(() => {
      getNotifications();
    }, 30 * 1000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <AppBar position="sticky" sx={{ backgroundColor: "white" }} elevation={0}>
      <Container maxWidth="xl" sx={{ backgroundColor: "" }}>
        <Toolbar disableGutters sx={{ backgroundColor: "" }}>
          <img src={sbilogo} style={{ width: "5vw", height: "5vh" }}></img>

          <Box
            sx={{
              flexGrow: 1,
              display: { xs: "flex", md: "none" },
              backgroundColor: "",
            }}
          >
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: "block", md: "none" },
              }}
            ></Menu>
          </Box>

          <Box
            sx={{
              flexGrow: 1,
              display: { xs: "none", md: "flex" },
              backgroundColor: "blue",
            }}
          ></Box>

          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              gap: 3,
              backgroundColor: "",
              mt: 2,
              width: "20vw",
            }}
          >
            <Box>
              <Badge
                badgeContent={notificationData.length}
                onClick={handleBadgeClick}
                color="warning"
                sx={{ cursor: "pointer" }}
              >
                <NotificationsNoneIcon
                  sx={{ width: "35px", height: "35px" }}
                  color="action"
                />
              </Badge>
            </Box>

            <div
              style={{
                height: "35px",
                borderLeft: "1px solid lightgrey",
                marginLeft: "10px",
              }}
            ></div>

            <Box sx={{ flexGrow: 0, backgroundColor: "" }}>
              <Tooltip title="Open settings">
                {/* <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}> */}
                <Avatar alt="Remy Sharp" src="/static/images/avatar/2.jpg" />
                {/* </IconButton> */}
              </Tooltip>
              <Menu
                sx={{ mt: "45px" }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                {settings.map((setting) => (
                  <MenuItem key={setting} onClick={handleLogout}>
                    <Typography textAlign="center">{setting}</Typography>
                  </MenuItem>
                ))}
              </Menu>
            </Box>

            <Box sx={{ backgroundColor: "" }}>
              <Box sx={{ display: "flex", flexDirection: "row", gap: 2 }}>
                <Typography sx={{ color: "#212529" }}>{userName}</Typography>
                <KeyboardArrowDownIcon
                  onClick={handleOpenUserMenu}
                  sx={{ color: "black", cursor: "pointer" }}
                />
              </Box>

              {userType === "APPLICATION_OWNER" && (
                <Typography sx={{ color: "grey", marginRight: 3 }}>
                  Application Owner
                </Typography>
              )}
              {userType === "OEM_SI" && (
                <Typography sx={{ color: "grey" }}>OEM/SI</Typography>
              )}
              {userType === "GM_IT_INFRA" && (
                <Typography sx={{ color: "grey" }}>GM IT Infra</Typography>
              )}
              {userType === "AGM" && (
                <Typography sx={{ color: "grey" }}>AGM</Typography>
              )}
            </Box>
          </Box>
        </Toolbar>
      </Container>
      {/* <Divider
        sx={{
          height: "",
          width: "calc(100% - 5%)",
          margin: "0 auto",
          backgroundColor: "lightgrey",
        }}
      /> */}
      <Divider
        sx={{
          position: "absolute",
          left: 70,
          top: "100%",
          transform: "translateY(-50%)",
          width: "30%",
          // height: "1px",
          backgroundColor: "lightgrey",
        }}
      />
      <Divider
        sx={{
          position: "absolute",
          right: 70,
          top: "100%",
          transform: "translateY(-50%)",
          width: "30%",
          // height: "50px",
          backgroundColor: "lightgrey",
        }}
      />

      <NotificationModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        recommendations={notificationData}
      />
    </AppBar>
  );
}
export default Navbar;
