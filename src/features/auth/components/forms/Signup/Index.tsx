import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import i18n from "i18next";
import "../styles.css";
import useHandleSignup from "../../../hooks/useHandleRegister";

const CountryCodes = [
  "AR", "AU", "AT", "BE", "BR", "CA", "CL", "CN", "CO",
  "DK", "EG", "FI", "FR", "DE", "GR", "IN", "IR", "IE", "IL",
  "IT", "JP", "MX", "NL", "NZ", "NO", "PK", "PT",
  "SA", "ZA", "KR", "ES", "SE", "CH", "TR",
  "GB", "US"
];

export default function FormSignup({
  redirectFormLogin,
}: {
  redirectFormLogin: () => void;
  closeModal: () => void;
}) {
  const { t } = useTranslation("landing/homepage");
  // instância do tradutor nativo de países baseado no idioma do i18n
  const countryNames = new Intl.DisplayNames([i18n.language || "pt"], { type: "region" });
  const sortedCountries = CountryCodes.map((code) => ({
    code,
    name: countryNames.of(code) || code,
  })).sort((a, b) => a.name.localeCompare(b.name));

  const {
    createUser,
    errors,
    handleChangeUserInformations,
    handleRegister,
    isSubmitting,
  } = useHandleSignup(redirectFormLogin);

  const {
    username,
    name,
    email,
    affiliation,
    country,
    password,
    confirmPassword,
  } = createUser;

  return (
    <form onSubmit={handleRegister}>
      <h2>{t("signUp.title")}</h2>
      <div className="contentForm">
        {/* Username */}
        <div className="inputGroup">
          <label htmlFor="username">{t("signUp.username")}</label>
          <input
            type="text"
            id="username"
            placeholder={t("signUp.placeholders.username")}
            value={username}
            onChange={(e) =>
              handleChangeUserInformations("username", e.target.value)
            }
            className={errors.username ? "inputError" : ""}
          />
          {errors.username && <p className="error">{errors.username}</p>}
        </div>

        {/* Name */}
        <div className="inputGroup">
          <label htmlFor="name">{t("signUp.name")}</label>
          <input
            type="text"
            id="name"
            placeholder={t("signUp.placeholders.name")}
            value={name}
            onChange={(e) =>
              handleChangeUserInformations("name", e.target.value)
            }
            className={errors.name ? "inputError" : ""}
          />
          {errors.name && <p className="error">{errors.name}</p>}
        </div>

        {/* Email */}
        <div className="inputGroup">
          <label htmlFor="email">{t("signUp.email")}</label>
          <input
            type="text"
            id="email"
            placeholder={t("signUp.placeholders.email")}
            value={email}
            onChange={(e) =>
              handleChangeUserInformations("email", e.target.value)
            }
            className={errors.email ? "inputError" : ""}
          />
          {errors.email && <p className="error">{errors.email}</p>}
        </div>

        {/* Affiliation */}
        <div className="inputGroup">
          <label htmlFor="affiliation">{t("signUp.affiliation")}</label>
          <input
            type="text"
            id="affiliation"
            placeholder={t("signUp.placeholders.affiliation")}
            value={affiliation}
            onChange={(e) =>
              handleChangeUserInformations("affiliation", e.target.value)
            }
            className={errors.affiliation ? "inputError" : ""}
          />
          {errors.affiliation && <p className="error">{errors.affiliation}</p>}
        </div>

        {/* Country (Traduzido e Ordenado) */}
        <div className="inputGroup">
          <label htmlFor="country">{t("signUp.country")}</label>
          <select
            id="country"
            value={country}
            onChange={(e) =>
              handleChangeUserInformations("country", e.target.value)
            }
            className={errors.country ? "inputError" : ""}
          >
            <option value="">{t("signUp.selectCountry")}</option>
            {sortedCountries.map((c) => (
              <option key={c.code} value={c.name}>
                {c.name}
              </option>
            ))}
            <option value="Other">{t("signUp.otherCountry")}</option>
          </select>
          {errors.country && <p className="error">{errors.country}</p>}
        </div>

        {/* Password */}
        <div className="inputGroup">
          <label htmlFor="password">{t("signUp.password")}</label>
          <input
            type="password"
            id="password"
            placeholder={t("signUp.placeholders.password")}
            value={password}
            onChange={(e) =>
              handleChangeUserInformations("password", e.target.value)
            }
            className={errors.password ? "inputError" : ""}
          />
          {errors.password && <p className="error">{errors.password}</p>}
        </div>

        {/* Confirm Password */}
        <div className="inputGroup">
          <label htmlFor="confirmPassword">{t("signUp.confirmPassword")}</label>
          <input
            type="password"
            id="confirmPassword"
            placeholder={t("signUp.placeholders.confirmPassword")}
            value={confirmPassword}
            onChange={(e) =>
              handleChangeUserInformations("confirmPassword", e.target.value)
            }
            className={errors.confirmPassword ? "inputError" : ""}
          />
          {errors.confirmPassword && (
            <p className="error">{errors.confirmPassword}</p>
          )}
        </div>

        {/* Actions */}
        <div className="actions">
          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? t("signUp.submitting") : t("signUp.submit")}
          </button>
          <Link to="#" onClick={redirectFormLogin}>
            {t("signUp.alreadyHaveAccount")}
          </Link>
        </div>
      </div>
    </form>
  );
}