// External library
import { useContext, useState, useEffect } from "react";
import { Box, Flex, Spinner } from "@chakra-ui/react";
import { EditIcon } from "@chakra-ui/icons";

// Components
import ButtonsForSelection from "../../common/buttons/ButtonsForSelection";
import EventButton from "@components/common/buttons/EventButton";

// Context
import StudyContext from "@features/review/shared/context/StudiesContext";

// Infra
import Axios from "../../../../../../infrastructure/http/axiosClient";

// Services
import { updateStudyReview } from "@features/review/execution-selection/services/useUpdateStudyReview";

// Hooks
import useWindowWidth from "@features/shared/hooks/useWindowWidth";
import useToaster from "@components/feedback/Toaster";

// Types
import type { PageLayout } from "../LayoutFactory";
import type ArticleInterface from "../../../types/ArticleInterface";
import type { StudyInterface } from "../../../types/IStudy";
import StudyDataFiel, { type EditData } from "../../common/tables/StudyData";
import { SelectionArticles } from "@features/review/execution-selection/services/useFetchSelectionArticles";
import { KeyedMutator } from "swr";
import { useTranslation } from "react-i18next";

interface StudySelectionAreaProps {
  articles: ArticleInterface[] | StudyInterface[];
  page: PageLayout;
  reloadArticles: KeyedMutator<SelectionArticles>;
  currentPage: number;
  totalPages: number;
  pageSize: number;
  onTablePageChange: (page: number) => void;
  extraParams?: Record<string, any>;
  handleChangeLayout?: (layout: any) => void;
  isVertical?: boolean;
}

export default function StudySelectionArea({
  articles,
  page,
  reloadArticles,
  currentPage,
  totalPages,
  pageSize,
  onTablePageChange,
  extraParams = {},
  handleChangeLayout,
  isVertical,
}: StudySelectionAreaProps) {
  const window = useWindowWidth();
  const studiesContext = useContext(StudyContext);
  const toast = useToaster();
  const { t } = useTranslation("review/execution-selection");

  if (!studiesContext)
    throw new Error("Failed to get selection context on study Selection area");

  const { selectedArticleReview, setSelectedArticleReview } = studiesContext;

  const [navPage, setNavPage] = useState(currentPage);
  const [navArticles, setNavArticles] = useState<ArticleInterface[] | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editData, setEditData] = useState<EditData | null>(null);

  const id = localStorage.getItem("systematicReviewId");
  const firstArticleId = (articles[0] as ArticleInterface)?.studyReviewId ?? null;

  useEffect(() => { setNavPage(currentPage); setNavArticles(null); }, [currentPage]);
  useEffect(() => { setNavPage(currentPage); setNavArticles(null); }, [firstArticleId]);

  const fetchPageSilently = async (targetPage: number): Promise<ArticleInterface[]> => {
    try {
      const response = await Axios.get<SelectionArticles>(
        `systematic-study/${id}/study-review/search`,
        { params: { page: targetPage, size: pageSize, ...extraParams } }
      );
      return response.data.studyReviews.filter(
        (art): art is ArticleInterface => "studyReviewId" in art
      );
    } catch (error) {
      console.error(`Failed to fetch page ${targetPage}:`, error);
      return [];
    }
  };

  const onFetchNextPage = async (): Promise<ArticleInterface[]> => {
    const next = navPage + 1;
    const fetched = await fetchPageSilently(next);
    if (fetched.length > 0) { setNavPage(next); setNavArticles(fetched); onTablePageChange(next); }
    return fetched;
  };

  const onFetchPrevPage = async (): Promise<ArticleInterface[]> => {
    const prev = navPage - 1;
    const fetched = await fetchPageSilently(prev);
    if (fetched.length > 0) { setNavPage(prev); setNavArticles(fetched); onTablePageChange(prev); }
    return fetched;
  };

  const onWrapToLast = async (): Promise<ArticleInterface[]> => {
    const lastPage = totalPages - 1;
    const fetched = await fetchPageSilently(lastPage);
    if (fetched.length > 0) { setNavPage(lastPage); setNavArticles(fetched); onTablePageChange(lastPage); }
    return fetched;
  };

  const onWrapToFirst = (): ArticleInterface[] => {
    setNavPage(currentPage); setNavArticles(null); onTablePageChange(0);
    return articles.filter((art): art is ArticleInterface => "studyReviewId" in art);
  };

  const activeArticles: ArticleInterface[] | StudyInterface[] =
    navArticles !== null ? navArticles : articles;

  if (!activeArticles || activeArticles.length === 0) return null;

  const typedArticles = activeArticles.filter(
    (art): art is ArticleInterface => "studyReviewId" in art
  );

  const findSelectedArticle = typedArticles.findIndex(
    (art) => art.studyReviewId === selectedArticleReview
  );

  const studyIndex = findSelectedArticle >= 0 ? findSelectedArticle : 0;
  const currentStudy = activeArticles?.[studyIndex] as StudyInterface;

  useEffect(() => {
    if (studyIndex === 0 && typedArticles[0]) {
      setSelectedArticleReview(typedArticles[0].studyReviewId);
    }
  }, [typedArticles[0]?.studyReviewId]);

  useEffect(() => {
    setIsEditing(false);
    setEditData(null);
  }, [selectedArticleReview]);

  const isSelection = page === "Selection" || page === "Identification";

  function handleStartEdit() {
    setEditData({
      title: currentStudy?.title ?? "",
      authors: currentStudy?.authors ?? "",
      venue: currentStudy?.venue ?? "",
      year: String(currentStudy?.year ?? ""),
      abstract: currentStudy?.abstract ?? "",
      keywords: Array.isArray(currentStudy?.keywords)
        ? currentStudy.keywords.join(", ")
        : (currentStudy?.keywords ?? ""),
    });
    setIsEditing(true);
  }

  async function handleSave() {
    if (!editData) return;
    const studyReviewId = (currentStudy as any).studyReviewId ?? (currentStudy as any).studyId;
    const systematicStudyId = String(currentStudy?.systematicStudyId ?? "");
    if (!systematicStudyId || !studyReviewId) return;
    const searchSessionId = String((currentStudy as any).searchSessionId ?? "");
    const searchSources: string[] = (currentStudy as any).searchSources ?? [];
    const source = searchSources[0] ?? "";
    const studyType = String((currentStudy as any).studyType ?? "ARTICLE");

    setIsSaving(true);
    try {
      await updateStudyReview(systematicStudyId, Number(studyReviewId), {
        searchSessionId,
        type: studyType,
        title: editData.title,
        year: Number(editData.year),
        authors: editData.authors,
        venue: editData.venue,
        abstract: editData.abstract,
        keywords: editData.keywords.split(",").map((k) => k.trim()).filter(Boolean),
        source,
      });

      toast({ title: t("editStudy.toast.successTitle"), status: "success" });
      setIsEditing(false);
      setEditData(null);
      reloadArticles();
    } catch {
      toast({
        title: t("editStudy.toast.errorTitle"),
        description: t("editStudy.toast.errorDesc"),
        status: "error",
      });
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <Flex
      direction="column"
      borderRadius="1rem"
      bg="white"
      w="100%"
      h="100%"
      p="1rem 1.5rem"
      alignItems="center"
      gap="1rem"
    >
      <Flex
        alignItems="center"
        justifyContent="center"
        w={window > 1200 || !isVertical ? "100%" : undefined}
        maxW={window > 1200 || !isVertical ? "100%" : undefined}
      >
        <ButtonsForSelection
          page={page}
          articles={activeArticles}
          articleIndex={studyIndex}
          setSelectedArticleReview={setSelectedArticleReview}
          reloadArticles={reloadArticles}
          isLastPage={navPage >= totalPages - 1}
          isFirstPage={navPage <= 0}
          onFetchNextPage={onFetchNextPage}
          onFetchPrevPage={onFetchPrevPage}
          onWrapToLast={onWrapToLast}
          onWrapToFirst={onWrapToFirst}
          handleChangeLayout={handleChangeLayout}
        />
      </Flex>
      <Box w="100%" h="80%">
        <StudyDataFiel
          studyData={currentStudy}
          page={page}
          isEditing={isEditing}
          editData={editData ?? undefined}
          setEditData={setEditData}
        />
      </Box>
      {isSelection && (
        <Flex w="100%" justifyContent="flex-end" gap={2}>
          {isEditing ? (
            <>
              <EventButton
                event={isSaving ? undefined : handleSave}
                disabled={isSaving}
                icon={
                  isSaving
                    ? <Spinner size="xs" />
                    : <i className="pi pi-save" style={{ color: "inherit" }} />
                }
                w="40px"
                h="40px"
              />
              <EventButton
                event={() => { setIsEditing(false); setEditData(null); }}
                disabled={isSaving}
                icon={<i className="pi pi-times" style={{ color: "inherit" }} />}
                w="40px"
                h="40px"
              />
            </>
          ) : (
            <EventButton
              event={handleStartEdit}
              icon={<EditIcon />}
              w="40px"
              h="40px"
            />
          )}
        </Flex>
      )}
    </Flex>
  );
}