// External library
import { Link } from "react-router-dom";

// Hooks
import useHandleLogin from "../../../hooks/useHandleLogin";

// Styles
import "../styles.css";

export default function FormLogin({
  redirectForgotPassword,
}: {
  redirectForgotPassword: () => void;
}) {
  const {
    credentials,
    errors,
    handleChangeCredentials,
    handleSubmit,
    isSubmitting,
  } = useHandleLogin();

  return (
    <form onSubmit={handleSubmit}>
      <h2>Log In</h2>
      <div className="contentForm">
        <div className="inputGroup">
          <label htmlFor="email">Username</label>
          <input
            type="text"
            id="username"
            value={credentials.username}
            onChange={(e) => {
              handleChangeCredentials("username", e.target.value);
            }}
            className={errors.username ? "inputError" : ""}
          />
          {errors.username && <p className="error">{errors.username}</p>}
        </div>
        <div className="inputGroup">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={credentials.password}
            onChange={(e) => {
              handleChangeCredentials("password", e.target.value);
            }}
            className={errors.password ? "inputError" : ""}
          />
          {errors.password && <p className="error">{errors.password}</p>}
        </div>
        {errors && <p className="error">{errors.general}</p>}
        <div className="actions">
          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Is submitting..." : "Log in"}
          </button>
          <Link to="#" onClick={redirectForgotPassword}>
            Forgot Password?
          </Link>
        </div>
      </div>
    </form>
  );
}
