import { ApexOptions } from "apexcharts";
import Chart from "react-apexcharts";
import { Flex, Heading, Box } from "@chakra-ui/react"; // Added Box

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
}: Props) {

  const chartConfig = {
    series: data,
    options: {
      chart: {
        toolbar: {
          show: true,
        },
        width: "100%", 
      },
      grid: {
        padding: {
          top: 0,
          bottom: 0, // Minimize bottom padding to maximize chart size
        }
      },
      labels: labels,
      dataLabels: {
        enabled: true,
        style: {
          fontSize: '16px',
        }
      },
      legend: {
        position: "bottom",
        horizontalAlign: "center", // Explicitly center the items horizontally
        fontSize: '12px',
        itemMargin: {
          horizontal: 15, // Increased slightly to give them breathing room
          vertical: 4,    // Drastically reduced from 15 to give the pie chart more vertical space
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
    <Flex direction="column" w="100%" h="100%">
      <Heading
        as="h3"
        fontSize="22px"
        fontWeight="900"
        color="#2D3748"
        textAlign="start"
        mt={1}
        mb={2}
        ml={4}
      >
        {title}
      </Heading>
      
      <Flex flex="1" w="100%" align="center" justify="center">
        {/* Wrapping the chart in a full-width Box ensures the legend has the maximum horizontal width to spread out on one line */}
        <Box w="50%">
          <Chart
            options={chartConfig.options}
            series={chartConfig.series}
            type="pie"
            width={width}
            height={height}
          />
        </Box>
      </Flex>
    </Flex>
  );
}