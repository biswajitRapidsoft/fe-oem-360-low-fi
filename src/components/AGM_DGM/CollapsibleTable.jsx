import * as React from "react";
import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import { tableCellClasses } from "@mui/material/TableCell";
import { styled } from "@mui/material/styles";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import Button from "@mui/material/Button";
import RejectModal from "./RejectModal";
import AcceptModal from "./AcceptModal";
import AcceptModalAppOwner from "./AcceptModalAppOwner";
import ViewTrail from "./ViewTrail";

// <Button variant="contained">Contained</Button>
// <Button variant="outlined">Outlined</Button>

function createData(
  ReferenceId,
  CreatedOn,
  Type,
  Priority,
  RecommendEndDate,
  Department,
  ComponentName,
  ApplicationOwner,
  Status
) {
  return {
    ReferenceId,
    CreatedOn,
    Type,
    Priority,
    RecommendEndDate,
    Department,
    ComponentName,
    ApplicationOwner,
    Status,

    // history: [
    //   {
    //     date: "2020-01-05",
    //     customerId: "11091700",
    //     amount: 3,
    //   },

    // ],
  };
}

function Row(props) {
  const {
    row,
    onRowClick,
    openRows,
    listData,
    fetchApprovedListAppOwner,
    fetchDataAppOwner,
    fetchDataAgm,
    fetchDataPiechart,
  } = props;
  const [open, setOpen] = React.useState(false);

  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [selectedData, setSelectedData] = useState(null);

  const [rejectModalAppOwnerOpen, setRejectModalAppOwnerOpen] = useState(false);
  const [selectedDataAppOwner, setSelectedDataAppOwner] = useState(null);

  //token
  const datas = sessionStorage.getItem("data");
  const data = JSON.parse(datas);
  const token = data.token;
  const userType = data.userType;

  const handleRejectClick = (listItem) => {
    setRejectModalOpen(true);
  };

  const handleRejectModalClose = () => {
    setRejectModalOpen(false);
  };

  const handleRejectAppOwnerClick = (listItem) => {
    setRejectModalOpen(true);
  };

  const handleRejectModalAppOwnerClose = () => {
    setRejectModalOpen(false);
  };

  //accept
  const [acceptModalOpen, setAcceptModalOpen] = useState(false);

  const [acceptAppOwnerModal, setAcceptAppOwnerModal] = useState(false);

  // const [trailData, setTrailData] = useState([]);

  const handleAcceptClick = () => {
    const tableData = listData.find(
      (item) => item.referenceId === row.ReferenceId
    );

    if (
      userType === "APPLICATION_OWNER" &&
      (row.Status === "AGM/DGM reverted" || row.Status === "AGM/DGM rejected")
    ) {
      setAcceptModalOpen(true);
      handleAcceptModalOpen({ row, tableData });
    } else if (userType === "AGM") {
      setAcceptModalOpen(true);
      handleAcceptModalOpen({ row, tableData });
    } else if (
      userType === "APPLICATION_OWNER" &&
      tableData.trailResponse !== null
    ) {
      setAcceptModalOpen(true);
      handleAcceptModalOpen({ row, tableData });
    } else if (userType === "OEM_SI" || userType === "GM_IT_INFRA") {
      setAcceptModalOpen(true);
      handleAcceptModalOpen({ row, tableData });
    } else if (
      userType === "APPLICATION_OWNER" &&
      (row.Status === "Recommendation created" ||
        row.Status === "Review process")
    ) {
      setAcceptAppOwnerModal(true);
      const tableData = listData.find(
        (item) => item.referenceId === row.ReferenceId
      );

      handleAcceptAppOwnerModalOpen({ row, tableData });
    }
  };

  const handleAcceptModalOpen = (data) => {
    setSelectedData(data);
  };

  // console.log(selectedData,"handleacceptmodaldataa")

  const handleAcceptModalClose = () => {
    setAcceptModalOpen(false);
  };

  const handleAcceptAppOwnerModalOpen = (data) => {
    setSelectedDataAppOwner(data);
  };

  const handleAcceptAppOwnerModalClose = () => {
    setAcceptAppOwnerModal(false);
  };

  const handleRevertClick = () => {
    setAcceptModalOpen(true);
    const tableData = listData.find(
      (item) => item.referenceId === row.ReferenceId
    );
    // Pass both row and tableData to the AcceptModal component
    handleAcceptModalOpen({ row, tableData });
  };

  // let viewTrailData;
  //   const fetchViewTrailData = () => {

  const viewTrailData = listData.find(
    (item) => item.referenceId === row.ReferenceId
  );
  //   setTrailData(viewTrailData);
  // };

  // useEffect(() => {
  //   fetchViewTrailData();
  // }, [row]);

  const getStatusColor = (status) => {
    if (status === "Rejected" || status === "AGM/DGM rejected") {
      return "red";
    } else if (status === "Released") {
      return "#8BB610";
    } else {
      return "orange";
    }
  };

  // Function to format date strings
  const formatDate = (dateString) => {
    if (!dateString) {
      return ""; // Handle cases where dateString is not provided
    }

    const date = new Date(dateString);
    const options = {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      // hour: "2-digit",
      // minute: "2-digit",
      // hour12: true,
    };

    const formattedDate = new Intl.DateTimeFormat("en-IN", options).format(
      date
    );

    return formattedDate;
  };

  return (
    <React.Fragment>
      <StyledTableRow sx={{ "& > *": { borderBottom: "" } }}>
        <TableCell align="left">{row.ReferenceId}</TableCell>
        <TableCell align="left">{row.CreatedOn}</TableCell>

        <TableCell align="left">{row.Type}</TableCell>
        <TableCell align="left">{row.Priority}</TableCell>
        <TableCell align="left">{row.RecommendEndDate}</TableCell>
        <TableCell align="left">{row.Department}</TableCell>
        <TableCell align="left">{row.ComponentName}</TableCell>
        <TableCell align="left">{row.ApplicationOwner}</TableCell>
        <TableCell align="left" sx={{ color: getStatusColor(row.Status) }}>
          {row.Status}
        </TableCell>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            // onClick={() => onRowClick(row.ReferenceId)}
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
      </StyledTableRow>

      <TableRow>
        <TableCell colSpan={10} style={{ padding: 0 }}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ backgroundColor: "" }}>
              {/* Your second table content goes here */}

              <TableContainer sx={{ backgroundColor: "" }}>
                <Table
                  sx={{
                    minWidth: 650,
                    backgroundColor: "",
                    borderCollapse: "collapse",
                  }}
                  // aria-label="simple table"
                >
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ borderBottom: 0 }}>
                        Description
                      </TableCell>
                      <TableCell
                        align="right"
                        sx={{
                          backgroundColor: "",
                          // marginBottom: 5,
                          // float: "left",
                          // colspan: 2,
                          borderBottom: 0,
                        }}
                      >
                        Develpoment start date
                      </TableCell>
                      <TableCell align="right" sx={{ borderBottom: 0 }}>
                        Development end date
                      </TableCell>
                      <TableCell align="right" sx={{ borderBottom: 0 }}>
                        Test completion date
                      </TableCell>
                      <TableCell align="right" sx={{ borderBottom: 0 }}>
                        Deployment date
                      </TableCell>
                      <TableCell align="right" sx={{ borderBottom: 0 }}>
                        Impacted department
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {listData
                      .filter((item) => item.referenceId === row.ReferenceId)
                      .map((listItem) => (
                        <TableRow
                          key={listItem.referenceId}
                          style={{ width: "", borderBottom: "none" }}
                        >
                          <TableCell
                            component="th"
                            scope="row"
                            style={{ width: "", borderBottom: "none" }}
                          >
                            {listItem.descriptions}
                          </TableCell>
                          <TableCell
                            component="th"
                            scope="row"
                            align="right"
                            style={{ width: "", borderBottom: "none" }}
                          >
                            {/* {
                              listItem.recommendationDeploymentDetails
                                ?.developmentStartDate
                            } */}

                            {listItem.recommendationDeploymentDetails
                              ?.developmentStartDate ? (
                              formatDate(
                                listItem.recommendationDeploymentDetails
                                  .developmentStartDate
                              )
                            ) : (
                              <span
                                style={{
                                  marginRight: 135,
                                  backgroundColor: "",
                                }}
                              >
                                --
                              </span>
                            )}
                          </TableCell>
                          <TableCell
                            component="th"
                            scope="row"
                            align="right"
                            style={{ width: "", borderBottom: "none" }}
                          >
                            {listItem.recommendationDeploymentDetails
                              ?.developementEndDate ? (
                              formatDate(
                                listItem.recommendationDeploymentDetails
                                  .developementEndDate
                              )
                            ) : (
                              <span
                                style={{
                                  marginRight: 130,
                                  backgroundColor: "",
                                }}
                              >
                                --
                              </span>
                            )}
                          </TableCell>
                          <TableCell
                            component="th"
                            scope="row"
                            align="right"
                            style={{ width: "", borderBottom: "none" }}
                          >
                            {/* {formatDate(
                              listItem.recommendationDeploymentDetails
                                ?.testCompletionDate
                            )} */}
                            {listItem.recommendationDeploymentDetails
                              ?.testCompletionDate ? (
                              formatDate(
                                listItem.recommendationDeploymentDetails
                                  .testCompletionDate
                              )
                            ) : (
                              <span
                                style={{
                                  marginRight: 115,
                                  backgroundColor: "",
                                }}
                              >
                                --
                              </span>
                            )}
                          </TableCell>
                          <TableCell
                            component="th"
                            scope="row"
                            align="right"
                            style={{ width: "", borderBottom: "none" }}
                          >
                            {/* {formatDate(
                              listItem.recommendationDeploymentDetails
                                ?.deploymentDate
                            )} */}
                            {listItem.recommendationDeploymentDetails
                              ?.deploymentDate ? (
                              formatDate(
                                listItem.recommendationDeploymentDetails
                                  .deploymentDate
                              )
                            ) : (
                              <span
                                style={{
                                  marginRight: 90,
                                  backgroundColor: "",
                                }}
                              >
                                --
                              </span>
                            )}
                          </TableCell>
                          <TableCell
                            component="th"
                            scope="row"
                            align="right"
                            style={{ width: "", borderBottom: "none" }}
                          >
                            {listItem.recommendationDeploymentDetails
                              ?.impactedDepartment ? (
                              listItem.recommendationDeploymentDetails
                                .impactedDepartment
                            ) : (
                              <span
                                style={{
                                  marginRight: 120,
                                  backgroundColor: "",
                                }}
                              >
                                --
                              </span>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </TableContainer>

              {userType === "AGM" && (
                <Box
                  sx={{
                    margin: 1,
                    backgroundColor: "",
                    borderBottom: "10px solid rgba(214, 242, 251, 0.30)",
                    height: "70px",
                    display: "flex",

                    justifyContent: "center",
                    alignItems: "center",
                    gap: "10px",
                  }}
                >
                  {/* <Box sx={{ backgroundColor: "", gap: "20px" }}> */}
                  <Button
                    variant="outlined"
                    sx={{ color: "#281C61" }}
                    onClick={() => handleRejectClick(row)}
                  >
                    Reject
                  </Button>

                  {row.Status === "Recommendation rejected" &&
                  (userType === "AGM" || userType === "GM_IT_INFRA") ? (
                    <Button
                      variant="contained"
                      sx={{ backgroundColor: "#281C61" }}
                      onClick={() => handleRevertClick(row)}
                    >
                      Revert
                    </Button>
                  ) : (
                    <Button
                      variant="contained"
                      sx={{ backgroundColor: "#281C61" }}
                      onClick={() => handleAcceptClick(row)}
                    >
                      Accept
                    </Button>
                  )}
                  {/* </Box> */}
                </Box>
              )}

              {(userType === "OEM_SI" || userType === "GM_IT_INFRA") && (
                <Box
                  sx={{
                    margin: 1,
                    marginTop: 3,
                    backgroundColor: "white",
                    borderBottom: "10px solid rgba(214, 242, 251, 0.30)",
                    height: "150px",
                    // width:"200vw",
                    display: "flex",
                    flexDirection: "column",

                    // justifyContent: "center",
                    // alignItems: "center",
                    gap: "",
                  }}
                >
                  <ViewTrail viewTrailData={viewTrailData} />
                  <Button
                    onClick={() => handleAcceptClick(row)}
                    variant=""
                    sx={{ width: "10vw", alignSelf: "center", marginBottom: 3 }}
                  >
                    <Typography
                      sx={{
                        color: "#281C61",
                        fontSize: "16px",
                        fontStyle: "normal",
                        fontFamily: "Inter",
                        textDecoration: "underline",
                        textTransform: "uppercase",
                      }}
                    >
                      VIEW DETAILS
                    </Typography>
                  </Button>
                </Box>
              )}

              {userType === "APPLICATION_OWNER" &&
                viewTrailData.trailResponse !== null && (
                  <Box
                    sx={{
                      margin: 1,
                      backgroundColor: "white",
                      borderBottom: "10px solid rgba(214, 242, 251, 0.30)",
                      height: "200px",
                      // width:"200vw",
                      display: "flex",
                      flexDirection: "column",

                      // justifyContent: "center",
                      // alignItems: "center",
                      gap: "",
                    }}
                  >
                    <ViewTrail viewTrailData={viewTrailData} />
                    <Button
                      onClick={() => handleAcceptClick(row)}
                      variant=""
                      sx={{
                        width: "10vw",
                        alignSelf: "center",
                        marginBottom: 3,
                      }}
                    >
                      <Typography
                        sx={{
                          color: "#281C61",
                          fontSize: "16px",
                          fontStyle: "normal",
                          fontFamily: "Inter",
                          textDecoration: "underline",
                          textTransform: "uppercase",
                        }}
                      >
                        VIEW DETAILS
                      </Typography>
                    </Button>
                  </Box>
                )}

              {userType === "APPLICATION_OWNER" &&
                viewTrailData.trailResponse === null && (
                  <Box
                    sx={{
                      margin: 1,
                      backgroundColor: "",
                      borderBottom: "10px solid rgba(214, 242, 251, 0.30)",
                      height: "50px",
                      display: "flex",

                      justifyContent: "center",
                      alignItems: "center",
                      gap: "10px",
                    }}
                  >
                    <>
                      <Button
                        variant="outlined"
                        sx={{ color: "#281C61" }}
                        onClick={() => handleRejectClick(row)}
                      >
                        Reject
                      </Button>

                      {row.Status === "Recommendation rejected" &&
                      (userType === "AGM" || userType === "GM_IT_INFRA") ? (
                        <Button
                          variant="contained"
                          sx={{ backgroundColor: "#281C61" }}
                          onClick={() => handleRevertClick(row)}
                        >
                          Revert
                        </Button>
                      ) : (
                        <Button
                          variant="contained"
                          sx={{ backgroundColor: "#281C61" }}
                          onClick={() => handleAcceptClick(row)}
                        >
                          Accept
                        </Button>
                      )}
                    </>
                  </Box>
                )}

              <RejectModal
                open={rejectModalOpen}
                onClose={handleRejectModalClose}
                row={row}
                fetchApprovedListAppOwner={fetchApprovedListAppOwner}
                fetchDataAppOwner={fetchDataAppOwner}
                fetchDataAgm={fetchDataAgm}
                fetchDataPiechart={fetchDataPiechart}
              />
              {/* <AcceptModal open={acceptModalOpen} onClose={handleAcceptModalClose}  row={row}/> */}

              <AcceptModal
                open={acceptModalOpen}
                onClose={handleAcceptModalClose}
                selectedData={selectedData}
                fetchApprovedListAppOwner={fetchApprovedListAppOwner}
                fetchDataAppOwner={fetchDataAppOwner}
                fetchDataAgm={fetchDataAgm}
                fetchDataPiechart={fetchDataPiechart}
              />

              <AcceptModalAppOwner
                open={acceptAppOwnerModal}
                onClose={handleAcceptAppOwnerModalClose}
                selectedData={selectedDataAppOwner}
                fetchApprovedListAppOwner={fetchApprovedListAppOwner}
                fetchDataAppOwner={fetchDataAppOwner}
              />
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

Row.propTypes = {
  row: PropTypes.shape({
    color: PropTypes.string.isRequired,
    capacity: PropTypes.number.isRequired,
    fuel: PropTypes.string.isRequired,
    history: PropTypes.arrayOf(
      PropTypes.shape({
        amount: PropTypes.number.isRequired,
        customerId: PropTypes.string.isRequired,
        date: PropTypes.string.isRequired,
      })
    ).isRequired,
    name: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
  }).isRequired,
  onRowClick: PropTypes.func.isRequired,
  listData: PropTypes.array.isRequired,
  openRows: PropTypes.array.isRequired,
  fetchApprovedListAppOwner: PropTypes.func.isRequired,
  fetchDataAppOwner: PropTypes.func.isRequired,
  fetchDataAgm: PropTypes.func.isRequired,
  fetchDataPiechart: PropTypes.func.isRequired,
};

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "#464646",
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
    backgroundColor: "red",
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  backgroundColor: "white",

  borderBottom: "7px solid rgba(214, 242, 251, 0.30)",

  //   "&:last-child": {
  //     borderBottom: 0,

  //   },
}));

export default function CollapsibleTable({
  listData,
  fetchApprovedListAppOwner,
  fetchDataAppOwner,
  fetchDataAgm,
  fetchDataPiechart,
}) {
  const [openRows, setOpenRows] = React.useState({});

  const handleRowClick = (referenceId, statusName) => {
    setOpenRows((prevOpenRows) => ({
      ...prevOpenRows,
      [referenceId]: !prevOpenRows[referenceId],
      [statusName]: !prevOpenRows[statusName],
    }));
  };

  const formatDate2 = (dateString) => {
    if (!dateString) {
      return "";
    }

    const date = new Date(dateString);
    const options = {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      // hour: "2-digit",
      // minute: "2-digit",
      // hour12: true,
    };

    const formattedDate = new Intl.DateTimeFormat("en-IN", options).format(
      date
    );

    return formattedDate;
  };

  return (
    <TableContainer
      style={{
        maxHeight: "50vh",
        overflowY: "auto",
        backgroundColor: "white",
      }}
    >
      <Table aria-label="collapsible table" sx={{ border: "none" }}>
        <TableHead sx={{ position: "sticky !important", top: 0, zIndex: 99 }}>
          <StyledTableRow>
            <StyledTableCell>Reference Id</StyledTableCell>
            <StyledTableCell align="left">Created On</StyledTableCell>
            <StyledTableCell align="left">Type</StyledTableCell>
            <StyledTableCell align="left">Priority</StyledTableCell>
            <StyledTableCell align="left">Recommend End Date</StyledTableCell>
            <StyledTableCell align="left">Department</StyledTableCell>
            <StyledTableCell align="left">Component Name</StyledTableCell>
            <StyledTableCell align="left">Application Owner</StyledTableCell>
            <StyledTableCell align="left">Status</StyledTableCell>
            <StyledTableCell align="left"></StyledTableCell>
          </StyledTableRow>
        </TableHead>
        {/* <TableBody>
          {rows.map((row) => (
            <Row key={row.name} row={row} />
          ))}
        </TableBody> */}
        <TableBody>
          {listData.map((list) => (
            <Row
              key={list.ReferenceId}
              row={{
                ...createData(
                  list.referenceId,
                  formatDate2(list.createdAt),
                  list.recommendationType.name,
                  list.priority,
                  formatDate2(list.recommendDate),
                  list.department.name,
                  list.component.name,
                  list.approver.userName,
                  list.status.statusName
                ),

                open: Boolean(openRows[list.ReferenceId]),
              }}
              onRowClick={() =>
                handleRowClick(list.ReferenceId, list.status.statusName)
              }
              listData={listData}
              fetchApprovedListAppOwner={fetchApprovedListAppOwner}
              fetchDataAppOwner={fetchDataAppOwner}
              fetchDataAgm={fetchDataAgm}
              fetchDataPiechart={fetchDataPiechart}
            />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
