// import { SetStateAction, useEffect, useState } from "react";
import { SetStateAction, useState } from "react";
import Axios from "../../../../infrastructure/http/axiosClient";
// import useGetSession from "./useGetSession";
import useToaster from "@components/feedback/Toaster";
import { KeyedMutator } from "swr";
import { InvalidEntry } from "@features/review/shared/types/StudiesContextInterface";
import { useTranslation } from "react-i18next";

interface Props {
  mutate: KeyedMutator <
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
  searchString: string;
  comment: string;
}

const useHandleExportedFiles = ({
  mutate,
  setInvalidEntries,
  comment = "",
  searchString = "",
}: Props) => {
  const [referenceFiles, setReferenceFiles] = useState<File[]>([]);
  const [source, setSource] = useState("");
  const toast = useToaster();
  const { t } = useTranslation("review/execution-identification");

  const id = localStorage.getItem("systematicReviewId");

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
          title: t("upload.duplicateFile.title"),
          description: t("upload.duplicateFile.description"),
          status: "warning",
        });
      } else {
        setReferenceFiles([newFile]);
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
      searchString,
      additionalInfo: comment,
    });

    if (referenceFiles.length > 0) {
      formData.append("file", referenceFiles[referenceFiles.length - 1]);
      formData.append("data", data);
    }

    try {
      const response = await Axios.post(
        `systematic-study/${id}/search-session`,
        formData
      );
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
          title: t("upload.someFilesNeedRevision.title"),
          description: `${invalidArticles.length} ${t("upload.someFilesNeedRevision.description")}`,
          status: "warning",
        });
      } else {
        toast({
          title: t("upload.success.title"),
          status: "success",
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