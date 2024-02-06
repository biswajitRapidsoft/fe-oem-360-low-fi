import React from "react";
import { Typography, Box } from "@mui/material";

const customFontStyles = {
  fontFamily: "Open Sans !important",
  fontWeight: 600,
  fontSize: "14px",
};

const Timeline = ({ data }) => {
  // console.log("messages:  ", data);

  const handleDateAndTimeChange = (date) => {
    if (date) {
      const dateObject = new Date(date);
      const year = dateObject.getFullYear();
      const month = dateObject.getMonth() + 1;
      const day = dateObject.getDate();
      const formattedDate = `${day}/${month}/${year}`;

      const hours = dateObject.getHours();
      const minutes = String(dateObject.getMinutes()).padStart(2, "0");
      const ampm = hours >= 12 ? "pm" : "am";
      const formattedTime = `${hours % 12 || 12}.${minutes} ${ampm}`;

      return (
        <>
          <Typography
            component="span"
            sx={{
              ...customFontStyles,
              fontSize: "12px",
              fontWeight: 400,
              color: "#9B9B9B",
              whiteSpace: "nowrap",
            }}
          >
            {formattedDate}
          </Typography>
          <Typography
            component="span"
            sx={{
              ...customFontStyles,
              fontSize: "13px",
              fontWeight: 400,
              color: "#9B9B9B",
              whiteSpace: "nowrap",
            }}
          >
            {", "}
          </Typography>
          <Typography
            component="span"
            sx={{
              ...customFontStyles,
              fontSize: "12px",
              fontWeight: 400,
              color: "#9B9B9B",
              whiteSpace: "nowrap",
            }}
          >
            {formattedTime}
          </Typography>
        </>
      );

      // return { formattedDate, formattedTime };
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column", // Change to column layout
        alignItems: "flex-start", // Align items to the start
        width: "93%",
        // minHeight: "4em",
        overflow: "hidden",
        position: "relative",
        // paddingLeft: 5,
        // background: "orange",
        paddingTop: "4px",
        paddingBottom: "4.7em",
      }}
    >
      {data.map((item, index) => (
        <React.Fragment key={index}>
          {/* Colored Connector */}
          <div
            style={{
              flex: 1,
              width: "2px", // Change to vertical line
              // background: item?.createdAt ? '#8BB610' : "#AAAAAA",
              background: "#281C61",
              marginLeft: "4.2px", // Adjust the margin for spacing
              minHeight: "4.5em", // Set a minimum height for the connector line
              display: index === 0 ? "none" : "block",
            }}
          />
          {/* Dot */}
          <div
            id="testDiv"
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              zIndex: 2,
              clear: "both",
            }}
          >
            <div
              style={{
                width: "10px",
                height: "10px",
                borderRadius: "50%",
                // background: item?.createdAt ? "#8BB610" : "#AAAAAA",
                background: "#281C61",
                // marginBottom: "4px",
              }}
            />
            {/* Text */}
            <div style={{ position: "absolute", left: 20, marginTop: -5 }}>
              <Typography
                sx={{
                  ...customFontStyles,
                  color: "#49505799",
                  whiteSpace: "nowrap",
                  fontSize: "12px",
                }}
              >
                {item.createdBy.userName}
              </Typography>

              <Typography
                sx={{
                  ...customFontStyles,
                  color: "#281C61",
                  whiteSpace: "nowrap",
                }}
              >
                {item?.rejectionReason
                  ? item.rejectionReason
                  : `${item?.additionalMessage || "--"}`}
              </Typography>

              <Typography sx={{ whiteSpace: "nowrap" }}>
                {handleDateAndTimeChange(item?.createdAt) || "--"}
              </Typography>
            </div>
          </div>
        </React.Fragment>
      ))}
    </div>
  );
};

const CommentTimeLine = ({ messageList }) => {
  if (messageList && messageList.length > 0) {
    return <Timeline data={messageList} />;
  }

  if (!messageList || messageList.length === 0) {
    return (
      <Typography
        sx={{ ...customFontStyles, fontSize: "11px", color: "#49505799" }}
      >
        (no comments)
      </Typography>
    );
  }
};

export default CommentTimeLine;
