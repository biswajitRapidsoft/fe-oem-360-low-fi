import React from 'react';
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend
} from 'chart.js';


import { Pie } from 'react-chartjs-2';

ChartJS.register(
    ArcElement,
    Tooltip,
    Legend
);


const SquarePiechart=({dataset,colors})=>{

    const data ={
        // labels:['One',"Two","Three","Four"],
        datasets:[
            {
                data:dataset,
                backgroundColor:colors
            },
            // {
            //     data:[3,6,9],
            //     backgroundColor:['aqua','bloodorange','purple']
            // }
        
        ]
          
    };


    const options={

    }


    return(
        <>
        <div>
            <div style={{
                padding:"20px",
                width:"100%",
                height:"50%"
            }}>
                <Pie 
                data={data}
                options ={options}
                >

                </Pie>

            </div>
            
        </div>

        </>
    )
}

export default SquarePiechart