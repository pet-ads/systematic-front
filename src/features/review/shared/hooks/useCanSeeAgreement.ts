import { useState, useEffect } from "react";
import Axios from "../../../../infrastructure/http/axiosClient";

type AgreementVisibility = "ALL" | "FINISHED_ONLY" | "NONE";

export interface CanSeeAgreement {
  selection: boolean;
  extraction: boolean;
  isLoading: boolean;
}

export default function useCanSeeAgreement(): CanSeeAgreement {
  const id = localStorage.getItem("systematicReviewId") ?? "";
  const [state, setState] = useState<CanSeeAgreement>({
    selection: false,
    extraction: false,
    isLoading: !!id,
  });

  useEffect(() => {
    if (!id) {
      setState({ selection: false, extraction: false, isLoading: false });
      return;
    }

    const allowedFor = (visibility: AgreementVisibility) =>
      visibility === "ALL" || visibility === "FINISHED_ONLY";

    async function check() {
      try {
        const [collabRes, visRes, roleRes] = await Promise.all([
          Axios.get(`systematic-study/${id}/collaborators`),
          Axios.get(`systematic-study/${id}/agreement/visibility`),
          Axios.get(`systematic-study/${id}/collaborator/me/role`),
        ]);

        const collaborators: unknown[] = collabRes.data?.collaborators ?? [];
        if (collaborators.length <= 1) {
          setState({ selection: false, extraction: false, isLoading: false });
          return;
        }

        const role = (roleRes.data?.role as string)?.toUpperCase() ?? "";
        if (role === "OWNER" || role === "ADMIN") {
          setState({ selection: true, extraction: true, isLoading: false });
          return;
        }

        setState({
          selection: allowedFor(visRes.data?.selection ?? "FINISHED_ONLY"),
          extraction: allowedFor(visRes.data?.extraction ?? "FINISHED_ONLY"),
          isLoading: false,
        });
      } catch {
        setState({ selection: false, extraction: false, isLoading: false });
      }
    }

    check();
  }, [id]);

  return state;
}