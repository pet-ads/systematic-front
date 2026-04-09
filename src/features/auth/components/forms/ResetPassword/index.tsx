// External library
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

// Styles
import "../styles.css";
import resetPassword from "@features/auth/services/resetPassword";
import { isLeft } from "@features/shared/errors/pattern/Either";
import useToaster from "@components/feedback/Toaster";

export default function ResetPassword() {
  const [searchParams] = useSearchParams();

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [isValid, setIsValid] = useState<boolean | null>(null);

  const Toaster = useToaster();
  const navigate = useNavigate();

  const passwordsMatch =
    newPassword.length > 0 &&
    confirmPassword.length > 0 &&
    newPassword === confirmPassword;

    useEffect(() => {
    const tokenParam = searchParams.get("token");

    if (!tokenParam || tokenParam.trim() === "") {
      setIsValid(false);

      setTimeout(() => {
        navigate("/");
      }, 3000);

      return;
    }

    setToken(tokenParam);
    setIsValid(true);
  }, [searchParams, navigate]);

  if (isValid === false) {
    alert("Invalid or missing token")
    return <div>Invalid or missing token</div>;
  }

  if (isValid === null) {
    return <div>Loading...</div>;
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!passwordsMatch) {
      setError("Passwords must match");
      return;
    }

    if(!token){
      setError("Token empty!");
      return
    }

    setError("");
    setSuccess("");
    setIsLoading(true);

    try {
      const result = await resetPassword({token: token, senha: newPassword})
      if (isLeft(result)) {
        const errorMessage = result.value.message;
        Toaster({
          title: "Token invalid!",
          description: errorMessage,
          status: "error",
        });
      }else{
        Toaster({
          title: "Success!",
          description: "Password changed!",
          status: "success",
        });

        setTimeout(() => {
          navigate("/");
        }, 3000);

      }
      setIsLoading(false)
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