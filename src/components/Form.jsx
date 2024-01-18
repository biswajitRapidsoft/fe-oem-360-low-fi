import React from 'react';
import "../css/Form.css";

import Box from '@mui/material/Box';
import Grid from '@mui/material/Unstable_Grid2';

import Tablecol from "../components/Tablecol"


const Form = () => {
    return (
        <div style={{ display: "flex", justifyContent: "center", height: "100vh", width: "100%",marginTop:"2.5em" }}>
            <div className="blue_box">
                <Box sx={{ flexGrow: 1, display: "flex", justifyContent: "space-evenly", alignItems: "center", height: "100%", padding: "1.5em", flexDirection: "column" }}>
                    {/* <h3 style={{color:"#fff"}}>Recommendations</h3> */}
                    <Grid container spacing={2}>
                        <Grid xs={12} sx={{ textAlign: "left" }}>
                            <h2 style={{ color: "#fff" }}>Add Recommendations</h2>
                        </Grid>
                        <Grid xs={6}>
                            <input
                                type='text'
                                placeholder='Description*'
                                className='type_selector'
                                style={{ paddingLeft: "1%" }}

                            />
                        </Grid>
                        <Grid xs={3}>
                            <select id="cars" name="cars" className='type_selector'
                                style={{ paddingLeft: "1%" }}
                            >
                                <option value="">Type*</option>
                                <option value="volvo">Volvo</option>
                                <option value="saab">Saab</option>
                                <option value="fiat">Fiat</option>
                                <option value="audi">Audi</option>
                            </select>
                        </Grid>
                        <Grid xs={3}>
                            <select id="cars" name="cars" className='type_selector' style={{ paddingLeft: "1%" }}>
                                <option value="">Priority*</option>
                                <option value="volvo">Volvo</option>
                                <option value="saab">Saab</option>
                                <option value="fiat">Fiat</option>
                                <option value="audi">Audi</option>
                            </select>
                        </Grid>
                        <Grid xs={2.5}>
                            <input
                                type='date'
                                className='type_selector'
                            />
                        </Grid>
                        <Grid xs={2.5}>
                            <select id="cars" name="cars" className='type_selector' style={{ paddingLeft: "1%" }}>
                                <option value="">Select your option</option>
                                <option value="volvo">Volvo</option>
                                <option value="saab">Saab</option>
                                <option value="fiat">Fiat</option>
                                <option value="audi">Audi</option>
                            </select>
                        </Grid>
                        <Grid xs={2.5}>
                            <select id="cars" name="cars" className='type_selector' style={{ paddingLeft: "1%" }}>
                                <option value="">Select your option</option>
                                <option value="volvo">Volvo</option>
                                <option value="saab">Saab</option>
                                <option value="fiat">Fiat</option>
                                <option value="audi">Audi</option>
                            </select>
                        </Grid>
                        <Grid xs={4.5}>

                            <input
                                type='text'
                                placeholder='Expected Impact'
                                className='type_selector'
                                style={{ paddingLeft: "1%" }}
                            />
                        </Grid>
                        <Grid xs={5}>
                            <input
                                type='text'
                                placeholder='Description'
                                className='type_selector'
                                style={{ paddingLeft: "1%" }}
                            />
                        </Grid>
                        <Grid xs={5}>
                            <input
                                type='text'
                                placeholder='Description'
                                className='type_selector'
                                style={{ paddingLeft: "1%" }}
                            />
                        </Grid>
                        <Grid xs={2}>
                            <button className='type_btn'>RECOMMEND</button>
                        </Grid>
                    </Grid>
                </Box>


                <Tablecol />
            </div>




        </div>
    )
}

export default Form


