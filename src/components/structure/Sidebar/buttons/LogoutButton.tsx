// External library
import { ImExit } from "react-icons/im";

// Hooks
import { useAuthStore } from "@features/auth/store/useAuthStore";
import { useNavigation } from "@features/shared/hooks/useNavigation";

// Styles
import style from "./LogouButton.module.css";

const LogoutButton = () => {
  const { logout } = useAuthStore();
  const { toGo } = useNavigation();

  const handleLogout = async () => {
    await logout();
    toGo("/");
  };

  return (
    <div
      className={style.linkBox}
      onClick={handleLogout}
      style={{
        display: "flex",
        alignItems: "center",
        width: "100%",           
        padding: "10px 16px",    
        boxSizing: "border-box",
        cursor: "pointer",       
        color: "#4A4A4A"         
      }}
    >
      <ImExit size={20} style={{ marginRight: "12px", color: "inherit" }} />
      
      <span className={style.link} style={{ fontWeight: "500", fontSize: "16px" }}>
        Logout
      </span>
    </div>
  );
};

export default LogoutButton;