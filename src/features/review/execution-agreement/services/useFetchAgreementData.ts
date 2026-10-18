import { useState, useEffect } from "react";
import Axios from "../../../../infrastructure/http/axiosClient";
import type { AgreementStudy } from "../components/AgreementTable";

export interface Collaborator {
  id: string;
  username: string;
  role: string;
}

interface UseFetchAgreementDataResult {
  studies: AgreementStudy[];
  reviewers: string[];
  inclusionCriteria: string[];
  exclusionCriteria: string[];
}

export default function useFetchAgreementData(
  stage: "selection" | "extraction",
): UseFetchAgreementDataResult {
  const [studies, setStudies] = useState<AgreementStudy[]>([]);
  const [reviewers, setReviewers] = useState<string[]>([]);
  const [inclusionCriteria, setInclusionCriteria] = useState<string[]>([]);
  const [exclusionCriteria, setExclusionCriteria] = useState<string[]>([]);

  const id = localStorage.getItem("systematicReviewId") ?? "";
  const backendStage = stage === "selection" ? "SELECTION" : "EXTRACTION";

  useEffect(() => {
    if (!id) return;

    async function fetchAll() {
      try {
        const collabRes = await Axios.get(
          `systematic-study/${id}/collaborators`,
        );
        const collaborators: Collaborator[] =
          collabRes.data?.collaborators ?? [];
        const reviewerNames = collaborators
          .filter((c) => c.role?.toUpperCase() !== "OWNER")
          .map((c) => c.username);
        setReviewers(reviewerNames);
      } catch {
        setReviewers([]);
      }

      try {
        const path = backendStage === "SELECTION"
          ? `systematic-study/${id}/study-review/search`
          : `systematic-study/${id}/study-review/selection-included`;

        const studiesRes = await Axios.get(
          path,
          { params: { size: 1000 } },
        );
        const rawStudies = studiesRes.data?.studyReviews ?? [];
        const mappedStudies: AgreementStudy[] = rawStudies.map((s: any) => ({
          id: s.studyReviewId,
          title: s.title ?? "",
          author: s.authors ?? "",
          venue: s.venue ?? "",
          year: s.year ?? 0,
          reviewerDecisions: {},
          reviewerCriteria: {},
          finalStatus: (backendStage === "SELECTION" ? s.selectionStatus ?? "UNCLASSIFIED" : s.extractionStatus ?? "UNCLASSIFIED").toLowerCase() as
            | "included"
            | "excluded"
            | "unclassified"
            | "duplicated",
        }));
        setStudies(mappedStudies);
      } catch {
        setStudies([]);
      }

      try {
        const icRes = await Axios.get(
          `systematic-study/${id}/report/criteria/INCLUSION`,
          { params: { stage: backendStage } },
        );
        setInclusionCriteria(Object.keys(icRes.data?.criteria ?? {}));
      } catch {
        setInclusionCriteria([]);
      }

      try {
        const ecRes = await Axios.get(
          `systematic-study/${id}/report/criteria/EXCLUSION`,
          { params: { stage: backendStage } },
        );
        setExclusionCriteria(Object.keys(ecRes.data?.criteria ?? {}));
      } catch {
        setExclusionCriteria([]);
      }
    }

    fetchAll();
  }, [id, backendStage]);

  return { studies, reviewers, inclusionCriteria, exclusionCriteria };
}
