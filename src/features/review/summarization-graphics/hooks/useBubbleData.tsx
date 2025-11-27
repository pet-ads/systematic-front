import { useMemo } from "react";
import ArticleInterface from "@features/review/shared/types/ArticleInterface";
import { StudyInterface } from "@features/review/shared/types/IStudy";

export interface BubblePoint {
  x: number;    // ano
  y: number;    // quantidade de estudos
  z: number;    // tamanho da bolha
  name: string; // fonte
}

export interface BubbleSeries {
  name: string;
  data: { x: number; y: number; z: number }[];
}

export default function useBubbleChartData(
  studies: (ArticleInterface | StudyInterface)[]
): BubbleSeries[] {
  return useMemo(() => {
    // grouped[source][year] = count
    const grouped: Record<string, Record<number, number>> = {};

    studies.forEach(study => {
      const year = "year" in study && study.year ? Number(study.year) : 0;
      const sources: string[] = "searchSources" in study && Array.isArray(study.searchSources)
        ? study.searchSources
        : [];

      sources.forEach(source => {
        if (!grouped[source]) grouped[source] = {};
        grouped[source][year] = (grouped[source][year] || 0) + 1;
      });
    });

    // transforma em BubbleSeries[]
    return Object.entries(grouped).map(([source, years]) => ({
      name: source,
      data: Object.entries(years).map(([yearStr, count]) => ({
        x: Number(yearStr),
        y: count,
        z: count,
      })),
    }));
  }, [studies]);
}
