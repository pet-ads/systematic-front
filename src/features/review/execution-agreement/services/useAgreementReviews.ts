import { useState, useEffect } from "react";
import Axios from "../../../../infrastructure/http/axiosClient";

export type ReviewsHiddenReason = "HIDDEN" | "NOT_FINISHED";

export interface ReviewerVote {
  reviewerId: string;
  status: string;
  criteria: string[];
}

interface UseAgreementReviewsResult {
  votesByStudy: Record<number, ReviewerVote[]>;
  canSeeReviews: boolean | null;
  reason: ReviewsHiddenReason | null;
  hasError: boolean;
}

const MAX_STUDIES_PER_REQUEST = 100;

export default function useAgreementReviews(
  stage: "selection" | "extraction",
  studyIds: number[]
): UseAgreementReviewsResult {
  const [votesByStudy, setVotesByStudy] = useState<Record<number, ReviewerVote[]>>({});
  const [canSeeReviews, setCanSeeReviews] = useState<boolean | null>(null);
  const [reason, setReason] = useState<ReviewsHiddenReason | null>(null);
  const [hasError, setHasError] = useState(false);

  const id = localStorage.getItem("systematicReviewId") ?? "";
  const backendStage = stage === "selection" ? "SELECTION" : "EXTRACTION";
  const idsKey = studyIds.slice(0, MAX_STUDIES_PER_REQUEST).join(",");

  useEffect(() => {
    if (!id || !idsKey) {
      setVotesByStudy({});
      return;
    }

    let cancelled = false;

    async function load() {
      try {
        const res = await Axios.get(
          `systematic-study/${id}/agreement/study-review/reviews`,
          { params: { stage: backendStage, studyReviewIds: idsKey } }
        );
        if (cancelled) return;

        const next: Record<number, ReviewerVote[]> = {};
        (res.data?.studies ?? []).forEach((s: any) => {
          next[s.studyReviewId] = (s.reviews ?? []).map((r: any) => ({
            reviewerId: r.reviewerId,
            status: String(r.status ?? "UNCLASSIFIED"),
            criteria: Array.from(r.criteria ?? []) as string[],
          }));
        });
        setVotesByStudy(next);
        setCanSeeReviews(res.data?.canSeeReviews ?? null);
        setReason(res.data?.reason ?? null);
        setHasError(false);
      } catch {
        if (cancelled) return;
        setVotesByStudy({});
        setCanSeeReviews(null);
        setReason(null);
        setHasError(true);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [id, backendStage, idsKey]);

  return { votesByStudy, canSeeReviews, reason, hasError };
}