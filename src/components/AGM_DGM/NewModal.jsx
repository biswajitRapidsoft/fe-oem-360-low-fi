import React from "react";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import Typography from "@mui/material/Typography";
import { Box, Button } from "@mui/material";
import config from '../../config/config';
import axios from 'axios';


function NewModal({ isOpen, onClose, recommendation }) {


  return (
    <Dialog open={isOpen} onClose={onClose}>
      <DialogContent>
        {recommendation && (
          <Box>
            <Typography variant="h6">Recommendation Details</Typography>
            <Typography gutterBottom>{recommendation.descriptions}</Typography>
            {/* Add more details as needed */}
            <Button onClick={onClose}>Close</Button>
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default NewModal;
