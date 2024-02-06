import React from "react";
import { Typography } from "@mui/material";

const customFontStyles = {
  fontFamily: "Open Sans !important",
  fontWeight: 600,
  fontSize: "14px",
};

const Timeline = ({ data, timelineTexts }) => {
  const handleDateChange = (date) => {
    if (date) {
      const dateObject = new Date(date);
      const year = dateObject.getFullYear();
      const month = dateObject.getMonth() + 1;
      const day = dateObject.getDate();
      const formattedDate = `${day}/${month}/${year}`;

      if (formattedDate) {
        return formattedDate;
      } else {
        return null;
      }
    }
  };

  return (
    <div
      style={{
        display: "flex",
        width: "93%",
        minHeight: "4em",
        overflow: "hidden",
        position: "relative",
        paddingLeft: 85,
        // paddingRight:'30px'
        // background:'orange'
      }}
    >
      {/* GLOBAL LINE */}
      {/* <div
        style={{
          flex: "1",
          height: "2px",
          background: "#8BB610",
          marginTop: "0px",
          position: "absolute",
          width: globalLineWidth,
          maxWidth: "92.50%",
          flexGrow: 1,
          top: "7px",
          left: "85px",
          zIndex: 1,
        }}
      /> */}

      {data.map((item, index) => (
        <React.Fragment key={index}>
          {/* Colored Connector */}
          <div
            style={{
              flex: 1,
              height: "2px",
              // background: "#FFFFFF00",
              background: item?.createdAt ? "#8BB610" : "#AAAAAA",
              marginTop: "7px",
              display: index === 0 ? "none" : "block",
            }}
          />

          {/* Dot */}
          <div
            // ref={item.createdAt ? lastCreatedAtDivRef : null}
            id="testDiv"
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              // margin: "0 8px",
              // zIndex: 2,
            }}
          >
            <div
              style={{
                width: "16px",
                height: "16px",
                borderRadius: "50%",
                background: item?.createdAt ? "#8BB610" : "#AAAAAA",
                marginBottom: "4px",
                marginRight: index === data.length - 1 ? "70px" : "0",
              }}
            />
            {/* Text */}
            <Typography
              //  component={'span'} variant={'body2'}
              sx={{
                ...customFontStyles,
                color: item?.createdAt ? "#8BB610" : "#AAAAAA",
                whiteSpace: "nowrap",
                position: "absolute",
                top: 18,
                marginRight: index === data.length - 1 ? "70px" : "0",
              }}
            >
              {timelineTexts[index]}
            </Typography>
            {/* <br/> */}
            <Typography
              // component={'span'} variant={'body2'}
              sx={{
                ...customFontStyles,
                color: item?.createdAt ? "#8BB610" : "#AAAAAA",
                whiteSpace: "nowrap",
                position: "absolute",
                top: 37,
                marginRight: index === data.length - 1 ? "70px" : "0",
              }}
            >
              {handleDateChange(item?.createdAt) || ""}
            </Typography>
          </div>
        </React.Fragment>
      ))}
    </div>
  );
};

const TableTimeline = ({ apiResponse }) => {
  if (!apiResponse || !Array.isArray(apiResponse)) {
    return <Typography sx={{ ...customFontStyles }}>NO DATA</Typography>;
  }

  const timelineTexts = [];
  let isApprovedPresent = false;
  const timelineData = [];

  const approvedItem = apiResponse.find(
    (item) => item?.recommendationStatus?.statusName === "Approved"
  );
  const isStatusDone = approvedItem?.isStatusDone || false;
  // console.log(' is status done', isStatusDone)

  apiResponse.forEach((item) => {
    const statusName = item?.recommendationStatus?.statusName || "";

    if (statusName === "Approved") {
      timelineTexts.push(
        <span key={timelineTexts.length}>
          <span style={{ color: isStatusDone ? "#8BB610" : "#AAAAAA" }}>
            Approved
          </span>
          <span style={{ color: "#8BB610" }}>/</span>
          <span
            style={{ color: statusName === "Rejected" ? "#8BB610" : "#AAAAAA" }}
          >
            Rejected
          </span>
        </span>
      );
      isApprovedPresent = true;
      timelineData.push(item);
    } else if (statusName === "Rejected" && !isApprovedPresent) {
      timelineTexts.push(
        <span key={timelineTexts.length}>
          <span style={{ color: isStatusDone ? "#8BB610" : "#AAAAAA" }}>
            Approved
          </span>
          <span style={{ color: "#8BB610" }}>/</span>
          <span
            style={{ color: statusName === "Rejected" ? "#8BB610" : "#AAAAAA" }}
          >
            Rejected
          </span>
        </span>
      );
      timelineData.push(item);
    } else if (statusName !== "Approved" && statusName !== "Rejected") {
      timelineTexts.push(<span key={timelineTexts.length}>{statusName}</span>);
      timelineData.push(item);
    }
  });

  // Now, timelineTexts contains the desired array of styled texts.

  return <Timeline data={timelineData} timelineTexts={timelineTexts} />;
};

export default TableTimeline;
