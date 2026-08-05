import Axios from "../../../../../../../../infrastructure/http/axiosClient";

interface Props {
  systematicStudyId: string;
  researcherId: string;
}

export async function removeCollaborator({
  systematicStudyId,
  researcherId,
}: Props): Promise<void> {
  const path = `systematic-study/${systematicStudyId}/collaborator/${researcherId}`;
  await Axios.delete(path);
}