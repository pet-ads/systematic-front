import { useTranslation } from "react-i18next";

import Axios from "../../../../../../../infrastructure/http/axiosClient";
import DeleteWithValidationModal from "@features/review/shared/components/common/modals/DeleteWithValidationModal";

interface DeleteSourceModalProps {
  sourceName: string;
  onConfirm: () => void;
  onClose: () => void;
}

type SelectionStatus = "INCLUDED" | "EXCLUDED" | "DUPLICATED" | "UNCLASSIFIED";

async function canDeleteSource(
  reviewId: string,
  sourceName: string
): Promise<boolean> {
  const path = `systematic-study/${reviewId}/search-source/${encodeURIComponent(sourceName)}`;
  const response = await Axios.get(path);
  const studies = response.data?.studyReviews ?? [];

  if (studies.length === 0) return true;

  const blockedStatuses: SelectionStatus[] = ["INCLUDED", "EXCLUDED", "DUPLICATED"];
  return !studies.some((s: any) =>
    blockedStatuses.includes(s.selectionStatus as SelectionStatus)
  );
}

export default function DeleteSourceModal({
  sourceName,
  onConfirm,
  onClose,
}: DeleteSourceModalProps) {
  const { t } = useTranslation("review/planning-protocol");
  const reviewId = localStorage.getItem("systematicReviewId") ?? "";

  return (
    <DeleteWithValidationModal
      checkCanDelete={() => canDeleteSource(reviewId, sourceName)}
      onConfirm={async () => onConfirm()}
      onClose={onClose}
      labels={{
        heading: t("deleteSourceModal.heading"),
        confirmMessage: `${t("deleteSourceModal.confirmMessage")} ${sourceName}?`,
        blockedTitle: t("deleteSourceModal.blockedTitle"),
        blockedMessage: t("deleteSourceModal.blockedMessage"),
        checking: t("deleteSourceModal.checking"),
        cancel: t("deleteSourceModal.cancel"),
        confirm: t("deleteSourceModal.confirm"),
        successTitle: t("deleteSourceModal.toasts.success.title"),
        successDescription: t("deleteSourceModal.toasts.success.description"),
        errorTitle: t("deleteSourceModal.toasts.catch.title"),
        errorDescription: t("deleteSourceModal.toasts.catch.description"),
      }}
    />
  );
}