export interface CardReview {
  id: string;
  key: string;
  title: string;
  status?: string;
  owner: string;
  collaborators: {
    id: string;
    username: string;
    role: string;
  }[];
  lastChange: string;
  creation: string;
  isEdited: boolean;
}
