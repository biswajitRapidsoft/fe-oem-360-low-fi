import React from 'react';

import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import { TextField } from '@mui/material';

const RejectModal = ({ open, onClose }) => {
  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 780,
          height:404,
          bgcolor: "#EBF9FD",
          // border: "2px solid #000",
          boxShadow: 24,
          borderRadius:"12px",
          p: 2,
        }}
      >


        <Box sx={{display:"flex",flexDirection:"row",justifyContent:"space-between"}}>
        <Typography id="modal-modal-title" variant="h6" component="h2" sx={{color:"#281C61",fontSize:"24px",fontWeight:600}}>
         Comments
        </Typography>

        <CancelOutlinedIcon sx={{width:"32px",height:"32px",fill: "#EBF9FD",stroke: "#281C61",strokeWidth: "0.5px"}}/>



        </Box>

        <Box sx={{display:"flex",flexDirection:"column"}}>

<Box sx={{display:"flex",flexDirection:"column"}}>
  <Typography>Reason For Rejection</Typography>
  <TextField id="standard-basic" label="" variant="standard" ></TextField>
</Box>

         
        

        <TextField id="standard-basic" label="Additional Comments" variant="standard" ></TextField>

        </Box>
       
        {/* <Typography id="modal-modal-description" sx={{ mt: 2 }}>
          Add your reject reason here.
        </Typography> */}
        {/* <Button onClick={onClose}>Close Modal</Button> */}

        <Box sx={{display:"flex",justifyContent:"center",p:2}}>
          <Button variant="contained" sx={{backgroundColor:"#281C61",borderRadius:"12px",height:"52px",padding: "8px 16px"}}>Submit</Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default RejectModal;
