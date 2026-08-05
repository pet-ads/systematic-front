import { ApexOptions } from "apexcharts";
import Chart from "react-apexcharts";
import { Box, Flex } from "@chakra-ui/react"; 

type section = 'inclusion' | 'exclusion' | 'searchSource' | 'questions';
type Props = {
  title: string;
  labels: (string | number)[];
  data: number[];
  color?: string;
  height?: number | string;
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
  const labelAbbreviation = section == 'inclusion' ? 'IC'
    : section == 'exclusion' ? 'EC' : '';

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
            <div style="padding: 10px; max-width: 300px; white-space: normal; background-color: #fff; border: 1px solid #ccc; border-radius: 5px; color: #333;">
              <strong>${fullText}</strong>
            </div>`;
        },
      },
      
      grid: {
        show: true,
        borderColor: '#B0B0B0', 
        strokeDashArray: 5,     
      },

      xaxis: {
        categories: labels.length === 0 ? [] : (section === 'searchSource' ? labels : labels.map((_, indexOf) => `${labelAbbreviation +(indexOf + 1)}`)),
        labels: {
          style: {
            fontSize: '14px',    
            fontWeight: 'bold',  
            colors: '#4A5568',    
          }
        }
      },

      yaxis: {
        labels: {
          style: {
            fontSize: '14px',    
            fontWeight: 'bold',  
            colors: '#4A5568',    
          }
        }
      },

      title: {
        text: title,
        align: "left",
        style: {
          fontSize: '22px',       
          fontWeight: '900',      
          color: '#2D3748',       
        }
      },
      noData: {
        text: "No studies found for this criteria.",
        align: 'center',
        verticalAlign: 'middle',
        style: {
          color: '#4A5568',
          fontSize: '16px',
        }
      }
    } as ApexOptions,
  };

  return (
    <Flex h="100%" w="100%" align="center" justify="center" p="0.5rem">
      <Box w="100%">
        <Chart
          options={chartConfig.options}
          series={chartConfig.series}
          type="bar"
          height={height}
          width="100%" 
        />
      </Box>
    </Flex>
  );
}