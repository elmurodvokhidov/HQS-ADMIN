import React, { useState } from 'react';
import ReactApexChart from 'react-apexcharts';

const SplineChart = ({ data }) => {
    const [series] = useState([
        {
            name: 'bemor',
            data: data?.map((_, index) => index + 1)
        }
    ]);

    const [options] = useState({
        chart: {
            height: 350,
            type: 'area'
        },
        dataLabels: {
            enabled: false
        },
        stroke: {
            curve: 'smooth'
        },
        xaxis: {
            type: 'datetime',
            categories: data?.map(item => item.createdAt)
        },
        tooltip: {
            x: {
                format: 'dd/MM/yy'
            }
        }
    });

    return (
        <>
            <ReactApexChart options={options} series={series} type="area" height={350} />
        </>
    );
};

export default SplineChart;
