import * as React from "react";
import {useState,useEffect} from 'react';
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
  const { row, onRowClick } = props;
  const [open, setOpen] = React.useState(false);


  const [rejectModalOpen, setRejectModalOpen] = useState(false);

  const handleRejectClick = () => {
    setRejectModalOpen(true);
  };

  const handleRejectModalClose = () => {
    setRejectModalOpen(false);
  };

  function createData(name, calories, fat, carbs, protein) {
    return { name, calories, fat, carbs, protein };
  }

  const rows = [createData("Frozen yoghurt", 159, 6.0, 24, 4.0)];

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
        <TableCell align="left">{row.Status}</TableCell>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => onRowClick(row.ReferenceId)}
          >
            {row.open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
      </StyledTableRow>

      <TableRow>
        <TableCell colSpan={10} style={{ padding: 0 }}>
          <Collapse in={row.open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              {/* Your second table content goes here */}

              <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                  <TableHead>
                    <TableRow>
                      <TableCell>Dessert (100g serving)</TableCell>
                      <TableCell align="right">Calories</TableCell>
                      <TableCell align="right">Fat&nbsp;(g)</TableCell>
                      <TableCell align="right">Carbs&nbsp;(g)</TableCell>
                      <TableCell align="right">Protein&nbsp;(g)</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {rows.map((row) => (
                      <TableRow
                        key={row.name}
                        sx={{
                          // "&:last-child td, &:last-child th": { border: 0 },
                        }}
                      >
                        <TableCell component="th" scope="row">
                          {row.name}
                        </TableCell>
                        <TableCell align="right">{row.calories}</TableCell>
                        <TableCell align="right">{row.fat}</TableCell>
                        <TableCell align="right">{row.carbs}</TableCell>
                        <TableCell align="right">{row.protein}</TableCell>

                     
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
<Box sx={{
                        margin: 1,
                        backgroundColor: "white",
                        borderBottom: "10px solid rgba(214, 242, 251, 0.30)",
                        height: "70px",
                        display:"flex",
                        justifyContent:"center",
                        alignItems:"center",
                        gap:"10px"
                      }}>

 <Button variant="outlined" sx={{color:"#281C61"}} onClick={handleRejectClick}>Reject</Button>
 <Button variant="contained" sx={{backgroundColor:"#281C61"}}>Accept</Button>

</Box>

<RejectModal open={rejectModalOpen} onClose={handleRejectModalClose} />


            
            </Box>
          </Collapse>
        </TableCell>

        
      </TableRow>

    

     

      {/* <TableRow>
                <TableCell style={{ paddingBottom: 0, 
                    paddingTop: 0 }} >
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <Box sx={{ margin: 1 }}>
                         
                            <Table size="small"
                                aria-label="purchases">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>
                                            Description
                                        </TableCell>
                                        <TableCell>
                                            Development start date
                                        </TableCell>
                                        <TableCell align="right">
                                        Development end date
                                        </TableCell>
                                        <TableCell align="right">
                                            Test Completion Date
                                        </TableCell>
                                        <TableCell align="right">
                                           Deployment Date
                                        </TableCell>
                                        <TableCell align="right">
                                            Impacted Department
                                        </TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {row.history.map
                                        ((historyRow) => (
                                        <StyledTableRow key=
                                            {historyRow.date}>
                                            <TableCell 
                                                component="th"
                                                scope="row">
                                                {historyRow.date}
                                            </TableCell>
                                            <TableCell>
                                                {historyRow.customerId}
                                            </TableCell>
                                            <TableCell align="right">
                                                {historyRow.amount}
                                            </TableCell>
                                            <TableCell align="right">
                                                {Math.round
                                                (historyRow.amount 
                                                * row.price * 100) / 100}
                                            </TableCell>
                                            <TableCell align="right">
                                                {historyRow.amount}
                                            </TableCell>
                                            <TableCell align="right">
                                                {historyRow.amount}
                                            </TableCell>
                                        </StyledTableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow> */}
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
};

const rows = [
  createData(
    "TATA HARRIER",
    "BLACK",
    "DIESEL",
    6,
    1400000,
    "Green",
    "Black",
    "Yellow",
    "orange"
  ),
  createData(
    "MAHINDRA THAR",
    "RED",
    "DIESEL",
    4,
    1600000,
    "Green",
    "Black",
    "Yellow",
    "orange"
  ),
  createData(
    "MARUTI SWIFT",
    "WHITE",
    "PETROL",
    5,
    900000,
    "Green",
    "Black",
    "Yellow",
    "orange"
  ),
  createData(
    "MG HECTOR",
    "BLACK",
    "PETROL",
    5,
    1800000,
    "Green",
    "Black",
    "Yellow",
    "orange"
  ),
  createData(
    "MERCEDES GLS",
    "WHITE",
    "DIESEL",
    5,
    5200000,
    "Green",
    "Black",
    "Yellow",
    "orange"
  ),
];

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

export default function CollapsibleTable() {
  const [openRows, setOpenRows] = React.useState({});



  

  const handleRowClick = (referenceId) => {
    setOpenRows((prevOpenRows) => ({
      ...prevOpenRows,
      [referenceId]: !prevOpenRows[referenceId],
    }));
  };

  return (
    <TableContainer>
      <Table aria-label="collapsible table" sx={{ border: "none" }}>
        <TableHead>
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
          {rows.map((row) => (
            <Row
              key={row.ReferenceId}
              row={{ ...row, open: openRows[row.ReferenceId] }}
              onRowClick={handleRowClick}
            />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
