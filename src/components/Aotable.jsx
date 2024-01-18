import * as React from "react";
import PropTypes from "prop-types";
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
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import DoneIcon from "@mui/icons-material/Done";

import { tableCellClasses } from "@mui/material/TableCell";
import { styled } from "@mui/material/styles";

import TextField from "@mui/material/TextField";

import Modal from "@mui/material/Modal";

import "../css/Aotable.css";
import CancelIcon from "@mui/icons-material/Cancel";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  borderRadius: "16px",
  background: "#EBF9FD",
  boxShadow: 24,
  p: 4,
  width: "780px",
  height: "404px",
  // flex-shrink
};

const style1 = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  borderRadius: "16px",
  background: "#EBF9FD",
  boxShadow: 24,
  p: 4,
  width: "780px",
  height: "404px",
};

const style2 = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  borderRadius: "16px",
  background: "#EBF9FD",
  boxShadow: 24,
  p: 4,
  width: "780px",
  height: "404px",
};

function createData(
  name,
  calories,
  fat,
  carbs,
  protein,
  price,
  Approver,
  ComponentName,
  Department,
  referenceId,
  createdOn,
  type,
  priority,
  recommendedEndDate,
  status
) {
  return {
    name,
    calories,
    fat,
    carbs,
    protein,
    price,
    Approver,
    ComponentName,
    Department,
    history: [
      {
        date: "2020-01-05",
        customerId: "11091700",
        amount: 3,
      },
      {
        date: "2020-01-02",
        customerId: "Anonymous",
        amount: 1,
      },
      {
        date: "2020-01-02",
        customerId: "Anonymous",
        amount: 1,
      },
      {
        date: "2020-01-02",
        customerId: "Anonymous",
        amount: 1,
      },
      {
        date: "2020-01-02",
        customerId: "Anonymous",
        amount: 1,
      },
      {
        date: "2020-01-02",
        customerId: "Anonymous",
        amount: 1,
      },
    ],
    referenceId,
    createdOn,
    type,
    priority,
    recommendedEndDate,
    status,
  };
}

function Row(props) {
  const { row } = props;
  const [open, setOpen] = React.useState(false);

  const [openApproveModal, setOpenApproveModal] = React.useState(false);
  const handleOpen = () => setOpenApproveModal(true);
  const handleClose = () => setOpenApproveModal(false);

  const [openRejectModal, setOpenRejectModal] = React.useState(false);
  const handleOpenReject = () => setOpenRejectModal(true);
  const handleCloseReject = () => setOpenRejectModal(false);

  // revert modal
  const [openRevertModal, setOpenRevertModal] = React.useState(false);
  const handleOpenRevert = () => setOpenRevertModal(true);
  const handleCloseRevert = () => setOpenRevertModal(false);
  return (
    <React.Fragment>
      <TableRow
        sx={{ "& > *": { borderBottom: "unset" }, cursor: "pointer" }}
      // onMouseEnter={() => setOpen(true)}
      // onMouseLeave={() => setOpen(false)}
      >
        <TableCell component="th" scope="row">
          {row.name}
        </TableCell>
        <TableCell align="left">{row.calories}</TableCell>
        <TableCell align="left">{row.fat}</TableCell>
        <TableCell align="left">{row.carbs}</TableCell>
        <TableCell align="left">{row.carbs}</TableCell>
        <TableCell align="left">{row.protein}</TableCell>
        <TableCell align="left">{row.protein}</TableCell>
        <TableCell align="left">{row.protein}</TableCell>
        <TableCell align="left">{row.protein}</TableCell>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={10}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box
              sx={{
                margin: 1,
                textAlign: "center",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column",
              }}
            >
              <div
                style={{
                  gap: "2em",
                  display: "flex",
                  justifyContent: "space-around",
                  width: "10%",
                }}
              >
                <button
                  className="app_btn"
                  onClick={handleOpen}
                  style={{ cursor: "pointer" }}
                >
                  APPROVE
                </button>
                <button
                  className="rej_btn"
                  style={{ cursor: "pointer" }}
                  onClick={handleOpenReject}
                >
                  REJECT
                </button>

                {/* Approve Modal */}
                <Modal
                  open={openApproveModal}
                  onClose={handleClose}
                  aria-labelledby="modal-modal-title"
                  aria-describedby="modal-modal-description"
                >
                  <Box sx={style1}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        width: "100%",
                      }}
                    >
                      <Typography
                        id="modal-modal-title"
                        variant="h6"
                        component="h2"
                        className="approve_comm"
                      >
                        Deployment details
                      </Typography>
                      <CancelIcon
                        onClick={() => setOpenApproveModal(false)}
                        sx={{ cursor: "pointer" }}
                      />
                    </div>
                    <Typography
                      id="modal-modal-description"
                      className="oemtypo"
                    >
                      OEM recommended deployment date :9/10/23
                    </Typography>

                    <div className="date_inputs">
                      <input type="date" className="date_picker"
                        placeholder="select date "
                      />
                      <input type="date" className="date_picker" />
                      <input type="date" className="date_picker" />
                      <input type="date" className="date_picker" />
                      {/* <input type="date" className="date_picker"/> */}
                      <select id="cars" name="cars" className='type_selector1'
                        style={{ paddingLeft: "1%" }}
                      >
                        <option value="">Type*</option>
                        <option value="volvo">Volvo</option>
                        <option value="saab">Saab</option>
                        <option value="fiat">Fiat</option>
                        <option value="audi">Audi</option>
                      </select>
                      <input type="text" className="text_picker" placeholder="Global support reference number" />
                    </div>

                    <div style={{ display: "flex", justifyContent: "center", width: "100%" }}>
                      <button className="app_btn1">Send for approval</button>
                    </div>
                  </Box>
                </Modal>

                {/* rejection modal */}
                <Modal
                  open={openRejectModal}
                  onClose={handleCloseReject}
                  aria-labelledby="modal-modal-title"
                  aria-describedby="modal-modal-description"
                >
                  <Box sx={style}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        width: "100%",
                      }}
                    >
                      <Typography
                        id="modal-modal-title"
                        variant="h6"
                        component="h2"
                        className="approve_comm"
                      >
                        Comments
                      </Typography>
                      <CancelIcon
                        onClick={() => setOpenRejectModal(false)}
                        sx={{ cursor: "pointer" }}
                      />
                    </div>

                    <TextField
                      id="standard-basic"
                      label="Reason for rejection"
                      variant="standard"
                      sx={{ width: "100%", mt: 3 }}
                    />
                    <TextField
                      id="standard-basic"
                      label="Additional Comments"
                      variant="standard"
                      sx={{ width: "100%", mt: 3 }}
                    />

                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        width: "100%",
                        marginTop: "10%",
                      }}
                    >
                      <button className="rejbutton">Submit</button>
                    </div>
                  </Box>
                </Modal>
              </div>

              {/* Revert Modal */}
              {/* <br/> */}
              <Typography
                variant="h6"
                gutterBottom
                component="div"
                className="gutterDiv"
              >
                VIEW DETAILS
              </Typography>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

Row.propTypes = {
  row: PropTypes.shape({
    calories: PropTypes.number.isRequired,
    carbs: PropTypes.number.isRequired,
    fat: PropTypes.number.isRequired,
    history: PropTypes.arrayOf(
      PropTypes.shape({
        amount: PropTypes.number.isRequired,
        customerId: PropTypes.string.isRequired,
        date: PropTypes.string.isRequired,
      })
    ).isRequired,
    name: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    protein: PropTypes.number.isRequired,
  }).isRequired,
};

const rows = [
  createData(
    "Frozen yoghurt",
    159,
    6.0,
    24,
    4.0,
    3.99,
    "John Doe",
    "Component A",
    "Department X"
  ),
  createData(
    "Frozen yoghurt",
    159,
    6.0,
    24,
    4.0,
    3.99,
    "John Doe",
    "Component A",
    "Department X"
  ),
  createData(
    "Frozen yoghurt",
    159,
    6.0,
    24,
    4.0,
    3.99,
    "John Doe",
    "Component A",
    "Department X"
  ),
  createData(
    "Frozen yoghurt",
    159,
    6.0,
    24,
    4.0,
    3.99,
    "John Doe",
    "Component A",
    "Department X"
  ),
  createData(
    "Frozen yoghurt",
    159,
    6.0,
    24,
    4.0,
    3.99,
    "John Doe",
    "Component A",
    "Department X"
  ),
];

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    // backgroundColor: theme.palette.common.black,
    backgroundColor: "#464646",
    color: theme.palette.common.white,
    // borderRadius:"2rem"
    // borderBottom:"5px"
    // marginBottom:"5px"
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableHeadRow = styled(TableRow)(({ theme }) => ({
  "& > th": {
    backgroundColor: "#464646",
    color: theme.palette.common.white,
    // borderRadius:"2rem"
  },
  // borderRadius: '0.75rem ',
}));

export default function CollapsibleTable() {
  return (
    <div style={{ width: "80rem", height: "100%" }}>
      <div
        style={{
          display: "flex",
          width: "100%",
          height: "30%",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Typography variant="h5" className="typo">
            {" "}
            Recommendation Status
          </Typography>
        </div>

        <div className="second_div">
          <div className="search-container">
            <input
              type="text"
              className="searchfilter"
              placeholder="Search..."
            />
            <span className="search-icon">
              <SearchIcon />
            </span>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              gap: "1em",
            }}
          >
            <DoneIcon />
            <Typography sx={{ color: "gray" }}>
              Sort By &nbsp; &nbsp; |
            </Typography>
            <FilterAltIcon />
            <Typography sx={{ color: "gray" }}>Filters</Typography>
          </div>
        </div>
      </div>
      <TableContainer sx={{ borderRadius: "0.75rem" }}>
        <Table aria-label="collapsible table" sx={{ borderRadius: "0.75rem" }}>
          <TableHead>
            <StyledTableHeadRow>
              <StyledTableCell align="left">Reference Id</StyledTableCell>
              <StyledTableCell align="left">Created on</StyledTableCell>
              <StyledTableCell align="left">Type</StyledTableCell>
              <StyledTableCell align="left">Priority</StyledTableCell>
              <StyledTableCell align="left">
                Recommended end date
              </StyledTableCell>
              <StyledTableCell align="left">Department</StyledTableCell>
              <StyledTableCell align="left">Component name</StyledTableCell>
              <StyledTableCell align="left">Approver</StyledTableCell>
              <StyledTableCell align="left">Status</StyledTableCell>
              <StyledTableCell />
            </StyledTableHeadRow>
          </TableHead>
          <TableBody sx={{ borderRadius: "0.75rem" }}>
            {rows.map((row) => (
              <Row key={row.name} row={row} />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}
