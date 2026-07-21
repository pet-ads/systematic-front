// External library
import { useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

// Styles
import "../styles.css";

export default function ForgotPassword({
  redirectFormLogin,
}: {
  redirectFormLogin: () => void;
}) {
  const { t } = useTranslation("landing/homepage");
  const [email, setEmail] = useState<string>("");
  const [error, setError] = useState<string>("");

  const validateEmail = (email: string): boolean => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateEmail(email)) {
      setError(t("forgotPassword.invalidEmail"));
      return;
    } else {
      // lógica de envio do email de recuperação de senha (auth)
      console.log("Enviar email para:", email); //teste
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>{t("forgotPassword.title")}</h2>
      <div className="contentForm">
        <div className="inputGroup">
          <label htmlFor="forgot-email">{t("forgotPassword.email")}</label>
          <input
            type="text"
            id="forgot-email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        {error && <p className="error">{error}</p>}
        <div className="actions">
          <Link to="#" onClick={redirectFormLogin}>
            {t("forgotPassword.backToLogin")}
          </Link>
          <button type="submit">{t("forgotPassword.submit")}</button>
        </div>
      </div>
    </form>
  );
}