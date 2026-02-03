import ArticleInterface from "@features/review/shared/types/ArticleInterface";
import { StudyInterface } from "@features/review/shared/types/IStudy";
import { CsvRow } from "@features/review/summarization-graphics/pages/Graphics/subcomponents/ChartRenderer";

type Study = StudyInterface | ArticleInterface;

export function getCsvData(
  section: string,
  studies: Study[],
  type: string,
  filteredStageIds?: number[],
  studiesByCriteria?: Record<string, number[]>
): CsvRow[] {
  switch (section) {
case "Included Studies": {
  const includedStudies = studies.filter(s => s.extractionStatus === "INCLUDED");

  if (type.toLowerCase().includes("line chart")) {
    
    const map: Record<number, number> = {};
    includedStudies.forEach(s => {
      const year = Number(s.year);
      map[year] = (map[year] || 0) + 1;
    });

    return Object.entries(map)
      .map(([year, count]) => ({ year, includedStudies: count }))
      .sort((a, b) => Number(a.year) - Number(b.year));
  } else if (type.toLowerCase().includes("bubble chart")) {
    
    const map: Record<string, number> = {};
    includedStudies.forEach(s => {
      s.searchSources.forEach(src => {
        const key = `${s.year}-${src}`;
        map[key] = (map[key] || 0) + 1;
      });
    });

    return Object.entries(map)
      .map(([key, count]) => {
        const [year, source] = key.split("-");
        return { year, source, includedStudies: count };
      })
      .sort((a, b) => Number(a.year) - Number(b.year)); 
  } else {

    // CSV para tabela
    return includedStudies.map(s => ({
      id: s.systematicStudyId ?? "",
      title: s.title ?? "",
      authors: s.authors ?? "",
      journal: s.venue ?? "",
      year: s.year ?? "",
      sources: s.searchSources.join("; "),
      criteria: s.criteria.join("; "),
    }));
  }
}

case "Search Sources": {
  if (type.toLowerCase().includes("bubble chart")) {
  
    const map: Record<string, number> = {};
    studies.forEach(s => {
      const year = s.year;
      s.searchSources.forEach(src => {
        const key = `${year}-${src}`;
        map[key] = (map[key] || 0) + 1;
      });
    });

    return Object.entries(map)
      .map(([key, count]) => {
        const [year, source] = key.split("-");
        return { year, source, studies: count };
      })
      .sort((a, b) => Number(a.year) - Number(b.year)); 
  } else {
    const map: Record<string, number> = {};
    studies.forEach(s => {
      s.searchSources.forEach(src => {
        map[src] = (map[src] || 0) + 1;
      });
    });

    return Object.entries(map).map(([source, count]) => ({
      source,
      studies: count,
    }));
  }
}


    case "S1_Inclusion Criteria":
    case "S1_Exclusion Criteria":
    case "S2_Inclusion Criteria":
    case "S2_Exclusion Criteria": {
      if (!filteredStageIds || !studiesByCriteria) return [];

      const labels = Object.keys(studiesByCriteria);
      return labels.map((label) => ({
        criteria: label,
        studies: studiesByCriteria[label].filter((id) => filteredStageIds.includes(id)).length,
      }));
    }

    default:
      return [];
  }
}
