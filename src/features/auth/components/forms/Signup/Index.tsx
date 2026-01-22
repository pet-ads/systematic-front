import { Link } from "react-router-dom";
import "../styles.css";
import useHandleSignup from "../../../hooks/useHandleRegister";

const Countries = ["Argentina", "Australia", "Austria", "Belgium", "Brazil", "Canada", "Chile", "China",
  "Denmark", "Egypt", "Finland", "France", "Germany", "Greece", "India", "Iran", "Ireland", "Israel",
  "Italy", "Japan", "Mexico", "Netherlands", "New Zealand", "Norway", "Pakistan", "Portugal",
  "Saudi Arabia", "South Africa", "South Korea", "Spain", "Sweden", "Switzerland", "Turkey",
  "United Kingdom", "United States", "Colombia"].sort();

export default function FormSignup({
  redirectFormLogin,
}: {
  redirectFormLogin: () => void;
  closeModal: () => void;
}) {
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
      <h2>Sign Up</h2>
      <div className="contentForm">
        <div className="inputGroup">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) =>
              handleChangeUserInformations("username", e.target.value)
            }
            className={errors.username ? "inputError" : ""}
          />
          {errors.username && <p className="error">{errors.username}</p>}
        </div>

        <div className="inputGroup">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) =>
              handleChangeUserInformations("name", e.target.value)
            }
            className={errors.name ? "inputError" : ""}
          />
          {errors.name && <p className="error">{errors.name}</p>}
        </div>

        <div className="inputGroup">
          <label htmlFor="email">Email</label>
          <input
            type="text"
            id="email"
            value={email}
            onChange={(e) =>
              handleChangeUserInformations("email", e.target.value)
            }
            className={errors.email ? "inputError" : ""}
          />
          {errors.email && <p className="error">{errors.email}</p>}
        </div>

        <div className="inputGroup">
          <label htmlFor="affiliation">Affiliation</label>
          <input
            type="text"
            id="affiliation"
            value={affiliation}
            onChange={(e) =>
              handleChangeUserInformations("affiliation", e.target.value)
            }
            className={errors.affiliation ? "inputError" : ""}
          />
          {errors.affiliation && <p className="error">{errors.affiliation}</p>}
        </div>

        <div className="inputGroup">
          <label htmlFor="country">Country</label>
          <select
            id="country"
            value={country}
            onChange={(e) =>
              handleChangeUserInformations("country", e.target.value)
            }
            className={errors.country ? "inputError" : ""}
          >
            <option value="">Select Country</option>
            {Countries.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
            <option value="Other">Other...</option>
          </select>
          {errors.country && <p className="error">{errors.country}</p>}
        </div>

        <div className="inputGroup">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) =>
              handleChangeUserInformations("password", e.target.value)
            }
            className={errors.password ? "inputError" : ""}
          />
          {errors.password && <p className="error">{errors.password}</p>}
        </div>

        <div className="inputGroup">
          <label htmlFor="confirmPassword">Confirm password</label>
          <input
            type="password"
            id="confirmPassword"
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

        <div className="actions">
          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Create Account"}
          </button>
          <Link to="#" onClick={redirectFormLogin}>
            Already have an account?
          </Link>
        </div>
      </div>
    </form>
  );
}
