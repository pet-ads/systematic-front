import Axios from "../../../../../../../../infrastructure/http/axiosClient";

export interface CollaboratorCandidate {
  id: string;
  username: string;
  email: string;
}

interface Props {
  systematicStudyId: string;
  prefix: string;
}

export async function searchCollaboratorCandidates({
  systematicStudyId,
  prefix,
}: Props): Promise<CollaboratorCandidate[]> {
  const path = `systematic-study/${systematicStudyId}/search-researchers`;
  const response = await Axios.get(path, { params: { prefix } });

  const outer = response.data?.researchers;
  return (outer?.researchers ?? outer ?? []) as CollaboratorCandidate[];
}