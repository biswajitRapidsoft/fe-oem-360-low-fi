import React from 'react'
import "../css/AgmDash.css"
import { FormControl, InputLabel, MenuItem, Select, Typography } from '@mui/material'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';

ChartJS.register(
    ArcElement, Tooltip, Legend
)

export const data = {
    labels: ['Red', 'Blue', 'Yellow'],
    datasets: [
      {
        label: '# of Votes',
        data: [12, 19, 3],
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
        
        ],
        
      },
    ],
  };

const AgmDash = () => {
    return (
        <div className='parentDash'>
            <div className='filterpie'>
                <div className='only_filters' sx={{display:"flex",justifyContent:"space-between"}}>
                    <Typography>Overview</Typography>

                    <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label">Age</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            label="Age"
                        >
                            <MenuItem value={10}>Ten</MenuItem>
                            <MenuItem value={20}>Twenty</MenuItem>
                            <MenuItem value={30}>Thirty</MenuItem>
                        </Select>
                    </FormControl>

                </div>
                <div className='chartspie'>
                    <div className="recommendation_chart"style={{border:"1px solid black"}}>
                    <Pie data={data} width={300} height={300} />
                    </div>
                    <div className="implementation_chart">
                    {/* <Pie data={data} width={300} height={300}  /> */}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AgmDash


