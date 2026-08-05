import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { BubbleSeries } from "@features/review/summarization-graphics/hooks/useBubbleDataGeneric";
import { Box, Flex } from "@chakra-ui/react";

const ROW_HEIGHT = 80; 
const PADDING_V = 80;
const MIN_HEIGHT = 400; 
const MAX_HEIGHT = 800; 

type Props = {
  title: string;
  series: BubbleSeries[];
  yCategories: string[];
  yaxisText?: string;
};

export default function BubbleChart({ title, series, yCategories, yaxisText }: Props) {
  const allX = series.flatMap((s) => s.data.map((d) => d.x));
  const uniqueYears = [...new Set(allX)].sort((a, b) => a - b);
  const minYear = uniqueYears[0];
  const maxYear = uniqueYears[uniqueYears.length - 1];

  const dynamicHeight = Math.min(
    Math.max(MIN_HEIGHT, yCategories.length * ROW_HEIGHT + PADDING_V),
    MAX_HEIGHT,
  );

  const CHART_OVERHEAD = 120;
  const rowPx = (dynamicHeight - CHART_OVERHEAD) / (yCategories.length + 2);
  const maxBubbleRadius = Math.max(10, Math.min(40, Math.floor(rowPx / 2)));
  const minBubbleRadius = Math.max(8, Math.floor(maxBubbleRadius * 0.4));
  const labelFontSize = maxBubbleRadius >= 18 ? "11px" : "9px";

  yCategories = yCategories.map(
    item => item.match(/name:\s*(.*),\s*value:/)?.[1] ?? item
  );

  series = series.map((serie) => ({
    ...serie,
    name: serie.name.match(/name:\s*(.*),\s*value:/)?.[1] ?? serie.name,
  }));

  const options: ApexOptions = {
    chart: {
      toolbar: {
        show: true,
        offsetX: -40, 
        tools: {
          download: false,
          selection: true,
          zoom: false,
          zoomin: true,
          zoomout: true,
          pan: false,
          reset: true,
        },
      },
      animations: { enabled: false },
    },
    title: {
      text: title,
      align: "left",
      margin: 0,
      style: {
          fontSize: '22px',       
          fontWeight: '900',      
          color: '#2D3748',       
        }
    },
    grid: {
      show: true,
      borderColor: "#e0e0e0",
      strokeDashArray: 4,
      xaxis: { lines: { show: true } },
      yaxis: { lines: { show: true } },
      padding: { top: 10, bottom: 10, left: 10, right: 10 },
    },
    xaxis: {
      type: "numeric",
      min: minYear - 1,
      max: maxYear + 1,
      tickAmount: maxYear - minYear + 2,
      labels: {
        rotate: 0,
        formatter: (val) => {
          const n = Math.round(Number(val));
          return n >= minYear && n <= maxYear ? String(n) : "";
        },
        style: {
          fontWeight: 'bold', 
          fontSize: '14px',
          colors: '#4A5568'
        }
      },
      axisBorder: { show: true },
      axisTicks: { show: false },
    },
    yaxis: {
      min: -1,
      max: yCategories.length,
      tickAmount: yCategories.length + 1,
      title: { 
        text: yaxisText,
        style: { fontWeight: 'bold', fontSize: '16px', color: '#4A5568' } 
      },
      labels: {
        maxWidth: 80,
        formatter: (val) => {
          const i = Math.round(val);
          if (Math.abs(val - i) > 0.1) return "";
          return i >= 0 && i < yCategories.length ? yCategories[i] : "";
        },
        style: {
          fontWeight: 'bold', 
          fontSize: '14px',
          colors: '#4A5568'
        }
      },
    },
    plotOptions: {
      bubble: {
        minBubbleRadius,
        maxBubbleRadius,
        zScaling: true,
      },
    },
    dataLabels: {
      enabled: true,
      formatter: (_val: number, opts: any) => {
        const z = opts.w.config.series?.[opts.seriesIndex]?.data?.[opts.dataPointIndex]?.z;
        return z != null ? String(Math.round(z)) : "";
      },
      style: {
        fontSize: labelFontSize,
        fontWeight: "bold",
        colors: ["#ffffff"],
      },
      dropShadow: { enabled: false },
    },
    markers: { strokeWidth: 0 },
    fill: { opacity: 0.85 },
    tooltip: {
      custom: ({ seriesIndex, dataPointIndex, w }) => {
        const s = w.config.series[seriesIndex];
        const pt = s.data[dataPointIndex];
        const srcName = yCategories[Math.round(pt.y)] ?? s.name;
        return `<div style="padding:8px 12px;font-size:13px;line-height:1.6;">
          <strong>${srcName}</strong><br/>
          Ano: ${pt.x}<br/>
          Estudos: ${pt.z}
        </div>`;
      },
    },
    theme: { palette: "palette1" },
    legend: { 
      position: "bottom",
      fontWeight: 'bold', 
      fontSize: '14px'
    },
  };

  return (
    <div id="bubble-chart-container" style={{ width: "100%" }}>
      <style>{`
        #bubble-chart-container .apexcharts-reset-icon {
          transform: translateX(-7px); 
        }
      `}</style>

      <Flex h="100%" w="100%" align="center" justify="center" p="1rem">
        <Box w="100%">
          <Chart
            options={options}
            series={series}
            type="bubble"
            width="100%" 
            height={dynamicHeight} 
          />
        </Box>
      </Flex>
    </div>
  );
}