import { useTranslation } from "react-i18next";
import "../styles.css";
import useHandleLogin from "../../../hooks/useHandleLogin";
import { Link } from "react-router-dom";

export default function FormLogin({
  redirectForgotPassword,
}: {
  redirectForgotPassword: () => void;
}) {
  const { t } = useTranslation("landing/homepage");
  const {
    credentials,
    errors,
    handleChangeCredentials,
    handleSubmit,
    isSubmitting,
  } = useHandleLogin();

  return (
    <form onSubmit={handleSubmit}>
      <h2>{t("login.title")}</h2>
      <div className="contentForm">
        {/* Usuário */}
        <div className="inputGroup">
          <label htmlFor="username">{t("login.username")}</label>
          <input
            type="text"
            id="username"
            placeholder={t("login.placeholders.username")}
            value={credentials.username}
            onChange={(e) => handleChangeCredentials("username", e.target.value)}
            className={errors.username ? "inputError" : ""}
          />
          {errors.username && <p className="error">{errors.username}</p>}
        </div>

        {/* Senha */}
        <div className="inputGroup">
          <label htmlFor="password">{t("login.password")}</label>
          <input
            type="password"
            id="password"
            placeholder={t("login.placeholders.password")}
            value={credentials.password}
            onChange={(e) => handleChangeCredentials("password", e.target.value)}
            className={errors.password ? "inputError" : ""}
          />
          {errors.password && <p className="error">{errors.password}</p>}
        </div>

        {errors && <p className="error">{errors.general}</p>}

        {/* Ações */}
        <div className="actions">
          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? t("login.submitting") : t("login.submit")}
          </button>
          <Link to="#" onClick={redirectForgotPassword}>
            {t("login.forgotPassword")}
          </Link>
        </div>
      </div>
    </form>
  );
}