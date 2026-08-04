import Axios from "../../../../../../../../infrastructure/http/axiosClient";

interface Props {
  systematicStudyId: string;
  usernameCollaborator: string;
}

export interface InviteCollaboratorResponse {
  collaboratorUsername: string;
  collaboratorEmail: string;
  inviteStatus: string;
}

export async function inviteCollaborator({
  systematicStudyId,
  usernameCollaborator,
}: Props): Promise<InviteCollaboratorResponse> {
  const path = `systematic-study/${systematicStudyId}/invite-collaborator`;
  const response = await Axios.post(path, { usernameCollaborator });
  return response.data as InviteCollaboratorResponse;
}