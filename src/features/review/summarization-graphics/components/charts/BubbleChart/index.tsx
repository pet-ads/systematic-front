import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";

type BubbleSeries = {
  name: string;
  data: { x: number | string; y: number; z: number }[];
};

type Props = {
  title: string;
  data: BubbleSeries[];
  width?: number;
  heigth?:number;
  yaxisText: string;
};

export default function BubbleChart({ title, data, width = 900 ,heigth=500,yaxisText}: Props) {
  const options: ApexOptions = {
    chart: {
        toolbar: {
          show: true,
          tools: {
  download: true,
  selection: false,
  zoom: false,
  zoomin: false,
  zoomout: false,
  pan: false,
  reset: false,
          },
        },
    },
    dataLabels: {
      enabled: false,
    },
    fill: {
      type: "gradient",
    },
    title: {
      text: title,
      align: "left",
      style: {
        fontWeight: 600,
        fontSize: "14px",
      },
    },
    xaxis: {
      type: "category",
      labels: {
        rotate: 0,
      },
    },
    yaxis: {
      title: {
        text: yaxisText,
      },
    },
    theme: {
      palette: "palette1",
    },
    legend: {
      position: "bottom",
    },
  };

  return (
    <Chart
      options={options}
      series={data}
      type="bubble"
      width={width}
      height={heigth}
    />
  );
}
