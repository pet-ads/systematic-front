import { useState, useEffect, useCallback } from "react";
import Axios from "../../../../infrastructure/http/axiosClient";
import type { AgreementStudy, FinalStatus } from "../components/AgreementTable";

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
  collaborators: Collaborator[];
  canJudge: boolean;
  reloadStudies: () => Promise<void>;
}

const FINAL_STATUSES: FinalStatus[] = [
  "included",
  "excluded",
  "unclassified",
  "duplicated",
];

export default function useFetchAgreementData(
  stage: "selection" | "extraction"
): UseFetchAgreementDataResult {
  const [studies, setStudies] = useState<AgreementStudy[]>([]);
  const [reviewers, setReviewers] = useState<string[]>([]);
  const [inclusionCriteria, setInclusionCriteria] = useState<string[]>([]);
  const [exclusionCriteria, setExclusionCriteria] = useState<string[]>([]);
  const [collaborators, setCollaborators] = useState<Collaborator[]>([]);
  const [myRole, setMyRole] = useState<string | null>(null);

  const id = localStorage.getItem("systematicReviewId") ?? "";
  const backendStage = stage === "selection" ? "SELECTION" : "EXTRACTION";

  const loadStudies = useCallback(async () => {
    if (!id) return;
    try {
      const res = await Axios.get(`systematic-study/${id}/study-review/search`, {
        params: { size: 1000 },
      });
      const raw = res.data?.studyReviews ?? [];
      const mapped: AgreementStudy[] = raw.map((s: any) => {
        const rawStatus = String(
          (stage === "selection" ? s.selectionStatus : s.extractionStatus) ??
            "UNCLASSIFIED"
        ).toLowerCase() as FinalStatus;
        const currentCriteria: string[] = Array.from(
          (stage === "selection" ? s.selectionCriteria : s.extractionCriteria) ??
            []
        );

        return {
          id: s.studyReviewId,
          title: s.title ?? "",
          author: s.authors ?? "",
          venue: s.venue ?? "",
          year: s.year ?? 0,
          reviewerDecisions: {},
          reviewerCriteria: {},
          currentCriteria,
          finalStatus: FINAL_STATUSES.includes(rawStatus)
            ? rawStatus
            : "unclassified",
        };
      });
      setStudies(mapped);
    } catch {
      setStudies([]);
    }
  }, [id, stage]);

  useEffect(() => {
    if (!id) return;

    async function fetchRest() {
      try {
        const collabRes = await Axios.get(`systematic-study/${id}/collaborators`);
        const list: Collaborator[] = collabRes.data?.collaborators ?? [];
        setCollaborators(list);
        setReviewers(
          list
            .filter((c) => c.role?.toUpperCase() !== "OWNER")
            .map((c) => c.username)
        );
      } catch {
        setCollaborators([]);
        setReviewers([]);
      }

      try {
        const roleRes = await Axios.get(
          `systematic-study/${id}/collaborator/me/role`
        );
        setMyRole(String(roleRes.data?.role ?? "").toUpperCase() || null);
      } catch {
        setMyRole(null);
      }

      try {
        const icRes = await Axios.get(
          `systematic-study/${id}/report/criteria/INCLUSION`,
          { params: { stage: backendStage } }
        );
        setInclusionCriteria(Object.keys(icRes.data?.criteria ?? {}));
      } catch {
        setInclusionCriteria([]);
      }

      try {
        const ecRes = await Axios.get(
          `systematic-study/${id}/report/criteria/EXCLUSION`,
          { params: { stage: backendStage } }
        );
        setExclusionCriteria(Object.keys(ecRes.data?.criteria ?? {}));
      } catch {
        setExclusionCriteria([]);
      }
    }

    loadStudies();
    fetchRest();
  }, [id, backendStage, loadStudies]);

  return {
    studies,
    reviewers,
    inclusionCriteria,
    exclusionCriteria,
    collaborators,
    canJudge: myRole === "OWNER" || myRole === "ADMIN",
    reloadStudies: loadStudies,
  };
}
