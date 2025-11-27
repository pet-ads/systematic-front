import { ApexOptions } from "apexcharts";
import Chart from "react-apexcharts";


type section= 'inclusion'|'exclusion'|'searchSource' | 'questions'
type Props = {
  title: string;
  labels: (string | number)[];
  data: number[];
  color?: string;
  height?: number;
  section: section;
};

export default function BarChart({
  title,
  labels,
  data,
  color = "#3c73b6",
  height = 500,
  section

}: Props) {
  const labelAbbreviation = section =='inclusion' ? 'IC'
    : section == 'exclusion' ? 'EC' : section == 'questions' ? 'RQ' : 'Source'
  
  const chartConfig = {
    series: [
      {
        name: "Studies",
        data,
      },
    ],
    options: {
      chart: {
        toolbar: {
          show: true,
          tools: {
            selection: true,
            download: true,
          },
        },
      },
      colors: [color],
      plotOptions: {
        bar: {
          horizontal: false,
          dataLabels: {
            position: "top",
          },
        },
      },    

      tooltip: {
        custom: ({ dataPointIndex }: { dataPointIndex: number }) => {
          const fullText = labels[dataPointIndex];
          return `
            <Box style="padding: 8px; max-width: 300px; white-space: normal;">
              <Text>${fullText}</Text>
            </Box>`;
        },
      },
      xaxis: {
      
        categories: section =='searchSource' ? labels : labels.map((_, indexOf) => `${labelAbbreviation +(indexOf + 1)}`),
      },

      title: {
        text: title,
        align: "left",
      },
    } as ApexOptions,
  };

  return (
    <Chart
      options={chartConfig.options}
      series={chartConfig.series}
      type="bar"
      height={height}
    />
  );
}
