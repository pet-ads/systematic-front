// External library
import { ImExit } from "react-icons/im";

// Hooks
import { useAuth } from "@features/auth/hooks/useAuth";
import { useNavigation } from "@features/shared/hooks/useNavigation";

// Guards
import { isLeft } from "@features/shared/errors/pattern/Either";

// Styles
import style from "./LogouButton.module.css";

const LogoutButton = () => {
  const result = useAuth();
  const { toGo } = useNavigation();

  if (isLeft(result)) return null;

  const { logout } = result.value;

  const handleLogout = async () => {
    await logout();
    toGo("/");
  };

  return (
    <div
      className={style.linkBox}
      style={{ display: "flex", width: "120px", alignItems: "center" }}
    >
      <ImExit size={20} style={{ marginRight: "1rem", color: "#c9d9e5" }} />
      <button className={style.link} onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
};

export default LogoutButton;
