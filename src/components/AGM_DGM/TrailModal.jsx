import React from "react";
import {
  Modal,
  Backdrop,
  Fade,
  Paper,
  Typography,
  Button,
} from "@mui/material";
import Timeline from "@mui/lab/Timeline";
import TimelineItem from "@mui/lab/TimelineItem";
import TimelineSeparator from "@mui/lab/TimelineSeparator";
import TimelineConnector from "@mui/lab/TimelineConnector";
import TimelineContent from "@mui/lab/TimelineContent";
import TimelineDot from "@mui/lab/TimelineDot";
import TimelineIcon from "@mui/icons-material/Timeline";
import Box from "@mui/material/Box";
import "../../css/Timeline.css";

const TrailModal = ({ tableData }) => {
  let messageConstants = [];

  if (
    Array.isArray(tableData?.messageList) &&
    tableData.messageList.length > 0
  ) {
    messageConstants = tableData.messageList.map((message, index) => ({
      userName: message?.createdBy?.userName,
      rejectionReason: message?.rejectionReason,
      additionalMessage: message?.additionalMessage,
      time: message?.createdAt,
      key: index,
    }));
  } else {
    console.log("Message list is not defined or is empty");
  }

  const formatDate2 = (dateString) => {
    if (!dateString) {
      return "";
    }

    const date = new Date(dateString);
    const options = {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    };

    const formattedDate = new Intl.DateTimeFormat("en-IN", options).format(
      date
    );

    return formattedDate;
  };

  return (
    // <>
    //   <div style={{ backgroundColor: "" }}>
    //     <Timeline>
    //       {messageConstants.map((message) => (
    //         <TimelineItem
    //           key={message.key}
    //           sx={{ alignItems: "center", justifyContent: "center" }}
    //         >
    //           <TimelineSeparator>
    //             <TimelineDot>
    //               <TimelineIcon />
    //             </TimelineDot>
    //             <TimelineConnector />
    //           </TimelineSeparator>
    //           <TimelineContent>
    //             <Typography>{message.userName}</Typography>

    //             <Box>
    //               <Typography>{message.rejectionReason}</Typography>
    //               <Typography>{message.additionalMessage}</Typography>
    //             </Box>

    //             <Typography>{formatDate2(message.time)}</Typography>
    //           </TimelineContent>
    //         </TimelineItem>
    //       ))}
    //     </Timeline>
    //   </div>
    // </>

    ////////////
    <Timeline>
      {messageConstants.map((message) => (
        <TimelineItem key={message.key}>
          <TimelineSeparator>
            <TimelineDot sx={{ backgroundColor: "black" }} />
            <TimelineConnector sx={{ backgroundColor: "black" }} />
          </TimelineSeparator>
          <TimelineContent>
            <Typography
              sx={{
                color: "rgba(73, 80, 87, 0.6)",
                fontSize: "14px",
                fontWeight: 600,
              }}
            >
              {message.userName}
            </Typography>
            <Box>
              <Typography
                sx={{
                  fontSize: "16px",
                  fontFamily: "openSans",
                  fontWeight: 600,
                }}
              >
                {message.rejectionReason}
              </Typography>
              <Typography
                sx={{
                  fontSize: "16px",
                  fontFamily: "openSans",
                  fontWeight: 600,
                }}
              >
                {message.additionalMessage}
              </Typography>
            </Box>
            <Typography
              sx={{ color: "rgba(73, 80, 87, 0.4)", fontWeight: 400 }}
            >
              {formatDate2(message.time)}
            </Typography>
          </TimelineContent>
        </TimelineItem>
      ))}
    </Timeline>
    ///////////

    // <div
    //   style={{
    //     display: "flex",
    //     width: "93%",
    //     minHeight: "4em",
    //     overflow: "hidden",
    //     position: "relative",
    //     paddingLeft: 85,
    //     backgroundColor: "",
    //     marginTop: 30,
    //   }}
    // >
    //   {messageConstants.map((item, index) => (
    //     <React.Fragment key={index}>
    //       {/* {/ Colored Connector /} */}
    //       <div
    //         style={{
    //           flex: 1,
    //           height: "2px",
    //           background: "lightgrey",
    //           marginTop: "7px",
    //           display: index === 0 ? "none" : "block",
    //         }}
    //       />

    //       {/* {/ Dot /} */}
    //       <div
    //         // ref={item.createdAt ? lastCreatedAtDivRef : null}
    //         id="testDiv"
    //         style={{
    //           display: "flex",
    //           flexDirection: "column",
    //           alignItems: "center",
    //           backgroundColor: "",
    //           // margin: "0 8px",
    //           zIndex: 2,
    //         }}
    //       >
    //         <div
    //           style={{
    //             width: "16px",
    //             height: "16px",
    //             borderRadius: "50%",
    //             background: item?.createdAt ? "#8BB610" : "#AAAAAA",
    //             marginBottom: "4px",
    //             marginRight:
    //               index === messageConstants.length - 1 ? "70px" : "0",
    //           }}
    //         />
    //         {/* {/ Text /} */}
    //         <Typography
    //           //  component={'span'} variant={'body2'}
    //           sx={{
    //             whiteSpace: "nowrap",
    //             position: "absolute",
    //             top: 18,
    //             marginRight:
    //               index === messageConstants.length - 1 ? "70px" : "0",
    //           }}
    //         >
    //           {/* {message.userName} */}
    //           {messageConstants[index].userName}
    //         </Typography>
    //         {/* {/ <br/> /} */}
    //         <Typography></Typography>
    //       </div>
    //     </React.Fragment>
    //   ))}
    // </div>

    // <>
    //   <div style={{ backgroundColor: "" }}>
    //     <div className="custom-timeline">
    //       {messageConstants.map((message, index) => (
    //         <div key={index} className="custom-timeline-item">
    //           <div className="custom-timeline-dot" />
    //           <div className="custom-timeline-content">
    //             <Typography
    //               sx={{
    //                 color: "rgba(73, 80, 87, 0.6)",
    //                 fontSize: "14px",
    //                  fontFamily: "openSans",
    //                 fontWeight: 600,
    //               }}
    //             >
    //               {message.userName}
    //             </Typography>
    //             <Box>
    //               <Typography
    //                 sx={{
    //                   fontSize: "16px",
    //                   fontFamily: "openSans",
    //                   fontWeight: 600,
    //                 }}
    //               >
    //                 {message.rejectionReason}
    //               </Typography>
    //               <Typography
    //                 sx={{
    //                   fontSize: "16px",
    //                   fontFamily: "openSans",
    //                   fontWeight: 600,
    //                 }}
    //               >
    //                 {message.additionalMessage}
    //               </Typography>
    //             </Box>
    //             <Typography
    //               sx={{
    //                 color: "rgba(73, 80, 87, 0.4)",
    //                 fontSize: "14px",
    //                 // fontFamily: "openSans",
    //                 fontWeight: 400,
    //               }}
    //             >
    //               {formatDate2(message.time)}
    //             </Typography>
    //           </div>
    //           {index !== messageConstants.length - 1 && (
    //             <div className="custom-timeline-connector" />
    //           )}
    //         </div>
    //       ))}
    //     </div>
    //   </div>
    // </>
  );
};
export default TrailModal;
