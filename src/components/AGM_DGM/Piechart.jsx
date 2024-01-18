import React from "react";
import { Grid, Typography, Paper, Box, Divider } from "@mui/material";
import { useTheme } from "@mui/material/styles";
// import OutlinedInput from "@mui/material/OutlinedInput";
// import InputLabel from "@mui/material/InputLabel";
// import MenuItem from "@mui/material/MenuItem";
// import FormControl from "@mui/material/FormControl";
// import Select from "@mui/material/Select";
// import TextField from "@mui/material/TextField";
// import Autocomplete from "@mui/material/Autocomplete";



import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import SquarePiechart from "./SquarePiechart";
import ApprovalsTable from "./ApprovalsTable";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const names = [];

function getStyles(name, personName, theme) {
  return {
    fontWeight:
      personName.indexOf(name) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}

const Piechart = () => {
  const theme = useTheme();
  const [personName, setPersonName] = React.useState([]);
  const [age, setAge] = React.useState('');

  const handleChange1 = (event) => {
    setAge(event.target.value);
  };


  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    setPersonName(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value
    );
  };
  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexGrow: 1,
          p: 3,
          height: "1367px",

          maxWidth: "100vw",
          backgroundColor: "rgba(214, 242, 251, 0.30)",
        }}
      >
        <Grid container sx={{ backgroundColor: "" }} spacing={2}>
          <Grid item xs={12}>
            {/* <Box sx={{display:"flex",justifyContent:"center",width:"70vw",backgroundColor:"blue",  p: 3,
                flexGrow: 1,   alignItems: "center",}}> 
              <Typography>Overview</Typography>
              <Box sx={{ minWidth: 120 }}>
                <FormControl fullWidth>
                  <InputLabel id="demo-simple-select-label">Age</InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={age}
                    label="Age"
                    onChange={handleChange1}
                  >
                    <MenuItem value={10}>Ten</MenuItem>
                    <MenuItem value={20}>Twenty</MenuItem>
                    <MenuItem value={30}>Thirty</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            </Box> */}

<Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          width: "67vw",
          marginLeft:"13vw",
          p: 3,
          marginBottom: "",
          backgroundColor:""
          
          // Added margin-bottom
        }}
      >
        <Typography sx={{fontSize:"20px",color:"#281C61",fontWeight:600}}>Overview</Typography>
        <Box sx={{ minWidth: 200 }}>
          <FormControl fullWidth >
            <InputLabel id="demo-simple-select-label">Last Month</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={age}
              label="Last Month"
              onChange={handleChange1}
              sx={{borderRadius:"12px",border:" 0.7px solid #281C61",backgroundColor:"rgba(255, 255, 255, 0.10)"}}
            >
              <MenuItem value={10}>Ten</MenuItem>
              <MenuItem value={20}>Twenty</MenuItem>
              <MenuItem value={30}>Thirty</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Box>

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
              

              <Paper
                sx={{
                  backgroundColor: "#FFF",
                  boxShadow: "0px 0px 24px rgba(0, 0, 0, 0.08)",
                  display: "flex",
                  flexDirection: "row",
                  borderRadius: "20px",
                }}
              >
                <Box sx={{ height: 400, width: "35vw" }}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      p: 2,
                      m: 2,
                    }}
                  >
                    <Typography>Total Recommendations:</Typography>
                    <Typography
                      style={{ fontSize: "25px", fontWeight: "bolder" }}
                    >
                      20
                    </Typography>
                  </Box>
                  <Box
                    sx={{ display: "flex", justifyContent: "center", gap: 10 }}
                  >
                    <div
                      style={{
                        width: "240px",
                        height: "240px",
                        backgroundColor: "",
                      }}
                    >
                      <SquarePiechart
                        dataset={[3, 5, 6, 7]}
                        colors={["#9EE1F8", "#00A9E5", "#55DAF8", "#D5F0FA"]}
                      />
                    </div>
                    <div
                      style={{
                        width: "157px",
                        height: "148px",
                        backgroundColor: "",
                        display: "",
                        gap: "30px",

                        marginTop: "70px",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          alignItems: "center",
                        }}
                      >
                        <div
                          style={{
                            width: "12px",
                            height: "12px",
                            backgroundColor: "#00A9E5",
                            marginRight: "5px", // Add margin for spacing
                          }}
                        ></div>
                        <Typography>Completed</Typography>
                      </div>

                      <div
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          alignItems: "center",
                        }}
                      >
                        <div
                          style={{
                            width: "12px",
                            height: "12px",
                            backgroundColor: "#55DAF8",
                            marginRight: "5px", // Add margin for spacing
                          }}
                        ></div>
                        <Typography>Pending </Typography>
                      </div>

                      <div
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          alignItems: "center",
                        }}
                      >
                        <div
                          style={{
                            width: "12px",
                            height: "12px",
                            backgroundColor: "#9EE1F8",
                            marginRight: "5px", // Add margin for spacing
                          }}
                        ></div>
                        <Typography>Implementation</Typography>
                      </div>

                      <div
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          alignItems: "center",
                        }}
                      >
                        <div
                          style={{
                            width: "12px",
                            height: "12px",
                            backgroundColor: "#D5F0FA",
                            marginRight: "5px", // Add margin for spacing
                          }}
                        ></div>
                        <Typography>Rejected</Typography>
                      </div>
                    </div>
                  </Box>
                </Box>

                <hr style={{ margin: "70px 0 70px 0", color: "#D9D9D9" }} />

                <Box sx={{ height: 400, width: "35vw" }}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      p: 2,
                      m: 2,
                    }}
                  >
                    <Typography>Implementation Status:</Typography>
                    <Typography
                      style={{ fontSize: "25px", fontWeight: "bolder" }}
                    >
                      06
                    </Typography>
                  </Box>
                  <Box
                    sx={{ display: "flex", justifyContent: "center", gap: 10 }}
                  >
                    <div
                      style={{
                        width: "240px",
                        height: "240px",
                        backgroundColor: "",
                      }}
                    >
                      <SquarePiechart
                        dataset={[45, 50, 70]}
                        colors={["#9EE1F8", "#00A9E5", "#55DAF8"]}
                      />
                    </div>
                    <div
                      style={{
                        width: "157px",
                        height: "148px",
                        backgroundColor: "",
                        display: "",
                        gap: "30px",

                        marginTop: "70px",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          alignItems: "center",
                        }}
                      >
                        <div
                          style={{
                            width: "12px",
                            height: "12px",
                            backgroundColor: "#00A9E5",
                            marginRight: "5px", // Add margin for spacing
                          }}
                        ></div>
                        <Typography>Planned</Typography>
                      </div>

                      <div
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          alignItems: "center",
                        }}
                      >
                        <div
                          style={{
                            width: "12px",
                            height: "12px",
                            backgroundColor: "#55DAF8",
                            marginRight: "5px", // Add margin for spacing
                          }}
                        ></div>
                        <Typography>Ontime </Typography>
                      </div>

                      <div
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          alignItems: "center",
                        }}
                      >
                        <div
                          style={{
                            width: "12px",
                            height: "12px",
                            backgroundColor: "#9EE1F8",
                            marginRight: "5px", // Add margin for spacing
                          }}
                        ></div>
                        <Typography>Delayed</Typography>
                      </div>
                    </div>
                  </Box>
                </Box>
              </Paper>
            </Box>
            <ApprovalsTable />
          </Grid>

          {/* <Grid item xs={12}>
            <Box  sx={{
             
                flexDirection: "row",
                
                flexGrow: 1,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "yellow",
                maxWidth: "100vw",
              }}>

                <Paper sx={{width:"70vw",backgroundColor:"blue"}}>
                <ApprovalsTable/>

                </Paper>
              


            </Box>

          </Grid> */}
        </Grid>
      </Box>
    </>
  );
};

export default Piechart;
