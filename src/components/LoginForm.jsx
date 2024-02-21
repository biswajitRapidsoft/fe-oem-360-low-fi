import React, { useState } from "react";
import sbi from "../assets/sbilogo.svg";
import TextField from "@mui/material/TextField";
import {
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Paper,
  useMediaQuery,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useNavigate } from "react-router";

// import actions
// import { LoginAction } from "../actions/Loginaction";
import { LoginAction } from "../actions/loginAction";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { LoadingButton } from "@mui/lab";

const Login = () => {
  const navigate = useNavigate();
  const isSmallScreen = useMediaQuery((theme) => theme.breakpoints.down("sm"));

  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => setShowPassword((show) => !show);

  // integrating the loading button
  const [isLoading, setIsLoading] = useState(false);

  const [loginformdata, setLoginformdata] = useState({
    username: "",
    password: "",
  });
  // services function
  const handleLoginAction = async () => {
    if (!loginformdata.username) {
      toast.warn("Please provide username");
      return;
    }
    if (!loginformdata.password) {
      toast.warn("Please provide password");
      return;
    }
    setIsLoading(true);

    let payload = {
      username: loginformdata.username,
      password: loginformdata.password,
    };

    try {
      const response = await LoginAction.Login(payload);
      console.log("response", response);
      if (response && response.status === 200) {
        sessionStorage.setItem(
          "loginresponse",
          JSON.stringify(response.data.data)
        );
        sessionStorage.setItem("isLoggedIn", true);
        toast.success(response.data.message);
        navigate("/dash");
        setLoginformdata({
          username: "",
          password: "",
        });
      }
    } catch (err) {
      console.error(err);
      if (err.response && err.response.status === 400) {
        // If the error is due to invalid credentials
        toast.error(err.response.data.message);
      } else if (err.message === "Network Error") {
        // If the error is due to a network issue
        toast.error(err.message); // Displaying the network error message from Axios
      } else {
        // For other errors
        toast.error("An error occurred. Please try again.");
      }
      setLoginformdata({
        username: "",
        password: "",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // --------------------------------------

  const handleloginchange = (e) => {
    const { name, value } = e.target;
    setLoginformdata({
      ...loginformdata,
      [name]: value,
    });
  };

  return (
    <div
      style={{
        width: "100%",
        background: "linear-gradient(90deg, #00d2ff 0%, #3a47d5 100%)",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Paper
        style={{
          height: "32em",
          width: isSmallScreen ? "90%" : "30em",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "space-evenly",
        }}
      >
        <img src={sbi} alt="sbi" style={{ width: "12em", height: "3em" }} />

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-evenly",
            height: "38%",
            width: "100%",
            alignItems: "center",
          }}
        >
          <TextField
            id="outlined-basic"
            label="Username"
            variant="outlined"
            sx={{ width: "70%" }}
            name="username"
            value={loginformdata.username}
            onChange={handleloginchange}
          />

          {/* password field */}
          <FormControl sx={{ width: "70%" }} variant="outlined">
            <InputLabel htmlFor="outlined-adornment-password">
              Password
            </InputLabel>
            <OutlinedInput
              id="outlined-adornment-password"
              type={showPassword ? "text" : "password"}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
              label="Password"
              name="password"
              value={loginformdata.password}
              onChange={handleloginchange}
            />
          </FormControl>
        </div>

        {/* <Button
          variant="contained"
          sx={{ width: "40%" }}
          onClick={handleLoginAction}
        >
          Login
        </Button> */}

        <LoadingButton
          variant="contained"
          sx={{
            width: "36%",
            height: "3rem",
            fontSize: "1.5rem",
            textTransform: "none",
            fontWeight: "540",
          }}
          loading={isLoading}
          onClick={handleLoginAction}
        >
          Login
        </LoadingButton>
      </Paper>
    </div>
  );
};

export default Login;
