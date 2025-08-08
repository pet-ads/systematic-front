// Services
import { useVerifyIfLoggedIn as verifyIfLoggedIn } from "../services/useVerifyIfLoggedIn";

// Hooks
import { useAuth } from "@features/auth/hooks/useAuth";

// Guards
import { isLeft } from "@features/shared/errors/pattern/Either";

export default async function useRecoverUserData(
  setUsername: React.Dispatch<React.SetStateAction<string | null>>
) {
  const result = useAuth();

  if (isLeft(result)) {
    return;
  }

  const verifyIfLoggedInResponse = await verifyIfLoggedIn();

  const { user } = result.value;

  if (!result.value || user == null) return;

  if (verifyIfLoggedInResponse.isLoggedIn) {
    return;
  }

  setUsername(user.sub);
}
