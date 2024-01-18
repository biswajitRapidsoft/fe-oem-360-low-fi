import React from "react";
import {
  Grid,
  Typography,
  Paper,
  Box,
  Divider,
  TextField,
} from "@mui/material";
import CollapsibleTable from './CollapsibleTable';
import DoneIcon from '@mui/icons-material/Done';
import FilterAltOutlinedIcon from '@mui/icons-material/FilterAltOutlined';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';

const ApprovalsTable = () => {
  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          p: 3,
          flexGrow: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "",
          maxWidth: "100vw",
        }}
      >
        <Box sx={{ backgroundColor: "", width: "70vw" }}>
       

		  <Box sx={{borderRadius:"12px"}}>

      <Box sx={{ }}>
            <Box sx={{float:"left",marginTop:3}}>
              <Typography sx={{color:"#281C61",fontSize:"20px",fontFamily:"sans-serif",fontWeight:600,textTransform:"capitalize"}}>List of Approvals</Typography>
            </Box>

            <Box sx={{display:"flex",flexDirection:"row",gap:"10px",float:"right"}}>
              {/* <TextField id="outlined-basic"  variant="outlined" sx={{height:"",marginBottom:"30px",border: "0.7px solid #281C61",borderRadius:"12px"}}> <SearchOutlinedIcon/></TextField> */}

              <TextField
                  id="outlined-basic"
                  variant="outlined"
                  sx={{
                    height:"",
                    marginBottom:"30px",
                    border: "0.7px solid #281C61",
                    borderRadius:"12px",
                   
                  }}
                  InputProps={{
                    endAdornment: (
                      <SearchOutlinedIcon
                        sx={{ color: "#281C61",marginLeft:1}}
                      />
                    ),
                  }}
                
                />
                <DoneIcon sx={{marginTop:2}}/>
                <Typography sx={{marginTop:2}}>Sort By</Typography>
                <Divider orientation="vertical" sx={{ height: 24, mx: 2, backgroundColor: "#6C757D" ,marginTop:2}} /> 
                <FilterAltOutlinedIcon sx={{marginTop:2}}></FilterAltOutlinedIcon>
                <Typography sx={{color:"#6C757D",fontSize:"16px",fontWeight:400,marginTop:2}}>Filters</Typography>
            </Box>
            <Box></Box>
          </Box>
		  <CollapsibleTable/>

		  </Box>

		 
        </Box>
      </Box>
    </>
  );
};

export default ApprovalsTable;
