import {
  Box,
  Button,
  IconButton,
  InputAdornment,
  Paper,
  TextField,
} from "@mui/material";
import React, { useState } from "react";
import LoginAction from "../../actions/loginAction";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CircularProgress from "@mui/material/CircularProgress";

import SBI_LOGO from "../../assets/sbilogo.svg";

const LoginForm = () => {
  const navigate = useNavigate();
  const initialFormData = {
    username: "",
    password: "",
  };

  const [formData, setFormData] = useState(initialFormData);
  const [showPassword, setShowPassword] = useState(false);
  const [isButtonLoading, setIsButtonLoading] = useState(false);

  const handleChange = (e) => {
    let { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const HandleLogin = async (e) => {
    e.preventDefault();

    const trimmedUsername = formData.username ? formData.username.trim() : "";

    const trimmedPassword = formData.password ? formData.password.trim() : "";

    if (!trimmedUsername) {
      toast.warn("Username is required !", {
        toastId: "login-warn01",
      });

      return;
    }

    if (!trimmedPassword) {
      toast.warn("Password is required !", {
        toastId: "login-warn02",
      });

      return;
    }

    let payload = {
      username: trimmedUsername,
      password: trimmedPassword,
    };
    // debugger

    try {
      setIsButtonLoading(true);
      const response = await LoginAction.Login(payload);

      let toastMessge = "";

      if (response && response.status === 200) {
        // console.log('DATAA:  ', response.data.data)

        toastMessge = response?.data?.message;
        const cleanedMessage = JSON.stringify(toastMessge);
        toast.success(JSON.parse(cleanedMessage), {
          toastId: "login-success01",
        });

        const credData = response.data.data;

        sessionStorage.setItem("loginData", JSON.stringify(credData));

        navigate("/dashboard");
      } else {
        if (
          response &&
          response.status &&
          (response.status !== 200 || response.status !== 201)
        ) {
          toastMessge = response?.data?.message;
          const cleanedMessage = JSON.stringify(toastMessge);
          toast.error(JSON.parse(cleanedMessage), {
            toastId: "login-err01",
          });
          // console.error("RESPONSE MSG:  ", response.data.message);
        } else {
          toastMessge = response?.message;
          const cleanedMessage = JSON.stringify(toastMessge);
          toast.error(JSON.parse(cleanedMessage), {
            toastId: "login-err02",
          });
          // console.error("AXIOS MSG:  ", response.message);
        }
      }
    } catch (error) {
      console.error("Something went wrong:  ", error);
    } finally {
      setIsButtonLoading(false);
    }
  };

  // console.log('log form', formData)
  return (
    <>
      <Box
        sx={{
          width: "100vw",
          minHeight: "100vh",
          overflow: "hidden",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundImage:
            "linear-gradient(to right top, #00b5ef, #00a1eb, #008de5, #0078dc, #0061cf, #1653c0, #2045b1, #2637a2, #2a3091, #2b2980, #2a2270, #281c61)",
        }}
      >
        <Paper
          elevation={7}
          sx={{
            width: "470px",
            height: "475px",
            display: "flex",
            bgcolor: "#d6f2fb5e",
            borderRadius: "10px",
            paddingX: "1em",
            // background:'rgba(202, 248, 255, 0.95)'
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              width: "100%",
              height: "100%",
            }}
          >
            <img
              src={SBI_LOGO}
              alt="SBI LOGO"
              style={{
                minWidth: "130px",
                maxWidth: "130px",
                // minHeight: "80px",
                // maxHeight: "80px",
                marginTop: "1.2em",
                userSelect: "none",
                pointerEvents: "none",
              }}
            />
            <form
              onSubmit={HandleLogin}
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                alignItems: "center",
                width: "100%",
                height: "100%",
                marginTop: "3em",
              }}
            >
              <Box
                sx={{
                  width: "100%",
                  display: "flex",
                  flexDirection: "column",
                  gap: "2em",
                }}
              >
                <Box
                  sx={{
                    bgcolor: "#D6F2FB",
                    paddingX: "10px",
                    paddingY: "2px",
                    borderRadius: "10px",
                  }}
                >
                  <TextField
                    variant="standard"
                    size="small"
                    id="username"
                    name="username"
                    label="Username"
                    value={formData?.username}
                    onChange={handleChange}
                    fullWidth
                    required
                    autoFocus
                    inputProps={{
                      maxLength: 100,
                    }}
                    InputProps={{
                      // endAdornment: <AccountCircle />,
                      disableUnderline: true,
                    }}
                    sx={{ height: "3.5em", maxHeight: "3.5em" }}
                  />
                </Box>

                <Box
                  sx={{
                    bgcolor: "#D6F2FB",
                    paddingX: "10px",
                    paddingY: "2px",
                    borderRadius: "10px",
                  }}
                >
                  <TextField
                    id="password"
                    name="password"
                    label="Password"
                    type={showPassword ? "text" : "password"}
                    variant="standard"
                    size="small"
                    // size="small"
                    // sx={{ width: "80%", mt: "2em" }}
                    value={formData?.password}
                    onChange={handleChange}
                    inputProps={{
                      maxLength: 100,
                    }}
                    InputProps={{
                      disableUnderline: true,
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={togglePasswordVisibility}
                            edge="end"
                          >
                            {showPassword ? (
                              <VisibilityOffIcon />
                            ) : (
                              <VisibilityIcon />
                            )}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    sx={{ height: "3.5em", maxHeight: "3.5em" }}
                    // autoFocus
                    required
                    fullWidth
                  />
                </Box>
              </Box>
              <Button
                variant="contained"
                disabled={isButtonLoading}
                onClick={HandleLogin}
                sx={{
                  overflow: "hidden",
                  marginBottom: "2em",
                  bgcolor: "#281C61",
                  borderRadius: "12px",
                  paddingX: "32px",
                  paddingY: "14.5px",
                  minWidth: "160px",
                  maxWidth: "160px",
                  minHeight: "48.75px",
                  maxHeight: "48.75px",
                  fontSize: "17px",
                  fontWeight: 600,
                  "&:hover": { bgcolor: "#322475", overflow: "hidden" },

                  "&:disabled": {
                    background: "#E0E0E0",
                    // color: "#B5B5B5"
                  },
                }}
              >
                {isButtonLoading ? (
                  <CircularProgress size="2em" sx={{ color: "#818181" }} />
                ) : (
                  "LOGIN"
                )}
              </Button>
            </form>
          </Box>
        </Paper>
      </Box>
    </>
  );
};

export default LoginForm;
