import React from "react";
import { Typography } from "@mui/material";

const Timeline = ({ data }) => {
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
          <Typography component="span">{formattedDate}</Typography>
          <Typography component="span">{", "}</Typography>
          <Typography component="span">{formattedTime}</Typography>
        </>
      );
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        width: "93%",
        overflow: "hidden",
        position: "relative",
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
              width: "2px",
              background: "#000000",
              marginLeft: "4.2px",
              minHeight: "4.5em",
              display: index === 0 ? "none" : "block",
              // border: "1px solid black",
            }}
          />
          {/* Dot */}
          <div
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
                background: "#000000",
              }}
            />
            {/* Text */}
            <div style={{ position: "absolute", left: 20, marginTop: -5 }}>
              <Typography sx={{ color: "gray" }}>
                {item.createdBy.userName}
              </Typography>

              <Typography>
                {item?.rejectionReason
                  ? item.rejectionReason
                  : `${item?.additionalMessage || "--"}`}
              </Typography>

              <Typography sx={{ whiteSpace: "nowrap", color: "gray" }}>
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
      // sx={{ ...customFontStyles, fontSize: "11px", color: "#49505799" }}
      >
        (no comments)
      </Typography>
    );
  }
};

export default CommentTimeLine;
