import React, { useState, useEffect } from 'react';
import { Line } from "react-chartjs-2";
 
const City = (props) => {
 
    const [data, setData] = useState({});
 
    useEffect(() => {
        props.selectedCityData.map((data) => {
            data.aqi = parseInt(data.aqi.toFixed(0),10);
        })
        const lineGraphData = {
            labels: props.selectedCityData.map(d => new Date(d.updated).toLocaleString()),
            datasets: [
                {
                    data: props.selectedCityData.map(d => d.aqi),
                    label: `AQI`,
                    borderColor: "#3e95cd",
                    fill: false,
                }
            ]
        }
        setData(lineGraphData);
    }, [props])
 
    return (<div>
        <button onClick={props.clearCityData} className="btn">Clear Selected City : {props.selectedCity}</button>
        <div style={{ fontSize: '2em' }}>Latest 10 Record(s)</div>
        <div style={{ height: "400px", width: "90vw", margin: "0 auto" }}>
            <Line data={data} />
        </div>
 
    </div>)
}
 
export default City;
