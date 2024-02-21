import React, { useEffect, useState } from "react";
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
import SearchIcon from "@mui/icons-material/Search";
import CheckIcon from "@mui/icons-material/Check";
import FilterAltOutlinedIcon from "@mui/icons-material/FilterAltOutlined";

// adding the snackbar component
import AlertComponent from "../components/AlertComponent";
// this is the parent table component

import {
  OEM_SI,
  APPLICATION_OWNER,
  AGM,
  GM_IT_INFRA,
  ACTION_TYPE_TABLE,
  VIEW_TYPE_TABLE,
  APPROVED,
  REVIEW_PROCESS,
  REJECTED,
  OEM_RECOMMENDATION,
  RECOMMENDATION_ACCEPTED,
  RECOMMENDATION_REJECTED,
} from "../constants/constant";

import ParentModal from "../components/ParentModal";
import RejectModal from "../components/RejectModal";
import { Button, Grid, InputAdornment, TextField } from "@mui/material";
import { Link } from "react-router-dom";
import Timeline from "../components/Timeline";

const loginInfo = JSON.parse(sessionStorage.getItem("loginresponse"));
// console.log("login information inside parent table", loginInfo);
const loggedInUser = loginInfo?.userType || "";

function Row(props) {
  // useStates for snackbar
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  // useStates for viewing
  const [agmRejected, setAgmRejected] = useState(false);
  const [appOwnerRejected, setAppOwnerRejected] = useState(false);
  const [acceptByAppownerAndAgm, setAcceptByAppownerAndAgm] = useState(false);
  // handleing the modals
  const [openRejectModal, setOpenRejectModal] = useState(false);
  const [openParentModal, setOpenParentModal] = useState(false);
  const [viewDetailsModalData, setViewDetailsModalData] = useState({});
  const [viewDetailsModal, setViewDetailsModal] = useState(false);

  const [impactedDepartment, setImpactedDepartment] = useState([]);

  // snackbar close function
  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  // Handling the opening and closing of Modals

  const handleViewDetailsModal = (rowData) => {
    setViewDetailsModalData(rowData);
    setViewDetailsModal(true);
    // setOpenAcceptModal(true);
    setOpenParentModal(true);
  };

  const handleViewDetailsModalClose = () => {
    setViewDetailsModal(false);
    setOpenParentModal(true);
  };

  const handleAcceptModal = (rowData) => {
    if (rowData && rowData?.pastExperienceComment) {
      setAcceptByAppownerAndAgm(true);
    }
    setViewDetailsModalData(rowData);
    setOpenParentModal(true);
  };

  const handleAcceptModalClose = () => {
    setOpenParentModal(false);
  };

  const handleParentModalOpen = () => {
    setOpenParentModal(true);
  };

  const handleParentModalClose = () => {
    setOpenParentModal(false);
    setViewDetailsModal(false);
    setAcceptByAppownerAndAgm(false);
  };

  const handleRejectModalOpen = () => {
    setOpenRejectModal(true);
  };

  const handleRejectModalClose = () => {
    setOpenRejectModal(false);
  };

  const { row, tableType } = props;

  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (row?.recommendationDeploymentDetails) {
      setAgmRejected(true);
    }

    if (!row?.recommendationDeploymentDetails) {
      setAgmRejected(false);
    }

    if (row && row?.isAppOwnerRejected === true) {
      setAppOwnerRejected(true);
    }

    if (
      (row && row?.isAppOwnerRejected === false) ||
      row?.isAppOwnerRejected === null
    ) {
      setAppOwnerRejected(false);
    }
  }, [row]);

  const collapsibleData = row?.recommendationDeploymentDetails || "";
  const timelineData = row?.trailResponse || "";

  // changing the status color
  const statusColor = (statusName) => {
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

  // convert the dates into dd/mm/yyyy format
  const handleDateChange = (date) => {
    if (date) {
      const dateObject = new Date(date);
      const year = dateObject.getFullYear();
      const month = dateObject.getMonth() + 1;
      const day = dateObject.getDate();
      const formattedDate = `${day}/${month}/${year}`;
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
          <Typography>{formattedDate}</Typography>
          <Typography>{formattedTime}</Typography>
        </>
      );
    }
  };

  //

  return (
    <React.Fragment>
      <TableRow sx={{ bgcolor: "#fff", "& > *": { border: "unset" } }}>
        <TableCell>{row?.referenceId || "--"}</TableCell>
        <TableCell>{handleDateAndTimeChange(row?.createdAt) || "--"}</TableCell>
        <TableCell>{row?.recommendationType?.name || "--"}</TableCell>
        <TableCell>{row?.priority || "--"}</TableCell>
        <TableCell>
          {handleDateAndTimeChange(row?.recommendDate) || "--"}
        </TableCell>
        <TableCell>{row.department?.name || "--"}</TableCell>
        <TableCell>{row.component?.name || "--"}</TableCell>

        {tableType && tableType === VIEW_TYPE_TABLE ? (
          <>
            <TableCell>{row?.approver?.userName || "--"}</TableCell>
            <TableCell sx={{ color: statusColor(row?.status?.statusName) }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Typography
                  sx={{ color: statusColor(row?.status?.statusName) }}
                >
                  {row?.status?.statusName || "--"}
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
            {loggedInUser && loggedInUser === AGM ? (
              <>
                <TableCell>{row?.appOwner?.userName}</TableCell>
                <TableCell sx={{ color: statusColor(row?.status?.statusName) }}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      width: "100%",
                    }}
                  >
                    <Typography
                      sx={{ color: statusColor(row?.status?.statusName) }}
                    >
                      {row?.status?.statusName || "--"}
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
              <TableCell>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    width: "100%",
                  }}
                >
                  <Typography>{row?.createdBy?.userName || "--"}</Typography>
                  <IconButton
                    aria-label="expand row"
                    size="small"
                    onClick={() => setOpen(!open)}
                  >
                    {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                  </IconButton>
                </Box>
              </TableCell>
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
            sx={{ width: "100%", bgcolor: "#fff" }}
          >
            <Box sx={{ marginTop: "2em", paddingLeft: "10px" }}>
              <Grid container spacing={1}>
                <Grid item xs={2}>
                  <Typography>Description</Typography>
                  <Typography>{row?.descriptions || ""}</Typography>
                </Grid>
                <Grid item xs={2}>
                  <Typography> Development Start Date</Typography>
                  <Typography>
                    {handleDateChange(collapsibleData?.developmentStartDate) ||
                      ""}
                  </Typography>
                </Grid>

                <Grid item xs={2}>
                  <Typography>Development end Date</Typography>
                  <Typography>
                    {handleDateChange(collapsibleData?.developementEndDate) ||
                      "--"}
                  </Typography>
                </Grid>

                <Grid item xs={2}>
                  <Typography>Test Completion Date</Typography>
                  <Typography>
                    {handleDateChange(collapsibleData?.testCompletionDate) ||
                      "--"}
                  </Typography>
                </Grid>
                <Grid item xs={2}>
                  <Typography>Deployment Date</Typography>
                  <Typography>
                    {handleDateChange(collapsibleData?.deploymentDate) || "--"}
                  </Typography>
                </Grid>
                <Grid item xs={2}>
                  <Typography> Impacted department</Typography>
                  <Typography>
                    {collapsibleData?.impactedDepartment || "--"}
                  </Typography>
                </Grid>

                {tableType && tableType === VIEW_TYPE_TABLE ? (
                  <>
                    <Grid item xs={12}>
                      <Box
                        sx={{
                          width: "100%",
                          marginTop: "1rem",
                          // backgroundColor: "red",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <Timeline apiResponse={timelineData} />
                      </Box>
                    </Grid>

                    <Grid item xs={12}>
                      <Box
                        sx={{
                          width: "100%",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          marginBottom: "1rem",
                          marginTop: "1rem",
                          // backgroundColor: "red",
                        }}
                      >
                        <Link
                          onClick={() => handleViewDetailsModal(row)}
                          sx={{
                            cursor: "pointer",
                            textAlign: "center",
                            fontSize: "3rem",
                          }}
                        >
                          VIEW DETAILS
                        </Link>
                      </Box>
                    </Grid>
                  </>
                ) : null}

                {tableType && tableType === ACTION_TYPE_TABLE ? (
                  <Grid item xs={12}>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          gap: "2em",
                          marginBottom: "0.7em",
                          marginTop: "0.7em",
                        }}
                      >
                        <Button
                          variant="outlined"
                          sx={{ color: "#281C61", bgcolor: "#D7F3FB" }}
                          onClick={handleRejectModalOpen}
                        >
                          REJECT
                        </Button>
                        <Button
                          variant="contained"
                          sx={{ bgcolor: "#281C61" }}
                          onClick={(e) =>
                            loggedInUser === APPLICATION_OWNER ||
                            loggedInUser === AGM
                              ? handleAcceptModal(row)
                              : null
                          }
                        >
                          {appOwnerRejected ? "REVERT" : "ACCEPT"}
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
      {openParentModal && (
        <ParentModal
          rowData={row}
          isViewingDetails={viewDetailsModal}
          isAgmRejected={agmRejected}
          isAppOwnerRejected={appOwnerRejected}
          isAcceptByAppOwnerAndAgm={acceptByAppownerAndAgm}
          approverOneModalOpen={openParentModal}
          handleApproverOneModalClose={handleParentModalClose}
          snackbarOpen={snackbarOpen}
          snackbarMessage={snackbarMessage}
          snackbarSeverity={snackbarSeverity}
          setSnackbarOpen={setSnackbarOpen}
          setSnackbarMessage={setSnackbarMessage}
          setSnackbarSeverity={setSnackbarSeverity}
        />
      )}

      {openRejectModal && (
        <RejectModal
          rowData={row}
          approverTwoModalOpen={openRejectModal}
          handleApproverTwoModalClose={handleRejectModalClose}
          snackbarOpen={snackbarOpen}
          snackbarMessage={snackbarMessage}
          snackbarSeverity={snackbarSeverity}
          setSnackbarOpen={setSnackbarOpen}
          setSnackbarMessage={setSnackbarMessage}
          setSnackbarSeverity={setSnackbarSeverity}
        />
      )}

      {/* alert component here */}
      <AlertComponent
        open={snackbarOpen}
        handleClose={handleSnackbarClose}
        severity={snackbarSeverity}
        message={snackbarMessage}
      />
    </React.Fragment>
  );
}

const ParentTable = ({ tableData, tableType, tableTitle }) => {
  return (
    <>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: "1em",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
          }}
        >
          <Typography
            sx={{
              color: "#281C61",
              fontSize: "20px",
              fontWeight: "bold",
            }}
          >
            {/* Recommendation status */}
            {tableTitle}
          </Typography>
        </Box>
        <Box
          sx={{
            display: "flex",
            // backgroundColor: "yellow",
            // justifyContent: "space-between",
            width: "30em",
          }}
        >
          <TextField
            id="outlined-basic"
            variant="outlined"
            size="small"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              // backgroundColor: "green",
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                marginRight: "0.5em",
              }}
            >
              <IconButton>
                <CheckIcon sx={{ fontSize: "1.9rem" }} />
              </IconButton>
              <Typography sx={{ color: "gray" }}>Sort By</Typography>
            </Box>
            <Typography> | </Typography>

            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                marginLeft: "0.5em",
              }}
            >
              <FilterAltOutlinedIcon sx={{ fontSize: "1.9rem" }} />
              <Typography sx={{ color: "gray" }}>Filters</Typography>
            </Box>
          </Box>
        </Box>
      </Box>

      <TableContainer sx={{ overflow: "auto", maxHeight: "500px" }}>
        <Table
          aria-label="collapsible table"
          sx={{ width: "100%" }}
          stickyHeader
        >
          <TableHead>
            <TableRow>
              <TableCell
                align="left"
                sx={{ color: "#fff", backgroundColor: "black" }}
              >
                ReferenceId
              </TableCell>
              <TableCell
                align="left"
                sx={{ color: "#fff", backgroundColor: "black" }}
              >
                createdOn
              </TableCell>
              <TableCell
                align="left"
                sx={{ color: "#fff", backgroundColor: "black" }}
              >
                Type
              </TableCell>
              <TableCell
                align="left"
                sx={{ color: "#fff", backgroundColor: "black" }}
              >
                Priority
              </TableCell>
              <TableCell
                align="left"
                sx={{ color: "#fff", backgroundColor: "black" }}
              >
                Recommended End Date
              </TableCell>
              <TableCell
                align="left"
                sx={{ color: "#fff", backgroundColor: "black" }}
              >
                Department
              </TableCell>
              <TableCell
                align="left"
                sx={{ color: "#fff", backgroundColor: "black" }}
              >
                Component Name
              </TableCell>
              {tableType && tableType === VIEW_TYPE_TABLE ? (
                <>
                  <TableCell
                    align="left"
                    sx={{ color: "#fff", backgroundColor: "black" }}
                  >
                    Approver
                  </TableCell>
                  <TableCell
                    align="left"
                    sx={{ color: "#fff", backgroundColor: "black" }}
                  >
                    Status
                  </TableCell>
                </>
              ) : null}

              {tableType && tableType === ACTION_TYPE_TABLE ? (
                <>
                  {loggedInUser && loggedInUser === AGM ? (
                    <>
                      <TableCell
                        align="left"
                        sx={{ color: "white", backgroundColor: "black" }}
                      >
                        Application Owner
                      </TableCell>
                      <TableCell
                        align="left"
                        sx={{ color: "white", backgroundColor: "black" }}
                      >
                        Status
                      </TableCell>
                    </>
                  ) : (
                    <>
                      <TableCell
                        align="left"
                        sx={{ color: "#fff", backgroundColor: "black" }}
                      >
                        Sent By
                      </TableCell>
                    </>
                  )}
                </>
              ) : null}
            </TableRow>
          </TableHead>

          {/* body part */}

          <TableBody>
            {tableData &&
              tableData.length > 0 &&
              tableData.map((rowData, index) => (
                <Row key={index} row={rowData} tableType={tableType} />
              ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default ParentTable;
