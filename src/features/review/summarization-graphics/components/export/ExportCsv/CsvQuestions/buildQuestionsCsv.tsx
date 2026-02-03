import ArticleInterface from "@features/review/shared/types/ArticleInterface";

type CsvRow = Record<string, string | number>;

type ExtractionAnswer = {
  question: {
    questionId: string;
    code: string;
    description: string;
    questionType: string;
  };
  answer: Record<string, number[]>;
};

function csvEscape(value: string | number) {
  const str = String(value);
  if (str.includes(",") || str.includes("\n") || str.includes('"')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}


export function buildQuestionsCsv(
  extractionAnswers: ExtractionAnswer[],
  filteredStudies: ArticleInterface[],
  selectedQuestionId?: string
): CsvRow[] {
  const filteredStudyIds = new Set(
    filteredStudies.map((s) => Number(s.studyReviewId))
  );

  const answers = selectedQuestionId
    ? extractionAnswers.filter(
        (q) => q.question.questionId === selectedQuestionId
      )
    : extractionAnswers.length
      ? [extractionAnswers[0]]
      : [];

  if (answers.length === 0) return [];

  const rows: CsvRow[] = [];

  answers.forEach((q) => {
    const { question, answer } = q;

    // total de respostas - percentual
    const totalResponses = Object.values(answer ?? {}).reduce(
      (sum, ids) =>
        sum +
        (Array.isArray(ids)
          ? ids.filter((id) => filteredStudyIds.has(Number(id))).length
          : 0),
      0
    );

    Object.entries(answer ?? {}).forEach(([label, ids]) => {
      const validIds = (Array.isArray(ids) ? ids : [])
        .map(Number)
        .filter((id) => filteredStudyIds.has(id));

      if (validIds.length === 0) return;

      rows.push({
        questionCode: question.code,
        question: csvEscape(question.description),
        option: csvEscape(label),
        studies: csvEscape(validIds.join(", ")), 
        count: validIds.length,
        percentage: `${((validIds.length / totalResponses) * 100).toFixed(2)}%`,
      });
    });
  });

  return rows;
}
