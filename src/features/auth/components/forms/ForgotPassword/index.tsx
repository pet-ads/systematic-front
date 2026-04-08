// External library
import { useState } from "react";
import { Link } from "react-router-dom";

// Styles
import "../styles.css";
import forgotPassword from "@features/auth/services/forgotPassword";
import { isLeft } from "@features/shared/errors/pattern/Either";
import useToaster from "@components/feedback/Toaster";

export default function ForgotPassword({
  redirectFormLogin,
}: {
  redirectFormLogin: () => void;
}) {
  const [email, setEmail] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  const Toaster = useToaster();

  const validateEmail = (email: string): boolean => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateEmail(email)) {
      setError("Invalid email");
      return;
    } else {
      setIsLoading(true)
      const result = await forgotPassword({email: email})
      if (isLeft(result)) {
        const errorMessage = result.value.message;
        Toaster({
          title: "Process failed",
          description: errorMessage,
          status: "error",
        });
      }else{
        Toaster({
          title: "Success!",
          description: "If an account with this email exists, you will receive password reset instructions.",
          status: "success",
        });
      }
      setIsLoading(false)
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Forgot Password</h2>
      <div className="contentForm">
        <div className="inputGroup">
          <label htmlFor="forgot-email">Email</label>
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
            Back to Login
          </Link>
          <button type="submit"> {!isLoading ? "Recover Password" : "Sending email"} </button>
        </div>
      </div>
    </form>
  );
}
