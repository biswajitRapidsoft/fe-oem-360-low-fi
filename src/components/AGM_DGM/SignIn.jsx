import React from "react";
import { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { Typography, Button, Paper } from "@mui/material";
// import config from '../../config/config';
import config from "../../config/config";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { LoginAction } from "../../actions/LoginAction";
import "../../css/signin.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
//loader
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import LoadingComponent from "./LoadingComponent";

const SignIn = () => {
  const [values, setValues] = useState({
    email: "",
    password: "",
  });
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword); // Toggle the state
  };

  const [data, setData] = useState({});
  const navigate = useNavigate();

  // const signInUrl = config.baseUrl + config.apiName.pageData

  //loader
  // const [open, setOpen] = React.useState(false);
  const [buttonDisabled, setButtonDisabled] = useState(false);

  // const handleClose = () => {
  //   setOpen(false);
  // };

  const signin = async () => {
    try {
      if (errors.email || errors.password) {
        // If there are errors in email or password fields, do not proceed with the API call
        return;
      }

      const payload = {
        username: values.email,
        password: values.password,
      };

      const response = await LoginAction.Login(payload);

      if (response.data.responseCode === 200) {
        toast("Signed in succesfully");
        sessionStorage.setItem("data", JSON.stringify(response.data.data));
        navigate("/piechart");
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setButtonDisabled(false);
    }
  };

  return (
    <>
      {/*
      <Box sx={{ backgroundColor: "", height: "" }}>
        <form sx={{ display: "flex", flexDirection: "column", gap: 5, mt: 10 }}>
          <Typography>SignIn</Typography>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "column",
              gap: 5,
            }}
          >
            <TextField
              id="outlined-basic"
              label="Email Id"
              variant="outlined"
              onChange={(event) => {
                setEmail(event.target.value);
              }}
              sx={{ width: 400 }}
              required
            />
            <TextField
              id="outlined-basic"
              label="Password"
              variant="outlined"
              onChange={(event) => {
                setPassword(event.target.value);
              }}
              sx={{ width: 400 }}
              required
            />
            <Button
              variant="contained"
              onClick={(e) => {
                signin(e);
              }}
            >
              Signin
            </Button>
          </Box>
        </form>
     
      </Box>*/}
      <Box
        id="grad1"
        sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
      >
        <Paper
          sx={{
            height: "63vh",
            width: "63vh",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <LockOutlinedIcon
            sx={{
              height: "10vh",
              width: "5vh",
              margin: "",
              alignSelf: "center",
            }}
          />
          <Typography variant="h4">Sign In</Typography>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <TextField
              id="standard-basic"
              label="Email Address"
              required
              variant="standard"
              sx={{ width: "25vw", alignSelf: "center" }}
              value={values.email}
              onChange={(e) => {
                setValues({ ...values, email: e.target.value });
              }}
              onBlur={() => {
                let trimmedValue = values.email.trim(); // Trim leading/trailing spaces
                setValues({ ...values, email: trimmedValue });
                if (!values.email.trim()) {
                  setErrors({ ...errors, email: "Email is required" });
                } else if (!/\S+@\S+\.\S+/.test(values.email)) {
                  setErrors({
                    ...errors,
                    email: "Invalid email address",
                  });
                } else {
                  setErrors({ ...errors, email: "" });
                }
              }}
              error={Boolean(errors.email)}
              helperText={errors.email}
            />

            <TextField
              id="standard-basic"
              label="Password"
              required
              variant="standard"
              type={showPassword ? "text" : "password"}
              value={values.password}
              onChange={(e) => {
                setValues({ ...values, password: e.target.value });
              }}
              onBlur={() => {
                let trimmedValue = values.password.trim();

                setValues({ ...values, password: trimmedValue });
                if (!values.password.trim()) {
                  setErrors({ ...errors, password: "Password is required" });
                } else {
                  setErrors({ ...errors, password: "" });
                }
              }}
              error={Boolean(errors.password)}
              helperText={errors.password}
              sx={{ width: "25vw", alignSelf: "center" }}
              InputProps={{
                endAdornment: (
                  <React.Fragment>
                    {showPassword ? (
                      <VisibilityOutlinedIcon
                        style={{ cursor: "pointer" }}
                        onClick={togglePasswordVisibility}
                      />
                    ) : (
                      <VisibilityOffOutlinedIcon
                        style={{ cursor: "pointer" }}
                        onClick={togglePasswordVisibility}
                      />
                    )}
                  </React.Fragment>
                ),
              }}
            />
            <Button
              sx={{
                width: "25vw",
                height: "40px",
                backgroundColor: "rgb(40, 0, 113)",
                color: "white",
                alignSelf: "center",
                "&:hover": {
                  backgroundColor: "rgb(40, 0, 113)",
                },
              }}
              disabled={buttonDisabled}
              onClick={(e) => {
                signin(e);
              }}
            >
              Sign In
            </Button>
          </Box>
        </Paper>

        <div>
          {/*   
      <Backdrop
    
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.modal + 1}}
        open={open}
        onClick={handleClose}
      >
        <CircularProgress color="inherit" />
      </Backdrop> */}
        </div>
      </Box>
    </>
  );
};

export default SignIn;
