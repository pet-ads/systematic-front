// External library
import { useEffect, useState } from "react";

// Service
import fetchSystematicStudyInformation from "./useSystematicStudyInfo";
import useCreateReview from "./useCreateReview";
import useUpdateReview from "./useUpdateReview";

// Hooks
import { useNavigation } from "@features/shared/hooks/useNavigation";

// Types
import type { GeneralDefinition } from "../pages/GeneralDefinition/types";

// Guards
import { isLeft } from "@features/shared/errors/pattern/Either";

// Components
import useToaster from "@components/feedback/Toaster";

// Constants
const defaultGeneralDefinition = {
  title: "",
  description: "",
  goal: "",
  collaborators: [],
};

export default function useStructureReview() {
  const [generalDefinition, setGeneralDefinition] = useState<GeneralDefinition>(
    defaultGeneralDefinition
  );
  const [isReturn, setIsReturn] = useState(false);
  const [isTitleValid, setIsTitleValid] = useState(true);

  const { title, collaborators, description, goal } = generalDefinition;
  const id = localStorage.getItem("systematicReviewId") || "";

  const { create } = useCreateReview();
  const { update } = useUpdateReview();
  const { toGo } = useNavigation();
  const toast = useToaster();

  const handleChangeGeneralDefinition = (
    key: keyof typeof generalDefinition,
    value: string
  ) => {
    setGeneralDefinition((prev) => ({
      ...prev,
      [key]: key != "collaborators" ? value : value.split(","),
    }));
  };

  const hasValidTitle = () => {
    if (title !== "") return true;
    setIsTitleValid(false);
    return false;
  };

  const navigateToNextSection = (id: string) => {
    toGo(`/review/planning/protocol/research-questions/${id}`);
  };

  useEffect(() => {
    async function fetch() {
      if (id) {
        setIsReturn(true);

        const reviewData = await fetchSystematicStudyInformation(id);

        const { title, description } = reviewData;
        handleChangeGeneralDefinition("title", title);
        handleChangeGeneralDefinition("description", description);
      }
    }

    fetch();
  }, []);

  const handlePost = async () => {
    if (!hasValidTitle()) return;

    const result = await create({
      title,
      description,
      goal,
      collaborators,
    });

    if (result && isLeft(result)) {
      toast({
        title: "Error",
        status: "error",
        description: result.value.message,
      });
      return;
    }

    const reviewId = result.value.systematicStudyId;
    localStorage.setItem("systematicReviewId", reviewId);
    navigateToNextSection(reviewId);
  };

  const handlePut = async () => {
    if (!hasValidTitle()) return;

    const result = await update({
      systematicStudyId: id,
      title,
      description,
      goal,
    });

    if (result && isLeft(result)) {
      toast({
        title: "Error",
        status: "error",
        description: result.value.message,
      });
      return;
    }

    navigateToNextSection(id);
  };

  return {
    generalDefinition,
    handleChangeGeneralDefinition,
    isReturn,
    isTitleValid,
    setIsTitleValid,
    handlePost,
    handlePut,
  };
}
