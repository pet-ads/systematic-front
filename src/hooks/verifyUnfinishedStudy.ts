import useFetchAllStudies from "./fetch/useFetchAllStudies";
import useFetchProtocol from "./fetch/useFetchProtocol";
import { Protocol } from "../../public/interfaces/protocolInterface";
import { StudyReview } from "../../public/interfaces/studyReviewInterface";
import useFetchAllClassifiedArticles from "./fetch/useFetchAllClassifiedArticles";
import ArticleInterface from "../../public/interfaces/ArticleInterface";

function isProtocolPartOneFinished(response: Protocol) {
  return response.goal !== null && response.justification !== null;
}

function isPicocInitialized(response: Protocol) {
  const { picoc } = response;
  return (
    (picoc.control && picoc.control.trim() !== "") ||
    (picoc.intervention && picoc.intervention.trim() !== "") ||
    (picoc.outcome && picoc.outcome.trim() !== "") ||
    (picoc.population && picoc.population.trim() !== "")
  );
}

function isPicocFinished(response: Protocol) {
  const { picoc } = response;
  return (
    picoc.control !== null &&
    picoc.intervention !== null &&
    picoc.outcome !== null &&
    picoc.population !== null
  );
}

function isProtocolPartTwoFinished(response: Protocol) {
  const {
    studiesLanguages,
    eligibilityCriteria,
    informationSources,
    keywords,
    sourcesSelectionCriteria,
    searchMethod,
    selectionProcess,
  } = response;
  return (
    studiesLanguages !== null &&
    eligibilityCriteria !== null &&
    informationSources !== null &&
    keywords !== null &&
    sourcesSelectionCriteria !== null &&
    searchMethod !== null &&
    selectionProcess !== null
  );
}

function isProtocolPartThreeFinished(response: Protocol) {
  const { researchQuestions, analysisAndSynthesisProcess } = response;
  return researchQuestions !== null && analysisAndSynthesisProcess !== null;
}

function isSelectionProcessFinished(response: ArticleInterface[]) {
  return response.length > 0;
}

function isExtractionProcessFinished(response: ArticleInterface[]) {
  return response.length > 0;
}

export default async function verifyUnfinishedStudy(revisionId: string) {
  const protocolData = await useFetchProtocol(revisionId);
  const {
    duplicatedArticlesList,
    excludedArticlesList,
    includedArticlesList,
    unclassifiedArticlesList,
  } = useFetchAllClassifiedArticles();

  const articles = [
    ...includedArticlesList,
    ...excludedArticlesList,
    ...unclassifiedArticlesList,
    ...duplicatedArticlesList,
  ];

  if (!isProtocolPartOneFinished(protocolData)) {
    return "Protocol part 1";
  } else if (
    isPicocInitialized(protocolData) &&
    !isPicocFinished(protocolData)
  ) {
    return "Picoc";
  } else if (!isProtocolPartTwoFinished(protocolData)) {
    return "Protocol part 2";
  } else if (!isProtocolPartThreeFinished(protocolData)) {
    return "Protocol part 3";
  } else if (!isSelectionProcessFinished(articles)) {
    return "Selection";
  } else if (!isExtractionProcessFinished(includedArticlesList)) {
    return "Extraction";
  } else {
    return "Finalization";
  }
}
