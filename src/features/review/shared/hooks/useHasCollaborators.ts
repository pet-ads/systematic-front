import { useState, useEffect } from "react";
import Axios from "../../../../infrastructure/http/axiosClient";

export default function useHasCollaborators(): boolean {
  const [hasCollaborators, setHasCollaborators] = useState(false);
  const id = localStorage.getItem("systematicReviewId");

  useEffect(() => {
    if (!id) return;

    Axios.get(`systematic-study/${id}/collaborators`)
      .then((response) => {
        const confirmed: unknown[] = response.data?.collaborators ?? [];
        setHasCollaborators(confirmed.length > 1);
      })
      .catch(() => {
        setHasCollaborators(false);
      });
  }, [id]);

  return hasCollaborators;
}