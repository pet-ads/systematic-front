// External Library
import useSWR from "swr";
import { useMemo } from "react";

// Infra
import Axios from "../../../../infrastructure/http/axiosClient";

// Types
import ArticleInterface from "@features/review/shared/types/ArticleInterface";
import { StudyInterface } from "@features/review/shared/types/IStudy";
import { Params } from "@features/shared/types/params";

export interface SelectionArticles {
  studyReviews: ArticleInterface[] | StudyInterface[];
  systematicStudyId: string;
  size: number;
  page: number;
  totalElements: number;
  totalPages: number;
}

interface FetchParams extends Params {
  search?: string;
  status?: string | null;
  // NOVO: Adicionado o sortConfig na tipagem dos parâmetros
  sortConfig?: {
    key: keyof ArticleInterface | string;
    direction: "asc" | "desc";
  } | null;
}

const EMPTY_PAGINATION_DATA: SelectionArticles = {
  studyReviews: [],
  totalElements: 0,
  totalPages: 0,
  systematicStudyId: "",
  size: 0,
  page: 0,
};

const useFetchSelectionArticles = ({
  page = 0,
  size = 20,
  search = "",
  status = null,
  sortConfig = null, // NOVO: Desestruturando o sortConfig
}: FetchParams) => {
  const id = localStorage.getItem("systematicReviewId");
  const endpoint = `systematic-study/${id}/study-review/search`;

  const queryParams: Record<string, any> = {
    page,
    size,
  };

  if (search) {
    queryParams.title = search;
  }

  if (status) {
    queryParams.selectionStatus = status;
  }

  // NOVO: Lógica de ordenação formatada para o Spring Boot (Kotlin)
  if (sortConfig) {
    let backendKey = String(sortConfig.key);

    // Tratando a diferença de nome da coluna entre o Front e o Banco de Dados
    if (backendKey === "studyReviewId") {
      backendKey = "id";
    }

    queryParams.sort = `${backendKey},${sortConfig.direction}`;
  }

  // Como o JSON.stringify(queryParams) está aqui embaixo,
  // o SWR já vai saber que precisa atualizar sozinho quando o sort mudar!
  const swrKey = useMemo(() => {
    if (!id) return null;
    return [endpoint, queryParams];
  }, [id, endpoint, JSON.stringify(queryParams)]);

  const fetcher = async () => {
    if (!id) return EMPTY_PAGINATION_DATA;

    try {
      const response = await Axios.get<SelectionArticles>(endpoint, {
        params: queryParams,
      });

      return response.data;
    } catch (error) {
      console.error("Error fetching articles", error);
      throw error;
    }
  };

  const { data, mutate, error, isLoading } = useSWR(swrKey, fetcher, {
    fallbackData: EMPTY_PAGINATION_DATA,
    revalidateOnFocus: true,
    revalidateOnMount: true,
    dedupingInterval: 5000,
    refreshInterval: 30000,
  });

  const articles = data?.studyReviews || [];
  const totalElements = data?.totalElements || 0;

  const calculatedPages = size > 0 ? Math.ceil(totalElements / size) : 0;
  const totalPages =
    calculatedPages > 0 ? calculatedPages : data?.totalPages || 0;

  return {
    articles: articles.filter(
      (art): art is ArticleInterface => "studyReviewId" in art,
    ),
    totalElements,
    totalPages,
    mutate,
    error,
    isLoading,
  };
};

export default useFetchSelectionArticles;
