// External library
import { Flex, Text, Input, Textarea, Select, FormLabel } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";

// Components
import ArticleHeader from "../../../table/header/ArticleHeader";

// Types
import type { ArticlePreviewProps, EditData } from "../StudyData";

const STUDY_TYPES = [
  "ARTICLE", "BOOK", "BOOKLET", "COMMENT",
  "INBOOK", "INCOLLECTION", "INPROCEEDINGS",
  "MANUAL", "MASTERSTHESIS", "MISC",
  "PHDTHESIS", "PROCEEDINGS", "TECHREPORT",
  "UNPUBLISHED", "UNKNOWN",
];

const CURRENT_YEAR = new Date().getFullYear();
const YEARS = Array.from(
  { length: CURRENT_YEAR - 1970 + 1 },
  (_, i) => String(CURRENT_YEAR - i)
);

export default function ArticlePreview({
  studyData,
  mode,
  isEditing,
  editData,
  setEditData,
}: ArticlePreviewProps) {
  const { abstract, studyType, year, venue, title, authors, keywords } = studyData;
  const { t } = useTranslation("review/execution-selection");

  function update(field: keyof EditData, value: string) {
    if (editData && setEditData) {
      setEditData({ ...editData, [field]: value });
    }
  }

  const fieldStyle = {
    bg: "gray.50",
    border: "1px solid",
    borderColor: "gray.300",
    borderRadius: "md",
    fontSize: "sm",
    color: "#2E4B6C",
    _focus: { borderColor: "#2E4B6C", boxShadow: "0 0 0 1px #2E4B6C" },
  };

  const labelStyle = {
    fontSize: "xs" as const,
    fontWeight: "bold",
    color: "gray.600",
    mb: 1,
  };

  return (
    <Flex
      w="100%"
      flexDirection="column"
      padding="1rem"
      paddingTop="0rem"
      fontFamily="Times New Roman, serif"
      h="fit-content"
    >
      <Flex
        display="flex"
        lineHeight="1"
        gap="2rem"
        flexDirection="column"
        w="100%"
        p=".25rem"
        h="100%"
      >
        <ArticleHeader studyData={studyData} mode={mode} />
        {!isEditing && (
          <>
            <Flex>
              <Text marginBottom=".45rem" w="30%" align="left">
                <Text fontSize="clamp(.75rem, 1vw, .85rem)" fontWeight="bold">
                  Type: {studyType}
                </Text>
              </Text>
              <Text fontSize="clamp(0.85rem, 1.2vw, 1rem)" align="right" as="i" fontWeight="Bold" w="70%">
                {venue}, {year}
              </Text>
            </Flex>
            <Text
              fontSize="clamp(1.15rem, 2vw, 1.25rem)"
              fontWeight="bold"
              fontFamily="Boboni"
              lineHeight="1.4rem"
              align="center"
              whiteSpace="normal"
              wordBreak="break-word"
              overflowWrap="break-word"
              maxWidth="100%"
            >
              {title}
            </Text>
            <Text p="0.25rem" lineHeight="1.5rem" fontWeight="Bold" align="center">
              {authors}
            </Text>
            <Flex fontFamily="Literata" flexDirection="column" gap="1rem" pb="3.75rem">
              {abstract && (
                <Text fontSize="clamp(.7rem, 1vw, .85rem)" lineHeight="1.5rem" textAlign="justify">
                  <b>Abstract:</b> {abstract}
                </Text>
              )}
              {keywords && keywords.length > 0 && (
                <Text fontSize="clamp(.7rem, 1vw, .85rem)" lineHeight="1.5rem" textAlign="justify">
                  <b>Keywords:</b> {keywords}
                </Text>
              )}
            </Flex>
          </>
        )}

        {isEditing && editData && (
          <Flex flexDirection="column" gap="0.75rem" pb="3.75rem" fontFamily="inherit">
            <Flex flexDirection="column">
              <FormLabel {...labelStyle}>{t("editStudy.fields.type")}</FormLabel>
              <Select {...fieldStyle} value={editData.type} onChange={(e) => update("type", e.target.value)}>
                {STUDY_TYPES.map((st) => (
                  <option key={st} value={st}>
                    {st.charAt(0) + st.slice(1).toLowerCase()}
                  </option>
                ))}
              </Select>
            </Flex>

            <Flex flexDirection="column">
              <FormLabel {...labelStyle}>{t("editStudy.fields.title")}</FormLabel>
              <Textarea
                {...fieldStyle}
                value={editData.title}
                onChange={(e) => update("title", e.target.value)}
                resize="vertical"
                minH="6rem"
              />
            </Flex>

            <Flex flexDirection="column">
              <FormLabel {...labelStyle}>{t("editStudy.fields.authors")}</FormLabel>
              <Input {...fieldStyle} value={editData.authors} onChange={(e) => update("authors", e.target.value)} />
            </Flex>

            <Flex flexDirection="column">
              <FormLabel {...labelStyle}>{t("editStudy.fields.venue")}</FormLabel>
              <Input {...fieldStyle} value={editData.venue} onChange={(e) => update("venue", e.target.value)} />
            </Flex>

            <Flex flexDirection="column">
              <FormLabel {...labelStyle}>{t("editStudy.fields.year")}</FormLabel>
              <Select {...fieldStyle} value={editData.year} onChange={(e) => update("year", e.target.value)}>
                {YEARS.map((y) => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </Select>
            </Flex>

            <Flex flexDirection="column">
              <FormLabel {...labelStyle}>{t("editStudy.fields.abstract")}</FormLabel>
              <Textarea
                {...fieldStyle}
                value={editData.abstract}
                onChange={(e) => update("abstract", e.target.value)}
                resize="vertical"
                minH="6rem"
              />
            </Flex>

            <Flex flexDirection="column">
              <FormLabel {...labelStyle}>{t("editStudy.fields.keywords")}</FormLabel>
              <Input
                {...fieldStyle}
                value={editData.keywords}
                onChange={(e) => update("keywords", e.target.value)}
                placeholder={t("editStudy.fields.keywordsPlaceholder")}
              />
            </Flex>

          </Flex>
        )}
      </Flex>
    </Flex>
  );
}
