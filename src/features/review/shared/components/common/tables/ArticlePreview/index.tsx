// External library
import { Flex, Text, Input, Textarea } from "@chakra-ui/react";

// Components
import ArticleHeader from "../../../table/header/ArticleHeader";

// Types
import type { ArticlePreviewProps, EditData } from "../StudyData";

export default function ArticlePreview({
  studyData,
  mode,
  isEditing,
  editData,
  setEditData,
}: ArticlePreviewProps) {
  const { abstract, studyType, year, venue, title, authors, keywords } = studyData;

  const inputStyle = {
    fontSize: "inherit",
    fontFamily: "inherit",
    bg: "gray.50",
    border: "1px solid",
    borderColor: "gray.300",
    borderRadius: "md",
    px: 2,
    py: 1,
  };

  function update(field: keyof EditData, value: string) {
    if (editData && setEditData) {
      setEditData({ ...editData, [field]: value });
    }
  }

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
        <Flex>
          <Text marginBottom=".45rem" w="30%" align="left">
            <Text fontSize="clamp(.75rem, 1vw, .85rem)" fontWeight="bold">
              Type: {studyType}
            </Text>
          </Text>
          {isEditing && editData ? (
            <Flex gap={2} w="70%" justifyContent="flex-end">
              <Input
                {...inputStyle}
                value={editData.venue}
                onChange={(e) => update("venue", e.target.value)}
                w="60%"
                fontSize="clamp(0.85rem, 1.2vw, 1rem)"
                fontStyle="italic"
                fontWeight="bold"
                textAlign="right"
              />
              <Input
                {...inputStyle}
                value={editData.year}
                onChange={(e) => update("year", e.target.value)}
                w="30%"
                fontSize="clamp(0.85rem, 1.2vw, 1rem)"
                fontStyle="italic"
                fontWeight="bold"
                textAlign="right"
                type="number"
              />
            </Flex>
          ) : (
            <Text
              fontSize="clamp(0.85rem, 1.2vw, 1rem)"
              align="right"
              as="i"
              fontWeight="Bold"
              w="70%"
            >
              {venue}, {year}
            </Text>
          )}
        </Flex>
        {isEditing && editData ? (
          <Textarea
            {...inputStyle}
            value={editData.title}
            onChange={(e) => update("title", e.target.value)}
            fontSize="clamp(1.15rem, 2vw, 1.25rem)"
            fontWeight="bold"
            textAlign="center"
            resize="vertical"
            minH="8rem"
          />
        ) : (
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
        )}
        {isEditing && editData ? (
          <Input
            {...inputStyle}
            value={editData.authors}
            onChange={(e) => update("authors", e.target.value)}
            fontWeight="bold"
            textAlign="center"
          />
        ) : (
          <Text p="0.25rem" lineHeight="1.5rem" fontWeight="Bold" align="center">
            {authors}
          </Text>
        )}
        <Flex fontFamily="Literata" flexDirection="column" align="right" gap="1rem" pb="3.75rem">
          {(abstract || isEditing) && (
            <>
              {isEditing && editData ? (
                <Flex flexDirection="column" gap="0.25rem">
                  <Text fontSize="clamp(.7rem, 1vw, .85rem)" fontWeight="bold">Abstract:</Text>
                  <Textarea
                    {...inputStyle}
                    value={editData.abstract}
                    onChange={(e) => update("abstract", e.target.value)}
                    fontSize="clamp(.7rem, 1vw, .85rem)"
                    lineHeight="1.5rem"
                    resize="vertical"
                    minH="6rem"
                  />
                </Flex>
              ) : (
                <Text fontSize="clamp(.7rem, 1vw, .85rem)" lineHeight="1.5rem" textAlign="justify">
                  <b>Abstract:</b> {abstract}
                </Text>
              )}
            </>
          )}

          {(keywords && keywords.length > 0 || isEditing) && (
            <>
              {isEditing && editData ? (
                <Flex flexDirection="column" gap="0.25rem">
                  <Text fontSize="clamp(.7rem, 1vw, .85rem)" fontWeight="bold">Keywords:</Text>
                  <Input
                    {...inputStyle}
                    value={editData.keywords}
                    onChange={(e) => update("keywords", e.target.value)}
                    fontSize="clamp(.7rem, 1vw, .85rem)"
                    placeholder="keyword1, keyword2, keyword3"
                  />
                </Flex>
              ) : (
                <Text fontSize="clamp(.7rem, 1vw, .85rem)" lineHeight="1.5rem" textAlign="justify">
                  <b>Keywords:</b> {keywords}
                </Text>
              )}
            </>
          )}
        </Flex>
      </Flex>
    </Flex>
  );
}
