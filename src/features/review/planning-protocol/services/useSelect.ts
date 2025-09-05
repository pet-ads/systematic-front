import { useState, useEffect } from "react";
import useCreateProtocol from "./useCreateProtocol";
import axios from "../../../../infrastructure/http/axiosClient";
import useToaster from "@components/feedback/Toaster";

export function useSelect(initialState: string[] = [], context: string) {
  const { sendSelectData } = useCreateProtocol();
  const toast = useToaster();

  const [selectedValue, setSelectedValue] = useState<string | null>(null);
  const [selectedValues, setSelectedValues] = useState<string[]>(initialState);

  useEffect(() => {
    const id = localStorage.getItem("systematicReviewId");
    const url = `http://localhost:8080/systematic-study/${id}/protocol`;

    async function fetchSelectedValues() {
      const token = localStorage.getItem("accessToken");
      const options = {
        headers: { Authentication: `Bearer ${token}` },
      };
      let response = await axios.get(url, options);

      if (context == "Languages") {
        setSelectedValues(response.data.content.studiesLanguages);
      } else setSelectedValues(response.data.content.informationSources);
    }

    fetchSelectedValues();
  }, [context]);

  const handleSelectChange = (value: string) => {
    setSelectedValue(value);
  };

  const handleSelectAddButtonClick = () => {
    if (selectedValue === null) {
      toast({
        title: "Empty Field",
        description: "The field must be filled!",
        status: "warning"
      });
      return;
    }
    if (selectedValues.includes(`${selectedValue}`)) {
      toast({
        title: "Duplicate option",
        description: "This option already selected!",
        status: "warning"
      });
      setSelectedValue(null);
      return;
    }

    const updatedValues = [...selectedValues, selectedValue];
    setSelectedValues(updatedValues);
    sendSelectData(updatedValues, context);

    setSelectedValue(null);
  };

  const handleAddValue = (newValue: string) => {
    const trimmedValue = newValue.trim();
    if (!trimmedValue) {
      toast({
        title: "Empty Field",
        description: "The field must be filled!",
        status: "warning",
      });
      return;
    }
    if (selectedValues.includes(trimmedValue)) {
      toast({
        title: "Duplicate option",
        description: "This option already exists!",
        status: "warning",
      });
      return;
    }
  }

  const handleDeleteSelect = (index: number) => {
    setSelectedValues((prevSelectedValues) => {
      const updatedSelectedValues = [...prevSelectedValues];
      updatedSelectedValues.splice(index, 1);

      sendSelectData(updatedSelectedValues, context);

      return updatedSelectedValues;
    });
  };

  return {
    selectedValue,
    selectedValues,
    handleSelectChange,
    handleSelectAddButtonClick,
    handleDeleteSelect,
    handleAddValue,
  };
}
