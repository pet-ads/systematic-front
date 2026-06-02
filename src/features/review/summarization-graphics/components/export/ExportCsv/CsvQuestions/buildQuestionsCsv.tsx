import ArticleInterface from "@features/review/shared/types/ArticleInterface";

type CsvRow = Record<string, string | number>;

type ExtractionAnswer = {
  question: {
    questionId: string;
    code: string;
    description: string;
    questionType: string;
    options?: string[] | null;
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

function parsePickManyLabel(label: string): string[] {
  const trimmed = label.trim();
  if (trimmed.startsWith("[") && trimmed.endsWith("]")) {
    return trimmed
      .slice(1, -1)
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
  }
  return [trimmed];
}

function buildAggregatedCsv(
  q: ExtractionAnswer,
  filteredStudyIds: Set<number>
): CsvRow[] {
  const { question, answer } = q;

  let totalResponses: number;

  if (question.questionType === "PICK_MANY") {
    const counts = new Map<string, Set<number>>();
    Object.entries(answer ?? {}).forEach(([label, ids]) => {
      const validIds = (Array.isArray(ids) ? ids : [])
        .map(Number)
        .filter((id) => filteredStudyIds.has(id));
      const options = parsePickManyLabel(label);
      options.forEach((opt) => {
        if (!counts.has(opt)) counts.set(opt, new Set());
        validIds.forEach((id) => counts.get(opt)!.add(id));
      });
    });

    totalResponses = [...counts.values()].reduce(
      (sum, set) => sum + set.size,
      0
    );

    return [...counts.entries()]
      .filter(([, ids]) => ids.size > 0)
      .map(([option, ids]) => ({
        questionCode: question.code,
        question: csvEscape(question.description),
        option: csvEscape(option),
        studies: csvEscape([...ids].join(", ")),
        count: ids.size,
        percentage: `${((ids.size / totalResponses) * 100).toFixed(2)}%`,
      }));
  }

  totalResponses = Object.values(answer ?? {}).reduce(
    (sum, ids) =>
      sum +
      (Array.isArray(ids)
        ? ids.filter((id) => filteredStudyIds.has(Number(id))).length
        : 0),
    0
  );

  const rows: CsvRow[] = [];

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

  return rows;
}

function buildPickManyItemCsv(
  q: ExtractionAnswer,
  filteredStudyIds: Set<number>
): CsvRow[] {
  const { question, answer } = q;
  const options = question.options ?? [];

  const selectionMap = new Map<number, Set<string>>();

  Object.entries(answer ?? {}).forEach(([label, ids]) => {
    const selected = parsePickManyLabel(label);
    (Array.isArray(ids) ? ids : [])
      .map(Number)
      .filter((id) => filteredStudyIds.has(id))
      .forEach((id) => {
        if (!selectionMap.has(id)) selectionMap.set(id, new Set());
        selected.forEach((opt) => selectionMap.get(id)!.add(opt));
      });
  });

  return [...selectionMap.entries()].map(([studyId, selected]) => {
    const row: CsvRow = {
      questionCode: question.code,
      question: csvEscape(question.description),
      studyId,
    };

    options.forEach((opt) => {
      row[csvEscape(opt)] = selected.has(opt) ? "Yes" : "No";
    });

    return row;
  });
}

export function buildQuestionsCsv(
  extractionAnswers: ExtractionAnswer[],
  filteredStudies: ArticleInterface[],
  selectedQuestionId?: string,
  type?: string
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
    if (q.question.questionType === "PICK_MANY" && type === "Item Table") {
      rows.push(...buildPickManyItemCsv(q, filteredStudyIds));
    } else {
      rows.push(...buildAggregatedCsv(q, filteredStudyIds));
    }
  });

  return rows;
}
