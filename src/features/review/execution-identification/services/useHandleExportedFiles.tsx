// import { SetStateAction, useEffect, useState } from "react";
import { SetStateAction, useState } from "react";
import axios from "../../../../infrastructure/http/axiosClient";
// import useGetSession from "./useGetSession";
import useToaster from "@components/feedback/Toaster";
import { InvalidEntry } from "@features/review/shared/context/StudiesSelectionContext";
import getRequestOptions from "@features/auth/utils/getRequestOptions";
import { KeyedMutator } from "swr";

interface Props {
  mutate: KeyedMutator<
    {
      id: string;
      systematicStudyd: string;
      userId: string;
      searchString: string;
      additionalInfo: string;
      timestamp: string;
      source: string;
      numberOfRelatedStudies: number;
    }[]
  >;
  setInvalidEntries?: React.Dispatch<SetStateAction<InvalidEntry[]>>;
}

const useHandleExportedFiles = ({ mutate, setInvalidEntries }: Props) => {
  const [referenceFiles, setReferenceFiles] = useState<File[]>([]);
  const [source, setSource] = useState("");
  const toast = useToaster();

  const options = getRequestOptions();
  const id = localStorage.getItem("systematicReviewId");
  const url = `http://localhost:8080/api/v1/systematic-study/${id}/search-session`;

  const checkForDuplicateFile = (newFile: File) => {
    return referenceFiles.some(
      (file) => file.name === newFile.name && file.size === newFile.size
    );
  };

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement> | any) => {
    let files: FileList | null = null;

    if (e.target && e.target.files) {
      files = e.target.files;
    } else if (e.acceptedFiles) {
      files = e.acceptedFiles;
    }

    if (files && files.length > 0) {
      const newFile = files[0];

      const isDuplicate = checkForDuplicateFile(newFile);

      if (isDuplicate) {
        toast({
          title: "Duplicate file",
          description: "This file already exists!",
          status: "warning",
        });
      } else {
        setReferenceFiles((prevFiles) => [...prevFiles, newFile]);
      }
    }
  };

  const getFileExtension = (file: File) => {
    return file.name.split(".").pop()?.toLowerCase() || "";
  };

  const addInvalidEntries = (
    sessionId: string,
    formData: FormData,
    invalidArticles: string[],
    setInvalidEntries?: React.Dispatch<SetStateAction<InvalidEntry[]>>
  ) => {
    if (!setInvalidEntries) return;
    const file = formData.get("file");
    const fileName =
      file && file instanceof File
        ? file.name
        : `Arquivo-${crypto.randomUUID()}`;
    const fileExtension =
      file && file instanceof File ? getFileExtension(file) : "";

    setInvalidEntries((prev) => [
      ...prev,
      {
        id: sessionId,
        fileName,
        fileExtension,
        entries: invalidArticles,
      },
    ]);
  };

  async function sendFilesToServer() {
    const formData = new FormData();
    const data = JSON.stringify({
      source: source,
      searchString: "Machine Learning",
      additionalInfo: "Referências para revisão",
    });

    if (referenceFiles.length > 0) {
      formData.append("file", referenceFiles[referenceFiles.length - 1]);
      formData.append("data", data);
    }

    try {
      const response = await axios.post(url, formData, options);
      const sessionId = response.data.sessionId;
      const invalidArticles: string[] = response.data.invalidEntries ?? [];
      mutate();
      if (invalidArticles.length > 0 && setInvalidEntries) {
        addInvalidEntries(
          sessionId,
          formData,
          invalidArticles,
          setInvalidEntries
        );

        toast({
          title: "Some files need revision",
          description: `${invalidArticles.length} file(s) could not be processed.`,
          status: "warning"
        });
      }
    } catch (err) {
      console.log(err);
    }
  }

  return {
    handleFile,
    referenceFiles,
    setReferenceFiles,
    sendFilesToServer,
    setSource,
  };
};

export default useHandleExportedFiles;
