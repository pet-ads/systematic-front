import Axios from "../../../../../../../../infrastructure/http/axiosClient";

interface Props {
  systematicStudyId: string;
  researcherId: string;
  status?: "included" | "pending" | "expired" | string;
}

export async function removeCollaborator({
  systematicStudyId,
  researcherId,
  status,
}: Props): Promise<void> {
  const isInvite = status === "pending" || status === "expired";

  const path = isInvite
    ? `systematic-study/${systematicStudyId}/collaborator-invite/${researcherId}`
    : `systematic-study/${systematicStudyId}/collaborator/${researcherId}`;

  await Axios.delete(path);
}