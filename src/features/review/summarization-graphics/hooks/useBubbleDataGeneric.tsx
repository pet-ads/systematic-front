import { useMemo } from "react";

export interface BubbleSeries {
  name: string;
  data: { x: number; y: number; z: number; count: number }[];
}

export interface BubbleItem {
  x: number;
  group: string;
  y: number;
}

export type BubbleChartData = {
  series: BubbleSeries[];
  yCategories: string[];
};

export default function useBubbleDataGeneric(items: BubbleItem[]): BubbleChartData {
  return useMemo(() => {
    const grouped: Record<string, Record<number, number>> = {};

    items.forEach(({ x, group, y }) => {
      if (!grouped[group]) grouped[group] = {};
      grouped[group][x] = (grouped[group][x] || 0) + y;
    });

    const yCategories = Object.keys(grouped).sort();

    const series: BubbleSeries[] = yCategories.map((group, gi) => ({
      name: group,
      data: Object.entries(grouped[group]).map(([yearStr, count]) => ({
        x: Number(yearStr),
        y: gi,    
        z: count, 
        count,     
      })),
    }));

    return { series, yCategories };
  }, [items]);
}