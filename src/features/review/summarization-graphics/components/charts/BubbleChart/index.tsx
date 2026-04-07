import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { BubbleSeries } from "@features/review/summarization-graphics/hooks/useBubbleDataGeneric";

const ROW_HEIGHT = 80;
const PADDING_V = 80;
const MIN_HEIGHT = 300;
const MAX_HEIGHT = 500; 

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

  const options: ApexOptions = {
    chart: {
      toolbar: {
        show: true,
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
      style: { fontWeight: 500, fontSize: "14px" },
    },
    grid: {
      show: true,
      borderColor: "#e0e0e0",
      strokeDashArray: 4,
      // lines nativas: renderizadas antes das séries no SVG → ficam atrás das bolhas
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
      },
      axisBorder: { show: true },
      axisTicks: { show: false },
    },
    yaxis: {
      min: -1,
      max: yCategories.length,
      tickAmount: yCategories.length + 1,
      title: { text: yaxisText },
      labels: {
        minWidth: 120,
        formatter: (val) => {
          const i = Math.round(val);
          if (Math.abs(val - i) > 0.1) return "";
          return i >= 0 && i < yCategories.length ? yCategories[i] : "";
        },
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
        fontWeight: "600",
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
    legend: { position: "bottom" },
  };

  return (
    <div style={{ width: "100%", overflowX: "hidden" }}>
      <Chart
        options={options}
        series={series}
        type="bubble"
        width="100%"
        height={dynamicHeight}
      />
    </div>
  );
}
