import React from "react";
import { Backdrop } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";

const AppLoader = ({ isLoading }) => {
  return (
    <Backdrop
      open={!!isLoading}
      sx={{
        zIndex: 20000,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        // pointerEvents: 'none',
        MozUserSelect: "none",
        WebkitUserSelect: "none",
        msUserSelect: "none",
        userSelect: "none",
        borderStyle: "none",
      }}
    >
      <CircularProgress size="60px" sx={{ color: "#BBBBBB" }} />
      {/* <div className="loader"></div> */}
    </Backdrop>
  );
};

export default AppLoader;
