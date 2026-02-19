import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import apiClient from '../utils/apiClient.js';
import { useAuth } from '../state/AuthContext.jsx';

const RegisterPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const response = await apiClient.post('/auth/register', { email, password });
      login(response.data.user, response.data.token);
      navigate('/');
    } catch (err) {
      const message = err.response?.data?.message || 'Registration failed';
      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h1 className="auth-title">Register</h1>
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
        <label className="field">
          <span>Confirm password</span>
          <input
            type="password"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            required
            minLength={6}
          />
        </label>
        <button type="submit" className="primary-button" disabled={submitting}>
          {submitting ? 'Registering…' : 'Register'}
        </button>
        <p className="auth-footer">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </form>
    </div>
  );
};

export default RegisterPage;

