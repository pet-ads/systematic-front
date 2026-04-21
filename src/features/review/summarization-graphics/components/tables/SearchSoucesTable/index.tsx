import {
  Text,
} from "@chakra-ui/react";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import { fetchStudiesBySource, HttpResponse } from "@features/review/summarization-graphics/services/fetchStudiesBySources";
import useGetAllReviewArticles from "@features/review/shared/services/useGetAllReviewArticles";
import useFetchDataBases from "@features/review/shared/services/useFetchDataBases";
import { ColumnDef, GenericExpandedTable } from "../ChartTable/GenericExpandedTable";


type SearchSourceRow = {
  source: string;
  included: number;
  excluded: number;
  total: number;
  indexingRate: number;
  precisionRate: number;
};

type Description = {
  included: number;
  excluded: number;
  total: number;
};

export const SearchSorcesTable = () => {
  const { t } = useTranslation("review/summarization-graphics");
  const { databases } = useFetchDataBases();
  const { articles } = useGetAllReviewArticles();
  const [studiesData, setStudiesData] = useState<HttpResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dataStatistics, setDataStatistics] = useState<Description>({
    included: 0,
    excluded: 0,
    total: 0,
  });


  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      if (databases.length === 0) {
        setIsLoading(false);
        return;
      }
      const data = await fetchStudiesBySource(databases);
      setStudiesData(data);
      setIsLoading(false);
    };
    loadData();
  }, [databases]);


  const { includedStudiesBySource} = useMemo(() => {
    const includedArticles = articles.filter((a) => a.selectionStatus === "INCLUDED");
    const counts: Record<string, number> = {};

    includedArticles.forEach((article) => {
      article.searchSources?.forEach((source) => {
        counts[source] = (counts[source] || 0) + 1;
      });
    });

    const total = Object.values(counts).reduce((sum, val) => sum + val, 0);

    return { includedStudiesBySource: counts, totalIncludedFromSources: total };
  }, [articles]);

  useEffect(() => {
    const includedTotal = studiesData.reduce((sum, data) => sum + data.included.length, 0);
    const excludedTotal = studiesData.reduce((sum, data) => sum + data.excluded.length, 0);
    const total = studiesData.reduce((sum, data) => sum + data.totalOfStudies, 0);

    setDataStatistics({
      included: includedTotal,
      excluded: excludedTotal,
      total,
    });
  }, [studiesData]);

  if (isLoading) return <Text>Loading table...</Text>;

  const rows: SearchSourceRow[] = studiesData.map((data) => {
    const includedCount = includedStudiesBySource[data.source] ?? 0;
    const indexingRate = dataStatistics.included > 0 ? (includedCount / dataStatistics.included) * 100 : 0;
    const precisionRate = data.totalOfStudies > 0 ? (data.included.length / data.totalOfStudies) * 100 : 0;

    return {
      source: data.source,
      included: includedCount,
      excluded: data.excluded.length,
      total: data.totalOfStudies,
      indexingRate,
      precisionRate,
    };
  });

  const columns: ColumnDef<SearchSourceRow>[] = [
    { key: "source", label: t("searchSourcesTable.source"), width: 200, sortable: true },
    { key: "included", label: t("searchSourcesTable.included"), width: 100, isNumeric: true, sortable: true },
    { key: "excluded", label: t("searchSourcesTable.excluded"), width: 100, isNumeric: true, sortable: true },
    { key: "total", label: t("searchSourcesTable.total"), width: 100, isNumeric: true, sortable: true },
    { key: "indexingRate", label: t("searchSourcesTable.indexingRate"), width: 120, isNumeric: true, sortable: true, render: (row) => row.indexingRate.toFixed(2) + "%" },
    { key: "precisionRate", label: t("searchSourcesTable.precisionRate"), width: 120, isNumeric: true, sortable: true, render: (row) => row.precisionRate.toFixed(2) + "%" },
  ];

  return <GenericExpandedTable<SearchSourceRow> data={rows} columns={columns}/>;
};
