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
import useValidatorSQLInjection from "@features/shared/hooks/useValidatorSQLInjection";

// Constants
const defaultGeneralDefinition = {
  title: "",
  description: "",
  objectives: "",
  collaborators: [],
};

export default function useStructureReview() {
  const [generalDefinition, setGeneralDefinition] = useState<GeneralDefinition>(
    defaultGeneralDefinition
  );
  const [isReturn, setIsReturn] = useState(false);
  const [isTitleValid, setIsTitleValid] = useState(true);

  const { title, collaborators, description, objectives } = generalDefinition;
  const id = localStorage.getItem("systematicReviewId") || "";

  const { create } = useCreateReview();
  const { update } = useUpdateReview();
  const { toGo } = useNavigation();
  const toast = useToaster();
  const validator = useValidatorSQLInjection();

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
    toGo(`/review/planning/protocol/picoc/${id}`);
  };

  useEffect(() => {
    async function fetch() {
      if (id) {
        setIsReturn(true);

        const reviewData = await fetchSystematicStudyInformation(id);

        const { title, description, objectives } = reviewData;

        setGeneralDefinition((prev) => ({
          ...prev,
          title,
          description,
          objectives,
        }));
      }
    }

    fetch();
  }, []);

  const handlePost = async () => {
    if (!hasValidTitle()) return;
    if(!(validator({value: title}) && validator({value: description}) && validator({value: objectives}))) return;

    for(let i = 0; i < collaborators.length; i++){
      if(!validator({value: collaborators[i]})) return;
    }

    const result = await create({
      title,
      description,
      objectives,
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
    if(!(validator({value: title}) && validator({value: description}) && validator({value: objectives}))) return;

    for(let i = 0; i < collaborators.length; i++){
      if(!validator({value: collaborators[i]})) return;
    }

    const result = await update({
      systematicStudyId: id,
      title,
      description,
      objectives,
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
