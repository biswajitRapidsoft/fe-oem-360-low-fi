import React from 'react';

import "../css/AgmDash.css"
import Aotable from "./Aotable"
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import { Typography } from '@mui/material';

ChartJS.register(
    ArcElement, Tooltip, Legend
)

export const data = {
    //   labels: ['Red', 'Blue', 'Yellow', 'Green'],
    datasets: [
        {
            //   label: '# of Votes',
            data: [3, 5, 5, 7],
            backgroundColor: ['#00A9E5', '#55DAF8', '#9EE1F8', '#D5F0FA'],
        },
    ],

};
export const data2 = {
    datasets: [
        {
            data: [3, 2, 2],
            backgroundColor: ['#00A9E5', '#55DAF8', '#9EE1F8'],
        },
    ],

};

const AgmDash = () => {
    return (
        <div className='parentAgm'>
            <div className='chart_container'>
                <div className='chart1'>
                    <div className='typo'>
                        <Typography className='toatlr'>Total Recommendations</Typography>
                        <Typography className='toatlr2'>20</Typography>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-evenly", width: "100%"}}>
                        <div className='piecharts1'>
                            <Pie data={data} />
                        </div>

                        <div>
                            hello
                        </div>
                    </div>

                </div>
                <div className="chart2">
                    {/* <Pie data={data2} /> */}
                    <div className='typo'>
                        <Typography className='toatlr'>Implementation Status</Typography>
                        <Typography className='toatlr2'>07</Typography>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-evenly", width: "100%"}}>
                        <div className='piecharts1'>
                            <Pie data={data2} />
                        </div>

                        <div>
                            hello
                        </div>
                    </div>
                </div>
            </div>
            {/* <Aotable/> */}
        </div>
    )
}

export default AgmDash