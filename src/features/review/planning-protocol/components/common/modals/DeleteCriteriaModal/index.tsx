import { useTranslation } from "react-i18next";

import Axios from "../../../../../../../infrastructure/http/axiosClient";
import DeleteWithValidationModal from "@features/review/shared/components/common/modals/DeleteWithValidationModal";

interface DeleteCriteriaModalProps {
  criteriaDescription: string;
  onConfirm: () => void;
  onClose: () => void;
}

interface StudyReviewDto {
  criteria: string[];
}

interface PagedResponse {
  studyReviews: StudyReviewDto[];
  totalPages: number;
}

const BLOCKED_STATUSES = ["INCLUDED", "EXCLUDED"];

async function hasStudiesWithStatus(
  reviewId: string,
  criteriaDescription: string,
  selectionStatus: string
): Promise<boolean> {
  const size = 50;
  let page = 0;

  while (true) {
    const path = `systematic-study/${reviewId}/study-review/search`;
    const response = await Axios.get<PagedResponse>(path, {
      params: { page, size, selectionStatus },
    });

    const studies = response.data?.studyReviews ?? [];
    const totalPages = response.data?.totalPages ?? 0;

    const found = studies.some((s) =>
      (s.criteria ?? []).includes(criteriaDescription)
    );

    if (found) return true;
    if (page >= totalPages - 1) break;
    page++;
  }

  return false;
}

async function canDeleteCriteria(
  reviewId: string,
  criteriaDescription: string
): Promise<boolean> {
  for (const status of BLOCKED_STATUSES) {
    const blocked = await hasStudiesWithStatus(
      reviewId,
      criteriaDescription,
      status
    );
    if (blocked) return false;
  }
  return true;
}

export default function DeleteCriteriaModal({
  criteriaDescription,
  onConfirm,
  onClose,
}: DeleteCriteriaModalProps) {
  const { t } = useTranslation("review/planning-protocol");
  const reviewId = localStorage.getItem("systematicReviewId") ?? "";

  return (
    <DeleteWithValidationModal
      checkCanDelete={() => canDeleteCriteria(reviewId, criteriaDescription)}
      onConfirm={async () => onConfirm()}
      onClose={onClose}
      labels={{
        heading: t("deleteCriteriaModal.heading"),
        confirmMessage: t("deleteCriteriaModal.confirmMessage"),
        blockedTitle: t("deleteCriteriaModal.blockedTitle"),
        blockedMessage: t("deleteCriteriaModal.blockedMessage"),
        checking: t("deleteCriteriaModal.checking"),
        cancel: t("deleteCriteriaModal.cancel"),
        confirm: t("deleteCriteriaModal.confirm"),
        successTitle: t("deleteCriteriaModal.toasts.success.title"),
        successDescription: t("deleteCriteriaModal.toasts.success.description"),
        errorTitle: t("deleteCriteriaModal.toasts.catch.title"),
        errorDescription: t("deleteCriteriaModal.toasts.catch.description"),
      }}
    />
  );
}