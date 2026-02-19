import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import apiClient from "../utils/apiClient.js";
import { useAuth } from "../state/AuthContext.jsx";

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();

    setSubmitting(true);
    setError(null);

    try {
      const response = await apiClient.post("/auth/login", { email, password });
      login(response.data.user, response.data.token);
      navigate("/");
    } catch (err) {
      const message = err.response?.data?.message || "Login failed";
      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h1 className="auth-title">Login</h1>
        {error && <p className="auth-error">{error}</p>}
        <label className="field">
          <span>Email</span>
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
        </label>
        <label className="field">
          <span>Password</span>
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
            minLength={6}
          />
        </label>
        <button type="submit" className="primary-button" disabled={submitting}>
          {submitting ? "Logging in…" : "Login"}
        </button>
        <p className="auth-footer">
          No account? <Link to="/register">Register</Link>
        </p>
      </form>
    </div>
  );
};

export default LoginPage;
