import useFetchAllStudies from "./fetch/useFetchAllStudies";
import useFetchProtocol from "./fetch/useFetchProtocol";
import { Protocol } from "../../public/interfaces/protocolInterface";
import { StudyReview } from "../../public/interfaces/studyReviewInterface";
import useGetAllReviewArticles from "./useGetAllReviewArticles";
import useFetchAllClassifiedArticles from "./fetch/useFetchAllClassifiedArticles";
import ArticleInterface from "../../public/interfaces/ArticleInterface";

function isProtocolPartOneFinished(response: Protocol) {
  return response.goal !== null && response.justification !== null;
}

function isPicocInitialized(response: Protocol) {
  const { picoc } = response;
  return (
    (picoc.control && response.picoc.control.trim() !== "") ||
    (picoc.intervention && response.picoc.intervention.trim() !== "") ||
    (picoc.outcome && response.picoc.outcome.trim() !== "") ||
    (picoc.population && response.picoc.population.trim() !== "")
  );
}

function isPicocFinished(response: Protocol) {
  const { picoc } = response;
  const { control, intervention, outcome, population } = picoc;
  return (
    control !== null &&
    intervention !== null &&
    outcome !== null &&
    population !== null
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

export default async function goToUnfinishedSystematicReviewPart(
  revisionId: string
) {
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
    window.location.href = `http://localhost:5173/#/newReview/protocol/${revisionId}`;
  } else if (
    isPicocInitialized(protocolData) &&
    !isPicocFinished(protocolData)
  ) {
    window.location.href = `http://localhost:5173/#/newReview/protocol/${revisionId}`;
  } else if (!isProtocolPartTwoFinished(protocolData)) {
    window.location.href = `http://localhost:5173/#/newReview/protocolpartTwo/${revisionId}`;
  } else if (!isProtocolPartThreeFinished(protocolData)) {
    window.location.href = `http://localhost:5173/#/newReview/protocolpartThree/${revisionId}`;
  } else if (!isSelectionProcessFinished(articles)) {
    window.location.href = `http://localhost:5173/#/newReview/selection`;
  } else if (!isExtractionProcessFinished(includedArticlesList)) {
    window.location.href = `http://localhost:5173/#/newReview/extraction`;
  } else {
    window.location.href = `http://localhost:5173/#/newReview/finalization`;
  }
}
