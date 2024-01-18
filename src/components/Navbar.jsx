import React from 'react';
import "../css/Navbar.css"
import sbi from "../assets/sbilogo.svg"
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined';
import { Badge, Divider, ListItemIcon, Typography } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import KeyboardArrowDownOutlinedIcon from '@mui/icons-material/KeyboardArrowDownOutlined';

import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { Logout, PersonAdd, Settings } from '@mui/icons-material';

const typostyle ={
  color:"#212529",
                  fontFamily:"Open Sans",
                  fontSize:"1em",
                  fontStyle:"normal",
                  fontWeight:"700",
                  lineHeight:"1.25rem",
                  letterSpacing:"-0.02rem"
}
const Navbar = () => {

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div className='main_nav_div'>
      <div className='nav_container'>
        <img src={sbi} alt="sbi" style={{ height: "50%" }} />
        <div className='nav_second'>
          <div style={{marginRight:"1em"}}>
            <Badge badgeContent={4} color="primary">
              <NotificationsNoneOutlinedIcon sx={{ cursor: "pointer" }} />
            </Badge>
          </div>

          <Divider orientation="vertical" flexItem />

          <div style={{ display: "flex", gap: "0.5em" }}>
            <Avatar alt="Travis Howard" src="/static/images/avatar/2.jpg" onClick={handleClick} sx={{ cursor: "pointer" }}
            />
            <div>
              <Typography>Dishant Shah</Typography>
              <div style={{ display: "flex", justifyContent: "flex-start" }}>
                <Typography sx={{ marginLeft: 0 }}>OEM/SI</Typography>
              </div>
            </div>
          </div>
          <KeyboardArrowDownOutlinedIcon sx={{ cursor: "pointer" }} />

          {/* menu item */}

          <Menu
            anchorEl={anchorEl}
            id="account-menu"
            open={open}
            onClose={handleClose}
            onClick={handleClose}
            PaperProps={{
              elevation: 0,

              sx: {
                backgroundColor: '#F3F3F3',
                borderRadius: "0.5rem",
                display: 'inline-flex',
                padding: "1rem",
                alignItems: "flex-start",
                gap: "1rem",

                overflow: 'visible',
                filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                mt: 1.5,
                '& .MuiAvatar-root': {
                  width: 32,
                  height: 32,
                  ml: -0.5,
                  mr: 1,
                },
                '&::before': {
                  content: '""',
                  display: 'block',
                  position: 'absolute',
                  top: 0,
                  right: 14,
                  width: 10,
                  height: 10,
                  bgcolor: 'background.paper',
                  transform: 'translateY(-50%) rotate(45deg)',
                  zIndex: 0,
                },
              },
            }}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          >
            <MenuItem onClick={handleClose}>
              <Avatar/>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <Typography
                style={typostyle}
                >Dishant Shah</Typography>
                <Typography>OEM/SI</Typography>
              </div>
            </MenuItem>
            <MenuItem onClick={handleClose}>
              <Avatar />
              <div style={{ display: "flex", flexDirection: "column" }}>
                <Typography style={typostyle}>Ajit Pawar</Typography>
                <Typography>Application owner</Typography>
              </div>
            </MenuItem>
            <MenuItem onClick={handleClose}>
              <Avatar />
              <div style={{ display: "flex", flexDirection: "column" }}>
                <Typography style={typostyle}>Pankaj Mishra</Typography>
                <Typography>AGM</Typography>
              </div>
            </MenuItem>
            <MenuItem onClick={handleClose}>
              <Avatar />
              <div style={{ display: "flex", flexDirection: "column" }}>
                <Typography style={typostyle}>Ameya Jha</Typography>
                <Typography>GM IT Infra</Typography>
              </div>
            </MenuItem>
            <Divider />

            <MenuItem onClick={handleClose} className='logouttext'>

              Logout
            </MenuItem>
          </Menu>

        </div>
      </div>
    </div>
  )
}

export default Navbar