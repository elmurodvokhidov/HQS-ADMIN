import React, { useEffect, useState } from 'react';
import ReactApexChart from 'react-apexcharts';

const PolarAreaChart = ({ symptoms }) => {
    const [options, setOptions] = useState({
        chart: {
            type: 'polarArea',
        },
        stroke: {
            colors: ['#fff'],
        },
        fill: {
            opacity: 0.8,
        },
        responsive: [{
            breakpoint: 480,
            options: {
                chart: {
                    width: 200,
                },
                legend: {
                    position: 'bottom',
                },
            },
        }],
    });

    const [series, setSeries] = useState(symptoms?.map(item => item?.patients?.length));

    useEffect(() => {
        setOptions(prevOptions => ({
            ...prevOptions,
            labels: symptoms?.map(item => item?.name),
        }));
        setSeries(symptoms?.map(item => item?.patients?.length));
    }, [symptoms]);

    return (
        <div className='w-3/5 m-auto mt-20'>
            <ReactApexChart options={options} series={series} type="polarArea" />
        </div>
    );
};

export default PolarAreaChart