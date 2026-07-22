// External library
import { ApexOptions } from "apexcharts";
import Chart from "react-apexcharts";
import { Box } from "@chakra-ui/react"; 

// Types
type Props ={
  title:string;
  categories:(string| number)[];
  data:number[];
  color?:string;
  height?:number;
  width?:number | string;
}

export default function LineChart({
  title,
  categories,
  data,
  color="#3c73b6",
  height=550,
  width="100%" 
}:Props) {
   
  const chartConfig ={
    series: [
      {
        name: "Studies",
        data: data,
      },
    ],
    options: {
      chart: {
        toolbar: {
          show: true,
          tools: {
            selection: true,
            download: true,
            zoom: false,
            zoomin: false,
            zoomout: false,
            pan: false,
            reset: false,
          },
        },
      },
      colors: [color],
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: "straight",
        width: 4, 
      },
      title: {
        text:title ,
        align: "left",
        style: {
          fontSize: '22px',       
          fontWeight: '900',      
          color: '#2D3748',       
        }
      },
      grid: {
        row: {
          colors: ["#f3f3f3", "transparent"],
          opacity: 0.5,
        },
      },
      xaxis: {
        categories: categories,
        labels: {
          style: {
            fontWeight: 'bold',
            fontSize: '14px',
            colors: '#4A5568'
          }
        }
      },
      yaxis: {
        labels: {
          style: {
            fontWeight: 'bold', 
            fontSize: '14px',
            colors: '#4A5568'
          }
        }
      }
    } as ApexOptions,
  };

  return (
    <Box w="100%"> 
      <Chart
        options={chartConfig.options}
        series={chartConfig.series}
        type="line"
        height={height}
        width={width}
      />
    </Box>
  );
}