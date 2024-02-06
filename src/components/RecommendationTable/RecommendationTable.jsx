import * as React from "react";
import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { Button, Grid, InputAdornment, Link, TextField } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import DoneIcon from "@mui/icons-material/Done";
import FilterAltOutlinedIcon from "@mui/icons-material/FilterAltOutlined";
import TableTimeline from "../Timeline/TableTimeline";
import { useState } from "react";

import {
  ACTION_TYPE_TABLE,
  AGM,
  APPLICATION_OWNER,
  APPROVED,
  OEM_RECOMMENDATION,
  RECOMMENDATION_ACCEPTED,
  RECOMMENDATION_REJECTED,
  REJECTED,
  REVIEW_PROCESS,
  VIEW_TYPE_TABLE,
} from "../../helper/constant";
import DetailedModal from "../Modals/DetailedModal";
import RejectModal from "../Modals/RejectModal";
import { useEffect } from "react";

const customFontStyles = {
  fontFamily: "Open Sans !important",
  fontWeight: 600,
};

const customTableHeadFontStyles = {
  fontFamily: "Open Sans !important",
  fontWeight: 600,
  color: "#FFFFFF",
  fontSize: "14px",
  bgcolor: "#464646",
};

const customTableBodyFontStyles = {
  fontFamily: "Open Sans !important",
  fontWeight: 600,
  color: "#7E7E7E",
  fontSize: "14px",
};

const customCollapseTableHeadFontStyles = {
  fontFamily: "Open Sans !important",
  fontWeight: 600,
  color: "#464646",
  fontSize: "12px",
};

const customCollapseTableBodyFontStyles = {
  fontFamily: "Open Sans !important",
  fontWeight: 600,
  color: "#7E7E7E",
  fontSize: "14px",
};

function Row(props) {
  const loginData = JSON.parse(sessionStorage.getItem("loginData"));
  const loggedUserType = loginData?.userType || "";

  // console.log("logged user type", loggedUserType);
  const {
    row,
    tableType,
    fetchAllPendingRecommendationForAppOwner,
    fetchAllApprovedRecommendationForAppOwner,
    fetchRecommendationAgmAndOem,
  } = props;
  // console.log('data in test', row)
  const [open, setOpen] = useState(false);
  const [approverOneModalOpen, setApproverOneModalOpen] = useState(false);
  const [approverTwoModalOpen, setApproverTwoModalOpen] = useState(false);
  const [isViewingDetails, setIsViewingDetails] = useState(false);
  const [isAgmRejected, setIsAgmRejected] = useState(false);
  const [isAppOwnerRejected, setIsAppOwnerRejected] = useState(false);
  const [isAcceptByAppOwnerAndAgm, setIsAcceptByAppOwnerAndAgm] =
    useState(false);

  useEffect(() => {
    if (row?.recommendationDeploymentDetails) {
      setIsAgmRejected(true);
    }

    if (!row?.recommendationDeploymentDetails) {
      setIsAgmRejected(false);
    }

    if (row && row?.isAppOwnerRejected === true) {
      setIsAppOwnerRejected(true);
    }

    if (
      row &&
      (row?.isAppOwnerRejected === false || row?.isAppOwnerRejected === null)
    ) {
      setIsAppOwnerRejected(false);
    }
  }, [row]);

  // HANDLE VIEW MODAL STARTS
  const handleViewDetailsOpen = (rowData) => {
    // console.log("button hit ");
    setIsViewingDetails(true);
    setApproverOneModalOpen(true);
  };

  // HANDLE VIEW MODAL ENDS

  // HANDLE ACCEPT MODAL STARTS
  const handleAcceptOpen = (rowData) => {
    // console.log('i got hit')
    if (rowData && rowData?.pastExperienceComment) {
      setIsAcceptByAppOwnerAndAgm(true);
    }
    setApproverOneModalOpen(true);
  };

  // HANDLE ACCEPT MODAL ENDS

  const handleApproverOneModalClose = () => {
    setIsViewingDetails(false);
    setIsAcceptByAppOwnerAndAgm(false);
    setApproverOneModalOpen(false);
  };

  const handleApproverTwoModalOpen = () => {
    setApproverTwoModalOpen(true);
  };

  const handleApproverTwoModalClose = () => {
    setApproverTwoModalOpen(false);
  };

  const printhello = () => {
    console.log("hello there");
  };

  const handleDateChange = (date) => {
    if (date) {
      const dateObject = new Date(date);
      const year = dateObject.getFullYear();
      const month = dateObject.getMonth() + 1;
      const day = dateObject.getDate();
      const formattedDate = `${day}/${month}/${year}`;

      // console.log(formattedDate);

      return formattedDate;
    }
  };

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
          <Typography sx={{ ...customTableBodyFontStyles }}>
            {formattedDate}
          </Typography>
          <Typography
            sx={{
              ...customTableBodyFontStyles,
              fontSize: "11px",
              fontWeight: 500,
            }}
          >
            {formattedTime}
          </Typography>
        </>
      );

      // return { formattedDate, formattedTime };
    }
  };

  const getStatusColor = (statusName) => {
    let color;

    if (statusName === APPROVED) {
      color = "#8BB610";
    } else if (statusName === REVIEW_PROCESS) {
      color = "#E27D20";
    } else if (statusName === REJECTED) {
      color = "#DC4040";
    } else if (statusName === OEM_RECOMMENDATION) {
      color = "#b9d370";
    } else if (statusName === RECOMMENDATION_ACCEPTED) {
      color = "#E27D20";
    } else if (statusName === RECOMMENDATION_REJECTED) {
      color = "#DC4040";
    } else {
      color = "#7E7E7E";
    }

    return color;
  };

  const collapseTableData = row?.recommendationDeploymentDetails || "";
  const trailResponse = row?.trailResponse || "";

  // console.log(' trail data', trailResponse)

  return (
    <React.Fragment>
      <TableRow
        sx={{
          bgcolor: "white",
          borderTop: "20px solid #ffffff00 !important",
          "& > *:first-of-type": {
            // "& > *:first-child": {

            borderTopLeftRadius: 12,
            borderBottomLeftRadius: open ? 0 : 12,
          },
          "& > *:last-child": {
            borderTopRightRadius: 12,
            borderBottomRightRadius: open ? 0 : 12,
          },
          "& > *": { border: "unset" },
        }}
      >
        <TableCell sx={{ ...customTableBodyFontStyles }} align="left">
          {row?.referenceId || "--"}
        </TableCell>
        <TableCell sx={{ ...customTableBodyFontStyles }} align="left">
          {handleDateAndTimeChange(row?.createdAt) || "--"}
        </TableCell>
        <TableCell sx={{ ...customTableBodyFontStyles }} align="left">
          {row?.recommendationType?.name || "--"}
        </TableCell>
        <TableCell
          sx={{
            ...customTableBodyFontStyles,
            fontWeight: 700,
            color: "#6F6F6F",
          }}
          align="left"
        >
          {row?.priority || "--"}
        </TableCell>
        <TableCell sx={{ ...customTableBodyFontStyles }} align="left">
          {handleDateChange(row?.recommendDate) || "--"}
        </TableCell>
        <TableCell sx={{ ...customTableBodyFontStyles }} align="left">
          {/* {isOemAndIt ? row?.impactedDepartment || "--" : row.department?.name || "--"} */}
          {row.department?.name || "--"}
        </TableCell>
        <TableCell sx={{ ...customTableBodyFontStyles }} align="left">
          {row.component?.name || "--"}
        </TableCell>
        {tableType && tableType === VIEW_TYPE_TABLE ? (
          <>
            <TableCell sx={{ ...customTableBodyFontStyles }} align="left">
              {row?.approver?.userName || "--"}
            </TableCell>
            <TableCell
              sx={{
                ...customTableBodyFontStyles,
                color: getStatusColor(row?.status?.statusName),
                fontWeight: 700,
              }}
              align="left"
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  width: "100%",
                }}
              >
                <Typography
                  sx={{
                    ...customCollapseTableBodyFontStyles,
                    color: getStatusColor(row?.status?.statusName),
                    fontWeight: 700,
                  }}
                >
                  {row?.status?.statusName || "--"}{" "}
                </Typography>
                <IconButton
                  aria-label="expand row"
                  size="small"
                  onClick={() => setOpen(!open)}
                >
                  {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                </IconButton>
              </Box>
            </TableCell>
          </>
        ) : null}

        {tableType && tableType === ACTION_TYPE_TABLE ? (
          <>
            {loggedUserType && loggedUserType === AGM ? (
              <>
                <TableCell sx={{ ...customTableBodyFontStyles }} align="left">
                  {row?.appOwner?.userName || "--"}
                </TableCell>
                <TableCell
                  sx={{
                    ...customTableBodyFontStyles,
                    color: getStatusColor(row?.status?.statusName),
                    fontWeight: 700,
                  }}
                  align="left"
                >
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      width: "100%",
                    }}
                  >
                    <Typography
                      sx={{
                        ...customCollapseTableBodyFontStyles,
                        color: getStatusColor(row?.status?.statusName),
                        fontWeight: 700,
                      }}
                    >
                      {row?.status?.statusName || "--"}{" "}
                    </Typography>
                    <IconButton
                      aria-label="expand row"
                      size="small"
                      onClick={() => setOpen(!open)}
                    >
                      {open ? (
                        <KeyboardArrowUpIcon />
                      ) : (
                        <KeyboardArrowDownIcon />
                      )}
                    </IconButton>
                  </Box>
                </TableCell>
              </>
            ) : (
              <>
                <TableCell
                  sx={{
                    ...customTableBodyFontStyles,
                    fontWeight: 700,
                  }}
                  align="left"
                >
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      width: "100%",
                    }}
                  >
                    <Typography
                      sx={{
                        ...customCollapseTableBodyFontStyles,
                      }}
                    >
                      {row?.createdBy?.userName || "--"}{" "}
                    </Typography>
                    <IconButton
                      aria-label="expand row"
                      size="small"
                      onClick={() => setOpen(!open)}
                    >
                      {open ? (
                        <KeyboardArrowUpIcon />
                      ) : (
                        <KeyboardArrowDownIcon />
                      )}
                    </IconButton>
                  </Box>
                </TableCell>
              </>
            )}
          </>
        ) : null}
      </TableRow>

      <TableRow
        sx={{
          "& > *": { border: "unset" },
        }}
      >
        <TableCell
          style={{ padding: 0, margin: 0, width: "100%" }}
          colSpan={12}
        >
          <Collapse
            in={open}
            timeout="auto"
            unmountOnExit
            sx={{
              width: "100%",
              bgcolor: "#ffffff",
              // borderTopLeftRadius: open ? 0 : 12,
              borderTopLeftRadius: 0,
              borderBottomLeftRadius: 12,
              // borderTopRightRadius: open ? 0 : 12,
              borderTopRightRadius: 0,
              borderBottomRightRadius: 12,
              // boxShadow: open ? "0 3px 5px rgba(0, 0, 0, 0.4)" : 0,
            }}
          >
            <Box sx={{ paddingLeft: "12px", marginTop: "50px" }}>
              <Grid container spacing={2}>
                <Grid item xs={2.5} sm={2.5} md={2.5} lg={2.5}>
                  <Typography
                    sx={{
                      ...customCollapseTableHeadFontStyles,
                      color: row?.descriptions ? "#464646" : "#7E7E7E",
                    }}
                  >
                    Description
                  </Typography>

                  <Typography sx={{ ...customCollapseTableBodyFontStyles }}>
                    {row?.descriptions || "--"}
                  </Typography>
                </Grid>

                <Grid item xs={2} sm={2} md={2} lg={2}>
                  <Typography
                    sx={{
                      ...customCollapseTableHeadFontStyles,
                      color: handleDateChange(
                        collapseTableData?.developmentStartDate
                      )
                        ? "#464646"
                        : "#7E7E7E",
                    }}
                  >
                    Development start date
                  </Typography>

                  <Typography sx={{ ...customCollapseTableBodyFontStyles }}>
                    {handleDateChange(
                      collapseTableData?.developmentStartDate
                    ) || "--"}
                  </Typography>
                </Grid>

                <Grid item xs={2} sm={2} md={2} lg={2}>
                  <Typography
                    sx={{
                      ...customCollapseTableHeadFontStyles,
                      color: handleDateChange(
                        collapseTableData?.developementEndDate
                      )
                        ? "#464646"
                        : "#7E7E7E",
                    }}
                  >
                    Development end date
                  </Typography>

                  <Typography sx={{ ...customCollapseTableBodyFontStyles }}>
                    {handleDateChange(collapseTableData?.developementEndDate) ||
                      "--"}
                  </Typography>
                </Grid>

                <Grid item xs={2} sm={2} md={2} lg={2}>
                  <Typography
                    sx={{
                      ...customCollapseTableHeadFontStyles,
                      color: handleDateChange(
                        collapseTableData?.testCompletionDate
                      )
                        ? "#464646"
                        : "#7E7E7E",
                    }}
                  >
                    Test completion date
                  </Typography>

                  <Typography sx={{ ...customCollapseTableBodyFontStyles }}>
                    {handleDateChange(collapseTableData?.testCompletionDate) ||
                      "--"}
                  </Typography>
                </Grid>

                <Grid item xs={1.8} sm={1.8} md={1.8} lg={1.8}>
                  <Typography
                    sx={{
                      ...customCollapseTableHeadFontStyles,
                      color: handleDateChange(collapseTableData?.deploymentDate)
                        ? "#464646"
                        : "#7E7E7E",
                    }}
                  >
                    Deployment date
                  </Typography>

                  <Typography sx={{ ...customCollapseTableBodyFontStyles }}>
                    {handleDateChange(collapseTableData?.deploymentDate) ||
                      "--"}
                  </Typography>
                </Grid>

                <Grid item xs={1.5} sm={1.5} md={1.5} lg={1.5}>
                  <Typography
                    sx={{
                      ...customCollapseTableHeadFontStyles,
                      color: handleDateChange(
                        collapseTableData?.impactedDepartment
                      )
                        ? "#464646"
                        : "#7E7E7E",
                    }}
                  >
                    Impacted department
                  </Typography>

                  <Typography sx={{ ...customCollapseTableBodyFontStyles }}>
                    {collapseTableData?.impactedDepartment || "--"}
                  </Typography>
                </Grid>

                {tableType && tableType === VIEW_TYPE_TABLE ? (
                  <>
                    <Grid item xs={12} sm={12} md={12} lg={12}>
                      <Box sx={{ width: "100%", marginTop: "30px" }}>
                        <TableTimeline apiResponse={trailResponse} />
                      </Box>
                    </Grid>

                    <Grid item xs={12} sm={12} md={12} lg={12}>
                      <Box
                        sx={{
                          width: "100%",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          marginTop: "20px",
                          marginBottom: "40px",
                        }}
                      >
                        <Link
                          // onClick={printhello}
                          onClick={() => handleViewDetailsOpen(row)}
                          sx={{
                            textAlign: "center",
                            textDecoration: "underline",
                            fontWeight: "600",
                            fontSize: "20px",
                            color: "black",
                            cursor: "pointer",
                            userSelect: "none",
                          }}
                        >
                          VIEW DETAILS
                        </Link>
                      </Box>
                    </Grid>
                  </>
                ) : null}

                {tableType && tableType === ACTION_TYPE_TABLE ? (
                  <Grid item xs={12} sm={12} md={12} lg={12}>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        width: "99%",
                        bgcolor: "#d7f3fb66",
                        minHeight: "5em",
                        height: "5em",
                        mt: "3em",
                        mb: "2em",
                      }}
                    >
                      <Box
                        sx={{ display: "flex", flexDirection: "row", gap: 2 }}
                      >
                        <Button
                          variant="outlined"
                          onClick={handleApproverTwoModalOpen}
                          sx={{
                            color: "#281C61",
                            borderColor: "#281C61",
                            fontWeight: "bold",
                            width: "7.5em",
                            bgcolor: "#D7F3FB",
                            "&:hover": { borderColor: "#322475" },
                          }}
                        >
                          REJECT
                        </Button>
                        <Button
                          variant="contained"
                          sx={{
                            bgcolor: "#281C61",
                            width: "7.5em",
                            "&:hover": {
                              bgcolor: "#322475",
                              overflow: "hidden",
                            },
                            fontWeight: "bold",
                          }}
                          onClick={(e) =>
                            loggedUserType === APPLICATION_OWNER ||
                            loggedUserType === AGM
                              ? handleAcceptOpen(row)
                              : printhello()
                          }
                        >
                          {isAppOwnerRejected ? "REVERT" : "ACCEPT"}
                        </Button>
                      </Box>
                    </Box>
                  </Grid>
                ) : null}
              </Grid>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
      {approverOneModalOpen && (
        <DetailedModal
          rowData={row}
          isViewingDetails={isViewingDetails}
          isAgmRejected={isAgmRejected}
          isAppOwnerRejected={isAppOwnerRejected}
          isAcceptByAppOwnerAndAgm={isAcceptByAppOwnerAndAgm}
          approverOneModalOpen={approverOneModalOpen}
          handleApproverOneModalClose={handleApproverOneModalClose}
          fetchAllPendingRecommendationForAppOwner={
            fetchAllPendingRecommendationForAppOwner
          }
          fetchAllApprovedRecommendationForAppOwner={
            fetchAllApprovedRecommendationForAppOwner
          }
          fetchRecommendationAgmAndOem={fetchRecommendationAgmAndOem}
        />
      )}
      {approverTwoModalOpen && (
        <RejectModal
          rowData={row}
          approverTwoModalOpen={approverTwoModalOpen}
          handleApproverTwoModalClose={handleApproverTwoModalClose}
          fetchAllPendingRecommendationForAppOwner={
            fetchAllPendingRecommendationForAppOwner
          }
          fetchAllApprovedRecommendationForAppOwner={
            fetchAllApprovedRecommendationForAppOwner
          }
          fetchRecommendationAgmAndOem={fetchRecommendationAgmAndOem}
        />
      )}
    </React.Fragment>
  );
}

export default function RecommendationTable({
  tableData,
  tableTitle,
  tableType,
  isOemAndIt,
  fetchAllPendingRecommendationForAppOwner,
  fetchAllApprovedRecommendationForAppOwner,
  fetchRecommendationAgmAndOem,
}) {
  // console.log('tab data:  ', tableData)

  const loginData = JSON.parse(sessionStorage.getItem("loginData"));
  const loggedUserType = loginData?.userType || "";

  // console.log("logged user type", loggedUserType);
  return (
    <Grid container>
      <Grid item xs={12} sm={12} md={12} lg={12}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            height: "4.5em",
            maxHeight: "4.5em",
          }}
        >
          <Box>
            <Typography
              sx={{ ...customFontStyles, color: "#281C61", fontSize: "20px" }}
            >
              {tableTitle}
              {/* Recommendation status */}
            </Typography>
          </Box>

          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <TextField
              id="outlined-end-adornment"
              variant="outlined"
              size="small"
              fullWidth
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <SearchIcon />
                  </InputAdornment>
                ),
                style: {
                  borderRadius: "12px",
                  borderColor: "#858585",
                  width: "15em",
                  background: "#ffffff",
                },
              }}
            />

            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                minWidth: "120px",
                justifyContent: "center",
                alignItems: "center",
                gap: 1,
              }}
            >
              <DoneIcon sx={{ fontSize: "24px" }} />
              <Typography
                sx={{ ...customFontStyles, color: "#6C757D", fontSize: "16px" }}
              >
                Sort by
              </Typography>
            </Box>
            <Typography
              sx={{
                fontSize: "20px",
                fontWeight: 400,
                color: "#2A2A2A",
                paddingX: "5px",
              }}
            >
              |
            </Typography>

            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                minWidth: "120px",
                justifyContent: "center",
                alignItems: "center",
                gap: 1,
              }}
            >
              <FilterAltOutlinedIcon sx={{ fontSize: "24px" }} />
              <Typography
                sx={{ ...customFontStyles, color: "#6C757D", fontSize: "16px" }}
              >
                Filters
              </Typography>
            </Box>
          </Box>
        </Box>
      </Grid>
      <Grid item xs={12} sm={12} md={12} lg={12}>
        <TableContainer
          sx={{
            "& > *": { border: "unset" },
            overflow: "auto",

            maxHeight: "580px",
            scrollbarWidth: "thin",
            scrollbarColor: "#B5B5B5 transparent",
            "&::-webkit-scrollbar": {
              width: "8px",
            },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: "#B5B5B5",
              borderRadius: "8px",
            },
            "&::-webkit-scrollbar-track": {
              backgroundColor: "transparent",
            },

            // DOUBTFUL ROW GAP MIGHT NOT WORK IN BUILD

            "& .css-1ex1afd-MuiTableCell-root": {
              borderBottom: "25px solid rgb(224 224 224 / 0%)",
            },
          }}
        >
          <Table
            stickyHeader
            // aria-label="simple table"
            sx={{ width: "100%", "& > *": { border: "unset" } }}
          >
            <TableHead
              sx={
                {
                  // borderTop: "20px solid #ffffff00",
                  //  borderBottom:'20px solid #ffffff00',
                }
              }
            >
              <TableRow
                sx={{
                  bgcolor: "#464646",
                  "& > *:first-of-type": {
                    // "& > *:first-child": {
                    borderTopLeftRadius: 10,
                    borderBottomLeftRadius: 10,
                  },
                  "& > *:last-child": {
                    borderTopRightRadius: 10,
                    borderBottomRightRadius: 10,
                  },
                  "& > *": { border: "unset" },
                  // position:'sticky !important',
                  // top:-10
                }}
              >
                <TableCell
                  sx={{
                    ...customTableHeadFontStyles,
                    color: "#FFFFFF",
                    minWidth: "132px",
                    maxWidth: "132px",
                  }}
                  align="left"
                >
                  Reference ID
                </TableCell>
                <TableCell
                  sx={{
                    ...customTableHeadFontStyles,
                    color: "#FFFFFF",
                    minWidth: "120px",
                    maxWidth: "120px",
                  }}
                  align="left"
                >
                  Created on
                </TableCell>
                <TableCell
                  sx={{
                    ...customTableHeadFontStyles,
                    color: "#FFFFFF",
                    minWidth: "140px",
                    maxWidth: "140px",
                  }}
                  align="left"
                >
                  Type
                </TableCell>
                <TableCell
                  sx={{
                    ...customTableHeadFontStyles,
                    color: "#FFFFFF",
                    minWidth: "110px",
                    maxWidth: "110px",
                  }}
                  align="left"
                >
                  Priority
                </TableCell>
                <TableCell
                  sx={{
                    ...customTableHeadFontStyles,
                    color: "#FFFFFF",
                    minWidth: "180px",
                    maxWidth: "180px",
                  }}
                  align="left"
                >
                  Recommended end date
                </TableCell>
                <TableCell
                  sx={{
                    ...customTableHeadFontStyles,
                    color: "#FFFFFF",
                    minWidth: "150px",
                    maxWidth: "150px",
                  }}
                  align="left"
                >
                  Department
                </TableCell>
                <TableCell
                  sx={{
                    ...customTableHeadFontStyles,
                    color: "#FFFFFF",
                    minWidth: "150px",
                    maxWidth: "150px",
                  }}
                  align="left"
                >
                  Component name
                </TableCell>
                {tableType && tableType === VIEW_TYPE_TABLE ? (
                  <>
                    <TableCell
                      sx={{
                        ...customTableHeadFontStyles,
                        color: "#FFFFFF",
                        minWidth: "150px",
                        maxWidth: "150px",
                      }}
                      align="left"
                    >
                      Approver
                    </TableCell>
                    <TableCell
                      sx={{
                        ...customTableHeadFontStyles,
                        color: "#FFFFFF",
                        minWidth: "195px",
                        maxWidth: "195px",
                      }}
                      align="left"
                    >
                      Status
                    </TableCell>
                  </>
                ) : null}

                {tableType && tableType === ACTION_TYPE_TABLE ? (
                  <>
                    {loggedUserType && loggedUserType === AGM ? (
                      <>
                        <TableCell
                          sx={{
                            ...customTableHeadFontStyles,
                            color: "#FFFFFF",
                            minWidth: "150px",
                            maxWidth: "150px",
                          }}
                          align="left"
                        >
                          Application Owner
                        </TableCell>
                        <TableCell
                          sx={{
                            ...customTableHeadFontStyles,
                            color: "#FFFFFF",
                            minWidth: "195px",
                            maxWidth: "195px",
                          }}
                          align="left"
                        >
                          Status
                        </TableCell>
                      </>
                    ) : (
                      <>
                        <TableCell
                          sx={{
                            ...customTableHeadFontStyles,
                            color: "#FFFFFF",
                            minWidth: "195px",
                            maxWidth: "195px",
                          }}
                          align="left"
                        >
                          Sent by
                        </TableCell>
                      </>
                    )}
                  </>
                ) : null}
              </TableRow>
            </TableHead>
            <TableBody
              sx={{
                marginTop: "10px",
                borderTop: "20px solid #ffffff00",
                color: "#7E7E7E",
              }}
            >
              {/* {rows.map((row, index) => (
              <Row key={index} row={row} />
            ))} */}

              {tableData && tableData.length > 0 ? (
                tableData.map((rowData) => (
                  <Row
                    key={rowData.id}
                    row={rowData}
                    tableType={tableType}
                    isOemAndIt={isOemAndIt}
                    fetchAllPendingRecommendationForAppOwner={
                      fetchAllPendingRecommendationForAppOwner
                    }
                    fetchAllApprovedRecommendationForAppOwner={
                      fetchAllApprovedRecommendationForAppOwner
                    }
                    fetchRecommendationAgmAndOem={fetchRecommendationAgmAndOem}
                  />
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={9} align="center">
                    No data
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>
    </Grid>
  );
}
