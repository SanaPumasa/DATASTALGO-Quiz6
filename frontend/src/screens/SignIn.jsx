import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { loginUser } from '../redux/actions/authActions';
import '../styles/Auth.css';

function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    console.log('Sign in form submitted with email:', email);

    if (!email || !password) {
      setError('Please fill in all fields');
      setIsLoading(false);
      return;
    }

    try {
      console.log('Dispatching loginUser action...');
      const result = await dispatch(loginUser(email, password));
      console.log('Login successful, response:', result);
      console.log('localStorage access_token:', localStorage.getItem('access_token'));
      console.log('localStorage user:', localStorage.getItem('user'));
      navigate('/');
    } catch (err) {
      console.error('Login error caught:', err);
      const errorData = err.response?.data;
      let errorMessage = 'Login failed. Please try again.';
      
      if (errorData?.non_field_errors) {
        errorMessage = Array.isArray(errorData.non_field_errors) 
          ? errorData.non_field_errors[0] 
          : errorData.non_field_errors;
      } else if (errorData?.detail) {
        errorMessage = errorData.detail;
      }
      
      console.log('Final error message:', errorMessage);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1>Sign In</h1>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
            />
          </div>
          <button type="submit" disabled={isLoading} className="btn-submit">
            {isLoading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
        <p>Don't have an account? <Link to="/signup">Sign Up</Link></p>
      </div>
    </div>
  );
}

export default SignIn;
