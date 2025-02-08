interface ArticleInterface {
    studyReviewId: number //front id
    systematicStudyId: string //backend systematicStudyId;
    title: string, 
    authors: string, 
    venue: string,
    year: string,
    selection: string,
    criterion: {description: String, type: String}[];
    extraction: string,
    readingPriority: string;
    selectionStatus: string;
    extractionStatus: string;
}

export default ArticleInterface;