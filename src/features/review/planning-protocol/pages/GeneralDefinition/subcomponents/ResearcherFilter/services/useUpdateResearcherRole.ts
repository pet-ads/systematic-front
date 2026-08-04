import Axios from "../../../../../../../../infrastructure/http/axiosClient";

interface Props {
  systematicStudyId: string;
  researcherId: string;
  role: string;
}

export async function updateResearcherRole({
  systematicStudyId,
  researcherId,
  role,
}: Props): Promise<void> {
  const path = `systematic-study/${systematicStudyId}/collaborator`;
  await Axios.put(path, { researcherId, role: role.toUpperCase() });
}