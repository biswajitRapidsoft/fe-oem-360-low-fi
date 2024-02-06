import { Box, Grid, Typography } from '@mui/material'
import React from 'react'

const customFontStyles = {
  fontFamily: "Open Sans !important",
  fontWeight:600,
  // color: "#FFFFFF",
  fontSize: "14px",
};

const ComponentHeader = () => {
  return (
    <Grid container spacing={2}>
      <Grid item xs={12} sm={12} md={12} lg={12}>
        <Box sx={{display:'flex', flexGrow:1, width:'100%', alignItems:'center'}}>
          <Typography sx={{...customFontStyles, fontSize:'32px', fontWeight:800, color:"#3d3d3d"}}>OEM 360</Typography>
        </Box>
      </Grid>
      
    </Grid>
  )
}

export default ComponentHeader