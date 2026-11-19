import { useState, useEffect } from "react";
import Axios from "../../../../infrastructure/http/axiosClient";

export type AgreementVisibility = "ALL" | "FINISHED_ONLY" | "NONE";

export interface AgreementVisibilityState {
  selection: AgreementVisibility;
  extraction: AgreementVisibility;
}

interface UseAgreementVisibilityResult {
  visibility: AgreementVisibilityState | null;
  myRole: string | null;
  canManage: boolean;
  setVisibility: (
    stage: "SELECTION" | "EXTRACTION",
    visibility: AgreementVisibility
  ) => Promise<void>;
  isLoading: boolean;
}

export default function useAgreementVisibility(): UseAgreementVisibilityResult {
  const [visibility, setVisibilityState] =
    useState<AgreementVisibilityState | null>(null);
  const [myRole, setMyRole] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const id = localStorage.getItem("systematicReviewId") ?? "";

  useEffect(() => {
    if (!id) return;

    async function fetchAll() {
      setIsLoading(true);
      try {
        const [visRes, roleRes] = await Promise.all([
          Axios.get(`systematic-study/${id}/agreement/visibility`),
          Axios.get(`systematic-study/${id}/collaborator/me/role`),
        ]);
        setVisibilityState({
          selection: visRes.data?.selection ?? "FINISHED_ONLY",
          extraction: visRes.data?.extraction ?? "FINISHED_ONLY",
        });
        setMyRole((roleRes.data?.role as string)?.toUpperCase() ?? null);
      } catch {
        setVisibilityState({ selection: "FINISHED_ONLY", extraction: "FINISHED_ONLY" });
      } finally {
        setIsLoading(false);
      }
    }

    fetchAll();
  }, [id]);

  async function setVisibility(
    stage: "SELECTION" | "EXTRACTION",
    newVisibility: AgreementVisibility
  ) {
    await Axios.put(`systematic-study/${id}/agreement/visibility`, {
      stage,
      visibility: newVisibility,
    });
    setVisibilityState((prev) =>
      prev
        ? { ...prev, [stage.toLowerCase()]: newVisibility }
        : { selection: "FINISHED_ONLY", extraction: "FINISHED_ONLY" }
    );
  }

  return {
    visibility,
    myRole,
    canManage: myRole === "OWNER" || myRole === "ADMIN",
    setVisibility,
    isLoading,
  };
}