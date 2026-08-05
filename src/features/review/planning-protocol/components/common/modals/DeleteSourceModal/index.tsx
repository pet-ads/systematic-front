import { useTranslation } from "react-i18next";

import Axios from "../../../../../../../infrastructure/http/axiosClient";
import DeleteWithValidationModal from "@features/review/shared/components/common/modals/DeleteWithValidationModal";
import { capitalize } from "@features/shared/utils/helpers/formatters/CapitalizeText";

interface DeleteSourceModalProps {
  sourceName: string;
  onConfirm: () => void;
  onClose: () => void;
}

interface Session {
  id: string;
  numberOfRelatedStudies: number;
}

const BLOCKED_STATUSES = ["INCLUDED", "EXCLUDED", "DUPLICATED"];

function getSelectionStatus(study: any): string {
  return (study.selectionStatus ?? study.selection ?? "").toUpperCase();
}

function toTitleCase(text: string): string {
  return text
    .toLowerCase()
    .split(" ")
    .map((word) => capitalize(word))
    .join(" ");
}


async function fetchSessionsForSource(
  reviewId: string,
  sourceName: string
): Promise<Session[]> {
  const formattedName = toTitleCase(sourceName);

  try {
    const path = `systematic-study/${reviewId}/search-session-source/${encodeURIComponent(formattedName)}`;
    const response = await Axios.get(path);
    const sessions: Session[] = response.data?.searchSessions ?? [];
    return sessions;
  } catch (err) {
    console.error("Erro ao buscar sessões para a fonte", formattedName, err);
    throw err;
  }
}

async function canDeleteSource(
  reviewId: string,
  sourceName: string
): Promise<boolean> {
  const sessions = await fetchSessionsForSource(reviewId, sourceName);

  if (sessions.length === 0) return true;

  for (const session of sessions) {
    if (session.numberOfRelatedStudies === 0) continue;

    let page = 0;
    const size = 50;

    while (true) {
      const articlesPath = `systematic-study/${reviewId}/find-by-search-session/${session.id}`;
      const articlesResponse = await Axios.get(articlesPath, {
        params: { page, size },
      });
      const studies: any[] = articlesResponse.data?.studyReviews ?? [];
      const totalPages: number = articlesResponse.data?.totalPages ?? 1;

      const hasBlocked = studies.some((s) =>
        BLOCKED_STATUSES.includes(getSelectionStatus(s))
      );

      if (hasBlocked) return false;
      if (page >= totalPages - 1) break;
      page++;
    }
  }

  return true;
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