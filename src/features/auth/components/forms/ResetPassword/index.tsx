// External library
import { useState } from "react";
import { useSearchParams } from "react-router-dom";

// Styles
import "../styles.css";

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const passwordsMatch =
    newPassword.length > 0 &&
    confirmPassword.length > 0 &&
    newPassword === confirmPassword;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!passwordsMatch) {
      setError("Passwords must match");
      return;
    }

    setError("");
    setSuccess("");
    setIsLoading(true);

    try {
      // chamar service do reset aqui
      console.log({ token, newPassword });

      setSuccess("Password updated successfully!");
      setNewPassword("");
      setConfirmPassword("");
    } catch {
      setError("Failed to update password");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Reset Password</h2>

      <div className="contentForm">
        <div className="inputGroup">
          <label htmlFor="new-password">New Password</label>
          <input
            type="password"
            id="new-password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </div>

        <div className="inputGroup">
          <label htmlFor="confirm-password">Confirm Password</label>
          <input
            type="password"
            id="confirm-password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>

        {error && <p className="error">{error}</p>}
        {success && <p style={{ color: "green" }}>{success}</p>}

        <div className="actions">
          <div />
          <button type="submit" disabled={isLoading}>
            {!isLoading ? "Save Password" : "Saving..."}
          </button>
        </div>
      </div>
    </form>
  );
}