import Axios from "../../../../../../../../infrastructure/http/axiosClient";

export interface Researcher {
  id: string;
  name: string;
  email: string;
  role: string;
  status: "included" | "pending" | "expired";
}

export async function fetchCollaborators(
  systematicStudyId: string
): Promise<Researcher[]> {
  const path = `systematic-study/${systematicStudyId}/collaborators`;
  const response = await Axios.get(path);
 
  const invited: Researcher[] = (response.data?.invited ?? [])
    .filter((c: any) => c.status === "PENDENTE" || c.status === "EXPIRADO")
    .map((c: any) => ({
      id: c.id,
      name: c.username,
      email: c.email,
      role: "reviewer",
      status: c.status === "EXPIRADO" ? ("expired" as const) : ("pending" as const),
    }));
 
  const collaborators: Researcher[] = (response.data?.collaborators ?? []).map(
    (c: any) => ({
      id: c.id,
      name: c.username,
      email: c.email,
      role: (c.role as string).toLowerCase(),
      status: "included" as const,
    })
  );
 
  return [...invited, ...collaborators];
}