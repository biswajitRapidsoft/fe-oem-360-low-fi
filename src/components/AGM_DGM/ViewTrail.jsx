// import React from "react";
// import { useState, useEffect } from "react";
// import {
//   Modal,
//   Backdrop,
//   Fade,
//   Paper,
//   Typography,
//   Button,
//   Box,
//   Divider,
// } from "@mui/material";
// import Timeline from "@mui/lab/Timeline";
// import TimelineItem from "@mui/lab/TimelineItem";
// import TimelineSeparator from "@mui/lab/TimelineSeparator";
// import TimelineConnector from "@mui/lab/TimelineConnector";
// import TimelineContent from "@mui/lab/TimelineContent";
// import TimelineDot from "@mui/lab/TimelineDot";
// import TimelineIcon from "@mui/icons-material/Timeline";
// import "../../css/ViewTrail.css";

// const ViewTrail = ({ viewTrailData }) => {
//   const [trailData, setTrailData] = useState([]);
//   const [isApproved, setIsApproved] = useState(false);
//   const filteredArray = [];

//   useEffect(() => {
//     if (viewTrailData) {
//       setTrailData(viewTrailData.trailResponse);
//     }
//   }, [viewTrailData]);

//   console.log(trailData, "helloview");

//   const trailfunction = () => {
//     trailData.forEach((item) => {
//       if (item.recommendationStatus.statusName === "Approved") {
//         filteredArray.push(item);
//         setIsApproved(true);
//       } else if (item.recommendationStatus.statusName === "Rejected") {
//       } else {
//       }
//     });
//   };

//   // useEffect(() => {
//   //   trailfunction();
//   // }, []);

//   return (
//     <>
//       <Timeline
//         style={{
//           display: "flex",
//           flexDirection: "row",
//           marginTop: "",
//           marginLeft: 35,
//           marginRight: 10,
//           justifyContent: "center",
//           alignItems: "center",
//           // padding: '10px 0',
//           // marginTop:50
//         }}
//       >
//         {trailData.map((item, index) => (
//           <React.Fragment key={index}>
//             {index > 0 && (
//               <TimelineConnector
//                 style={{
//                   height: "1px",
//                   // width: '10px',
//                   backgroundColor: "#ccc",
//                   marginTop: 5,
//                 }}
//               />
//             )}

//             {item.recommendationStatus.statusName === "Rejected" &&
//             item.recommendationStatus.statusName !== "Approved" ? (
//               <div
//                 className="timelinedot"
//                 style={{
//                   width: "20px",
//                   height: "20px",
//                   borderRadius: "10px",
//                   backgroundColor: item.isStatusDone ? "#8BB610" : "grey",
//                   display: "flex",
//                   flexDirection: "column",
//                   alignItems: "center",
//                   margin: "0 5px",
//                 }}
//               >
//                 <Typography
//                   sx={{
//                     color: item.isStatusDone ? "#8BB610" : "grey",
//                     backgroundColor: "",
//                     marginTop: 3,
//                     textAlign: "center",
//                   }}
//                 >
//                   <div>
//                     <span>Approved/Rejected</span>
//                     {item.recommendationStatus.createdAt}
//                   </div>
//                 </Typography>
//               </div>
//             ) : item.recommendationStatus.statusName === "Approved" ? (
//               <div>
//                 {/* <span>Approved/Rejected</span>
//                 {item.recommendationStatus.createdAt} */}
//               </div>
//             ) : (
//               ""
//             )}

//             {item.recommendationStatus.statusName !== "Rejected" &&
//               item.recommendationStatus.statusName !== "Approved" && (
//                 <div
//                   className="timelinedot"
//                   style={{
//                     width: "20px",
//                     height: "20px",
//                     borderRadius: "10px",
//                     backgroundColor: item.isStatusDone ? "#8BB610" : "grey",
//                     display: "flex",
//                     flexDirection: "column",
//                     alignItems: "center",
//                     margin: "0 5px",
//                   }}
//                 >
//                   <Typography
//                     sx={{
//                       color: item.isStatusDone ? "#8BB610" : "grey",
//                       backgroundColor: "",
//                       marginTop: 3,
//                       textAlign: "center",
//                     }}
//                   >
//                     <div>{item.recommendationStatus.statusName}</div>
//                   </Typography>
//                 </div>
//               )}

//             {/* <div
//               className="timelinedot"
//               style={{
//                 width: "20px",
//                 height: "20px",
//                 borderRadius: "10px",
//                 backgroundColor: item.isStatusDone ? "#8BB610" : "grey",
//                 display: "flex",
//                 flexDirection: "column",
//                 alignItems: "center",
//                 margin: "0 5px",
//               }}
//             >
//               <Typography
//                 sx={{
//                   color: item.isStatusDone ? "#8BB610" : "grey",
//                   backgroundColor: "",
//                   marginTop: 3,
//                   textAlign: "center",
//                 }}
//               >
//                 {item.recommendationStatus.statusName}
//               </Typography>
//             </div> */}
//           </React.Fragment>
//         ))}
//       </Timeline>
//     </>
//   );
// };

// export default ViewTrail;

import React, { useEffect, useRef, useState } from "react";
import { Typography } from "@mui/material";

const customFontStyles = {
  // fontFamily: "Open Sans !important",
  // fontWeight: 600,
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
        backgroundColor: "",
        marginTop: 30,
      }}
    >
      {data.map((item, index) => (
        <React.Fragment key={index}>
          {/* {/ Colored Connector /} */}
          <div
            style={{
              flex: 1,
              height: "2px",
              background: item?.createdAt ? "lightgrey" : "lightgrey",
              marginTop: "7px",
              display: index === 0 ? "none" : "block",
            }}
          />

          {/* {/ Dot /} */}
          <div
            // ref={item.createdAt ? lastCreatedAtDivRef : null}
            id="testDiv"
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              backgroundColor: "",
              // margin: "0 8px",
              zIndex: 2,
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
            {/* {/ Text /} */}
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
            {/* {/ <br/> /} */}
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

const ViewTrail = ({ viewTrailData }) => {
  const apiResponse = viewTrailData.trailResponse;
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

  return <Timeline data={timelineData} timelineTexts={timelineTexts} />;
};

export default ViewTrail;
