// External library
import React from "react";
import { Navigate } from "react-router-dom";

// Hooks
import useCanSeeAgreement from "@features/review/shared/hooks/useCanSeeAgreement";

// Page Component
import LoadingPage from "@features/application/pages/LoadingPage";

// Types
interface AgreementRouteProps {
  stage: "selection" | "extraction";
  element: React.ReactElement;
}

export default function AgreementRoute({ stage, element }: AgreementRouteProps) {
  const canSee = useCanSeeAgreement();

  if (canSee.isLoading) return <LoadingPage />;

  if (!canSee[stage]) return <Navigate to="/unauthorized" replace />;

  return element;
}