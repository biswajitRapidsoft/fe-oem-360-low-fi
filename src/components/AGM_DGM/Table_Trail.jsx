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
import AcceptModal from "./AcceptModal";
import AcceptModalAppOwner from "./AcceptModalAppOwner"


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
  const { row, onRowClick,openRows,listData } = props;
  const [open, setOpen] = React.useState(false);


  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [selectedData, setSelectedData] = useState(null);




const [rejectModalAppOwnerOpen, setRejectModalAppOwnerOpen] = useState(false);
  const [selectedDataAppOwner,setSelectedDataAppOwner] = useState(null);





   //token
   const datas = sessionStorage.getItem("data");
   const data = JSON.parse(datas);
   const token = data.token;
   const userType = data.userType;


  const handleRejectClick = (listItem) => {
    console.log(listItem,"reject")
    setRejectModalOpen(true);
  };

  const handleRejectModalClose = () => {
    setRejectModalOpen(false);
  };



  const handleRejectAppOwnerClick = (listItem) => {
    console.log(listItem,"reject")
    setRejectModalOpen(true);
  };

  const handleRejectModalAppOwnerClose = () => {
    setRejectModalOpen(false);
  };



  //accept
  const [acceptModalOpen, setAcceptModalOpen] = useState(false);

  const [acceptAppOwnerModal,setAcceptAppOwnerModal] = useState(false);









  const handleAcceptClick = () => {

    console.log(row.status,"gg")

    if(userType === 'AGM' || (userType === 'APPLICATION_OWNER' && (row.Status === 'AGM/DGM reverted' || row.Status === 'AGM/DGM rejected'))){
      setAcceptModalOpen(true);
    const tableData = listData.find((item) => item.referenceId === row.ReferenceId);
 
    handleAcceptModalOpen({ row, tableData });

    }



  else if(userType === 'APPLICATION_OWNER' && (row.Status === 'Recommendation created' || row.Status ==='Review process' )){
      setAcceptAppOwnerModal(true);
    const tableData = listData.find((item) => item.referenceId === row.ReferenceId);
 
    handleAcceptAppOwnerModalOpen({ row, tableData });

    }


  };




  const handleAcceptModalOpen = (data) => {
    setSelectedData(data);
  };
  

  const handleAcceptModalClose = () => {
    setAcceptModalOpen(false);
  };



  const handleAcceptAppOwnerModalOpen = (data) => {
    setSelectedDataAppOwner(data);
  };
  

  const  handleAcceptAppOwnerModalClose = () => {
    setAcceptAppOwnerModal(false);
  };












  const handleRevertClick = () => {
    setAcceptModalOpen(true);
    const tableData = listData.find((item) => item.referenceId === row.ReferenceId);
    // Pass both row and tableData to the AcceptModal component
    handleAcceptModalOpen({ row, tableData });
  };

  const getStatusColor = (status) => {
    if (status === "Recommendation rejected") {
      return "red";
    } else if (status === "Recommendation accepted") {
      return "#8BB610"; 
    } else {
      return "orange";
    }
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
        <TableCell align="left" sx={{ color: getStatusColor(row.Status) }}>{row.Status}</TableCell>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => onRowClick(row.referenceId)}
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
                      <TableCell>Description</TableCell>
                      <TableCell align="right">Develpoment start date</TableCell>
                      <TableCell align="right">Development  end date</TableCell>
                      <TableCell align="right">Test completion date</TableCell>
                      <TableCell align="right">Deployment date</TableCell>
                      <TableCell align="right">Impacted department</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                  {listData
                      .filter((item) => item.referenceId === row.ReferenceId)
                      .map((listItem) => (
                        <TableRow
                          key={listItem.referenceId}
                          sx={{
                            
                          }}
                        >
                          <TableCell component="th" scope="row">
                            {listItem.descriptions}
                          </TableCell>
                          <TableCell component="th" scope="row">
                            {listItem.recommendationDeploymentDetails?.developmentStartDate}
                          </TableCell>
                          <TableCell component="th" scope="row">
                            {listItem.recommendationDeploymentDetails?.developementEndDate}
                          </TableCell>
                          <TableCell component="th" scope="row">
                            {listItem.recommendationDeploymentDetails?.testCompletionDate}
                          </TableCell>
                          <TableCell component="th" scope="row">
                            {listItem.recommendationDeploymentDetails?.deploymentDate}
                          </TableCell>
                          <TableCell component="th" scope="row">
                            {listItem.recommendationDeploymentDetails?.impactedDepartment}
                          </TableCell>



                          
                         
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </TableContainer>


<RejectModal open={rejectModalOpen} onClose={handleRejectModalClose}  row={row}/>
{/* <AcceptModal open={acceptModalOpen} onClose={handleAcceptModalClose}  row={row}/> */}

<AcceptModal
  open={acceptModalOpen}
  onClose={handleAcceptModalClose}
  selectedData={selectedData}
/>

<AcceptModalAppOwner
  open={acceptAppOwnerModal}
  onClose={handleAcceptAppOwnerModalClose}
  selectedData={selectedDataAppOwner}
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
  listData: PropTypes.array.isRequired, // Ad
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
  )
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

export default function Table_Trail({listData}) {
  const [openRows, setOpenRows] = React.useState({});




  const handleRowClick = (referenceId,statusName) => {
    setOpenRows((prevOpenRows) => ({
      ...prevOpenRows,
      [referenceId]: !prevOpenRows[referenceId],
      [statusName]: !prevOpenRows[statusName],
    }));
  };

  console.log()

  return (

   

    <TableContainer  style={{ maxHeight: '50vh', overflowY: 'auto' }} >
      <Table aria-label="collapsible table" sx={{ border: "none" }}>
        <TableHead sx={{ position: "sticky !important",
                        top: 0,
                        zIndex: 1,}}> 
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
              row={{   ...createData(list.referenceId,list.createdAt,list.recommendationType.name,list.priority,list.recommendDate,list.department.name,list.component.name,list.approver.userName,list.status.statusName), 
                
                // open: openRows[list.ReferenceId]   }}
                open: Boolean(openRows[list.ReferenceId])
              
              }}

              onRowClick={() => handleRowClick(list.ReferenceId,list.status.statusName)} listData={listData}  
            />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
   
  );
}
