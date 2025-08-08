export interface CardReview {
  id: string;
  key: string;
  title: string;
  status?: string;
  collaborators: string[];
  lastChange: string;
  creation: string;
  isEdited: boolean;
}
