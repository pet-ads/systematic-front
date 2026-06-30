import { KeyedMutator } from "swr";
import { useTranslation } from "react-i18next";

import Axios from "../../../../../../../../infrastructure/http/axiosClient";
import UseDeleteSession from "../../../../../services/useDeleteSession";
import DeleteWithValidationModal from "@features/review/shared/components/common/modals/DeleteWithValidationModal";

interface Session {
  id: string;
  systematicStudyd: string;
  userId: string;
  searchString: string;
  additionalInfo: string;
  timestamp: string;
  source: string;
  numberOfRelatedStudies: number;
}

interface DeleteSessionModalProps {
  show: (value: boolean) => void;
  session: Session;
  mutate: KeyedMutator<Session[]>;
}

type SelectionStatus = "INCLUDED" | "EXCLUDED" | "DUPLICATED" | "UNCLASSIFIED";

async function canDeleteSession(
  reviewId: string,
  sessionId: string,
  numberOfRelatedStudies: number
): Promise<boolean> {
  if (numberOfRelatedStudies === 0) return true;

  const size = Math.max(numberOfRelatedStudies, 1);
  const path = `systematic-study/${reviewId}/find-by-search-session/${sessionId}`;
  const response = await Axios.get(path, { params: { page: 0, size } });
  const studies = response.data?.studyReviews ?? [];

  const blockedStatuses: SelectionStatus[] = ["INCLUDED", "EXCLUDED", "DUPLICATED"];
  return !studies.some((s: any) =>
    blockedStatuses.includes(s.selectionStatus as SelectionStatus)
  );
}

export default function DeleteSessionModal({
  show,
  session,
  mutate,
}: DeleteSessionModalProps) {
  const { t } = useTranslation("review/execution-identification");
  const reviewId = localStorage.getItem("systematicReviewId") ?? "";

  return (
    <DeleteWithValidationModal
      checkCanDelete={() =>
        canDeleteSession(reviewId, session.id, session.numberOfRelatedStudies)
      }
      onConfirm={async () => {
        await UseDeleteSession({ sessionId: session.id, mutate });
      }}
      onClose={() => show(false)}
      labels={{
        heading: t("dataBaseCard.deleteSessionModal.heading"),
        confirmMessage: t("dataBaseCard.deleteSessionModal.confirmMessage"),
        blockedTitle: t("dataBaseCard.deleteSessionModal.blockedTitle"),
        blockedMessage: t("dataBaseCard.deleteSessionModal.blockedMessage"),
        checking: t("dataBaseCard.deleteSessionModal.checking"),
        cancel: t("dataBaseCard.deleteSessionModal.cancel"),
        confirm: t("dataBaseCard.deleteSessionModal.confirm"),
        successTitle: t("dataBaseCard.deleteSessionModal.toasts.success.title"),
        successDescription: t("dataBaseCard.deleteSessionModal.toasts.success.description"),
        errorTitle: t("dataBaseCard.deleteSessionModal.toasts.catch.title"),
        errorDescription: t("dataBaseCard.deleteSessionModal.toasts.catch.description"),
      }}
    />
  );
}