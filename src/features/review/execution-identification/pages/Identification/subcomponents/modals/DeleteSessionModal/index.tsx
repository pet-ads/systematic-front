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

const BLOCKED_STATUSES = ["INCLUDED", "EXCLUDED", "DUPLICATED"];

function getSelectionStatus(study: any): string {
  return (study.selectionStatus ?? study.selection ?? "").toUpperCase();
}

async function canDeleteSession(
  reviewId: string,
  sessionId: string
): Promise<boolean> {
  let page = 0;
  const size = 50;

  while (true) {
    const path = `systematic-study/${reviewId}/find-by-search-session/${sessionId}`;
    const response = await Axios.get(path, { params: { page, size } });
    const studies: any[] = response.data?.studyReviews ?? [];
    const totalPages: number = response.data?.totalPages ?? 1;

    const hasBlocked = studies.some((s) =>
      BLOCKED_STATUSES.includes(getSelectionStatus(s))
    );

    if (hasBlocked) return false;
    if (page >= totalPages - 1) break;
    page++;
  }

  return true;
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
      checkCanDelete={() => canDeleteSession(reviewId, session.id)}
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