// Type
import type { CardReview } from "@features/user/my-reviews/types";

// Components
import RevisionCard from "@features/user/my-reviews/components/cards/RevisionCard";

interface RenderCardsProps {
  data: CardReview[];
}

const RenderCards = ({ data }: RenderCardsProps) => {
  return (
    <>
      {data.map((item) => (
        <RevisionCard
          key={item.key}
          revisionId={item.id}
          title={item.title}
          status={item.status}
          collaborators={item.collaborators}
        />
      ))}
    </>
  );
};

export default RenderCards;