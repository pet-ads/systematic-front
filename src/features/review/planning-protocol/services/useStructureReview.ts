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
    defaultGeneralDefinition,
  );
  const id = localStorage.getItem("systematicReviewId") || "";
  const [isLoading, setIsLoading] = useState(!!id);

  const [isReturn, setIsReturn] = useState(false);
  const [isTitleValid, setIsTitleValid] = useState(true);
  const [isDescriptionValid, setIsDescriptionValid] = useState(true);
  const [isObjectivesValid, setIsObjectivesValid] = useState(true);

  const { title, collaborators, description, objectives } = generalDefinition;

  const { create } = useCreateReview();
  const { update } = useUpdateReview();
  const { toGo } = useNavigation();
  const toast = useToaster();
  const validator = useValidatorSQLInjection();

  const handleChangeGeneralDefinition = (
    key: keyof typeof generalDefinition,
    value: string,
  ) => {
    if (key === "title") setIsTitleValid(true);
    if (key === "description") setIsDescriptionValid(true);
    if (key === "objectives") setIsObjectivesValid(true);

    setGeneralDefinition((prev) => ({
      ...prev,
      [key]: key != "collaborators" ? value : value.split(","),
    }));
  };

  const hasValidInputs = () => {
    const titleOk = title.trim() !== "";
    const descriptionOk = description.trim() !== "";
    const objectivesOk = objectives.trim() !== "";

    setIsTitleValid(titleOk);
    setIsDescriptionValid(descriptionOk);
    setIsObjectivesValid(objectivesOk);

    return titleOk && descriptionOk && objectivesOk;
  };

  const navigateToNextSection = (id: string) => {
    toGo(`/review/planning/protocol/picoc/${id}`);
  };

  useEffect(() => {
    async function fetch() {
      if (id) {
        setIsReturn(true);
        try {
          const reviewData = await fetchSystematicStudyInformation(id);
          const { title, description, objectives } = reviewData;

          setGeneralDefinition((prev) => ({
            ...prev,
            title,
            description,
            objectives,
          }));
        } catch (error) {
          console.error("Failed to fetch review data", error);
        } finally {
          setIsLoading(false);
        }
      } else {
        setIsLoading(false);
      }
    }

    fetch();
  }, [id]);

  const handlePost = async () => {
    if (!hasValidInputs()) return;
    if (
      !(
        validator({ value: title }) &&
        validator({ value: description }) &&
        validator({ value: objectives })
      )
    )
      return;

    for (let i = 0; i < collaborators.length; i++) {
      if (!validator({ value: collaborators[i] })) return;
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
    if (!hasValidInputs()) return;
    if (
      !(
        validator({ value: title }) &&
        validator({ value: description }) &&
        validator({ value: objectives })
      )
    )
      return;

    for (let i = 0; i < collaborators.length; i++) {
      if (!validator({ value: collaborators[i] })) return;
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
    isLoading,
    handleChangeGeneralDefinition,
    isReturn,
    isTitleValid,
    isDescriptionValid,
    isObjectivesValid,
    setIsTitleValid,
    handlePost,
    handlePut,
  };
}
