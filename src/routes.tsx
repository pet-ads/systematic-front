// External library
import { RouteObject, useRoutes } from "react-router-dom";

// Guard Component
import ProtectedRoute from "@features/auth/guards/ProtectedRoute";

// Pages Components

// Home
import Homepage from "@features/landing/pages/Homepage";
import CollaboratorsPage from "@features/landing/pages/Collaborators";

// User
import MyReviews from "@features/user/my-reviews/pages/MyReviews";
import Profile from "@features/user/profile/pages/Profile";

// Planning
import GeneralDefinition from "@features/review/planning-protocol/pages/GeneralDefinition";
import ResearchQuestions from "@features/review/planning-protocol/pages/ResearchQuestions";
import Picoc from "@features/review/planning-protocol/pages/Picoc";
import EligibilityCriteria from "@features/review/planning-protocol/pages/EligibilityCriteria";
import InformationSourcesAndSearchStrategy from "@features/review/planning-protocol/pages/InformationSourcesAndSearchStrategy";
import SelectionAndExtraction from "@features/review/planning-protocol/pages/SelectionAndExtraction";
import RiskOfBiasAssessment from "@features/review/planning-protocol/pages/RiskOfBiasAssessment ";
import AnalysisAndSynthesisOfResults from "@features/review/planning-protocol/pages/AnalysisAndSynthesisOfResults";

// Protocol
import Protocol from "@features/review/planning-protocol/pages/StepOne";
import ProtocolPartThree from "@features/review/planning-protocol/pages/StepThree";
import ProtocolPartTwo from "@features/review/planning-protocol/pages/StepTwo";

// Execution
import Identification from "@features/review/execution-identification/pages/Identification";
import IdentificationSession from "@features/review/execution-identification/pages/IdentificationSession";
import Selection from "@features/review/execution-selection/pages/Selection";
import Extraction from "@features/review/execution-extraction/pages/Extraction";

// Summarization
import Graphics from "@features/review/summarization-graphics/pages/Graphics";
import Visualization from "@features/review/summarization-visualization/pages/visualization";
import Finalization from "@features/review/summarization-finalization/pages/Finalization";

// Error Information
import Unauthorized from "@features/application/pages/UnauthorizedPage";
import ServerError from "@features/application/pages/ServerErrorPage";

const routesList: RouteObject[] = [
  {
    path: "/",
    element: <Homepage />,
  },
  {
    path: "/my-reviews",
    element: <ProtectedRoute element={<MyReviews />} />,
  },
  {
    path: "/profile",
    element: <ProtectedRoute element={<Profile />} />,
  },
  {
    path: "/collaborators",
    element: <ProtectedRoute element={<CollaboratorsPage />} />,
  },
  {
    path: "/unauthorized",
    element: <Unauthorized />,
  },
  {
    path: "/server-error",
    element: <ServerError />,
  },
  {
    path: "/review/planning/protocol/general-definition",
    element: <ProtectedRoute element={<GeneralDefinition />} />,
  },
  {
    path: "/review/planning/protocol/research-questions/:id",
    element: <ProtectedRoute element={<ResearchQuestions />} />,
  },
  {
    path: "/review/planning/protocol/picoc/:id",
    element: <ProtectedRoute element={<Picoc />} />,
  },
  {
    path: "/review/planning/protocol/eligibility-criteria/:id",
    element: <ProtectedRoute element={<EligibilityCriteria />} />,
  },
  {
    path: "/review/planning/protocol/information-sources-and-search-strategy/:id",
    element: (
      <ProtectedRoute element={<InformationSourcesAndSearchStrategy />} />
    ),
  },
  {
    path: "/review/planning/protocol/selection-and-extraction/:id",
    element: <ProtectedRoute element={<SelectionAndExtraction />} />,
  },
  {
    path: "/review/planning/protocol/risk-of-bias-assessment/:id",
    element: <ProtectedRoute element={<RiskOfBiasAssessment />} />,
  },
  {
    path: "/review/planning/protocol/analysis-and-synthesis-of-results/:id",
    element: <ProtectedRoute element={<AnalysisAndSynthesisOfResults />} />,
  },
  {
    path: "/review/planning/protocol-part-I/:id",
    element: <Protocol />,
  },
  {
    path: "/review/planning/protocol-part-II/:id",
    element: <ProtectedRoute element={<ProtocolPartTwo />} />,
  },
  {
    path: "/review/planning/protocol-part-III/:id",
    element: <ProtectedRoute element={<ProtocolPartThree />} />,
  },
  {
    path: "/review/execution/identification",
    element: <ProtectedRoute element={<Identification />} />,
  },
  {
    path: "/review/execution/identification/:session",
    element: <ProtectedRoute element={<IdentificationSession />} />,
  },
  {
    path: "/review/execution/selection",
    element: <ProtectedRoute element={<Selection />} />,
  },
  {
    path: "/review/execution/extraction",
    element: <ProtectedRoute element={<Extraction />} />,
  },
  {
    path: "/review/summarization/graphics",
    element: <ProtectedRoute element={<Graphics />} />,
  },
  {
    path: "/review/summarization/finalization",
    element: <ProtectedRoute element={<Finalization />} />,
  },
  {
    path: "/review/summarization/visualization",
    element: <ProtectedRoute element={<Visualization />} />,
  },
];

export default function AppRoutes() {
  const elementRoutes = useRoutes(routesList);
  return elementRoutes;
}
