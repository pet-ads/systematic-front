import { useState, useEffect } from "react";
import Axios from "../../../../infrastructure/http/axiosClient";

const collaboratorsCache = new Map<string, boolean>();

export default function useHasCollaborators(): boolean {
  const id = localStorage.getItem("systematicReviewId");

  const [hasCollaborators, setHasCollaborators] = useState<boolean>(() =>
    id ? (collaboratorsCache.get(id) ?? false) : false,
  );

  useEffect(() => {
    if (!id) return;

    const cached = collaboratorsCache.get(id);
    if (cached !== undefined) setHasCollaborators(cached);

    let cancelled = false;

    Axios.get(`systematic-study/${id}/collaborators`)
      .then((response) => {
        const confirmed: unknown[] = response.data?.collaborators ?? [];
        const value = confirmed.length > 1;
        collaboratorsCache.set(id, value);
        if (!cancelled) setHasCollaborators(value);
      })
      .catch(() => {
        if (!cancelled && cached === undefined) setHasCollaborators(false);
      });

    return () => {
      cancelled = true;
    };
  }, [id]);

  return hasCollaborators;
}