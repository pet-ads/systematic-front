import { useMemo } from "react";

export interface BubbleSeries {
  name: string;
  data: { x: number; y: number; z: number }[];
}

export interface BubbleItem {
  x: number;      
  group: string;    
  y: number;        
}

export default function useBubbleDataGeneric(
  items: BubbleItem[]
): BubbleSeries[] {
  return useMemo(() => {
    const grouped: Record<string, Record<number, number>> = {};

    items.forEach(({ x, group, y }) => {
      if (!grouped[group]) grouped[group] = {};
      grouped[group][x] = (grouped[group][x] || 0) + y;
    });

  
    const yearMap: Record<number, string[]> = {};
    Object.entries(grouped).forEach(([group, years]) => {
      Object.keys(years).forEach((yearStr) => {
        const year = Number(yearStr);
        if (!yearMap[year]) yearMap[year] = [];
        yearMap[year].push(group);
      });
    });

 
    return Object.entries(grouped).map(([group, years]) => ({
      name: group,
      data: Object.entries(years).map(([yearStr, count]) => {
        const year = Number(yearStr);
        const groupsAtYear = yearMap[year];
        const index = groupsAtYear.indexOf(group);

        const offset =
          (index - (groupsAtYear.length - 1) / 2) * 0.35;

        return {
          x: year + offset,
          y: count,
        
          z: Math.max(10, count * 12),
        };
      }),
    }));
  }, [items]);
}
