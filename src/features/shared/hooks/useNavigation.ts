// External library
import { useNavigate } from "react-router-dom";
import type { NavigateOptions } from "react-router-dom";

// Types
type UseNavigationOutput = {
  toGo: (path: string, options?: NavigateOptions) => void;
  toBack: () => void;
};

export function useNavigation(): UseNavigationOutput {
  const navigate = useNavigate();

  // Functions
  const toGo: UseNavigationOutput["toGo"] = (path, options) =>
    navigate(path, options);

  const toBack: UseNavigationOutput["toBack"] = () => navigate(-1);

  return { toGo, toBack };
}
