import { ApexOptions } from "apexcharts";
import Chart from "react-apexcharts";

type Props = {
  title: string;
  labels: (string | number)[];
  data: number[];
  width?: number | string;
  height?: number | string;
};

export default function PieChart({ 
  title, 
  labels, 
  data, 
  width = "100%", 
  height = 500 
} :Props) {

const chartConfig = {
    series: data,
    options: {
      chart: {
        toolbar: {
          show: true,
        },
      },
      grid: {
        padding: {
          top: 0, 
        }
      },
      labels: labels,
      title: {
        text: title,
        align: "left",
        style: {
          fontSize: '22px',       
          fontWeight: '900',      
          color: '#2D3748',       
        }
      },
      dataLabels: {
        enabled: true,
        style: {
          fontSize: '16px',
        }
      },
      legend: {
        position: "bottom",
        fontSize: '10px', 
        itemMargin: {
          horizontal: 10,
          vertical: 15 
        },
        markers: {
          width: 16,
          height: 16, 
          offsetX: -5,
        }
      },
    } as ApexOptions,
  };
  
  return (
    <Chart
      options={chartConfig.options}
      series={chartConfig.series}
      type="pie"
      width={width}
      height={height}
    />
  );
}