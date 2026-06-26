import React, { useState } from 'react';

/**
 * Login form component with simple validation.
 * @returns {JSX.Element}
 */
const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = e => {
    e.preventDefault();
    if (!form.email.trim() || !form.password) {
      setError('Please fill out all fields.');
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(form.email)) {
      setError('Invalid email format.');
      return;
    }
    if (form.password.length < 3) {
      setError('Password must be at least 3 characters.');
      return;
    }
    // Actual login logic would go here
    alert('Login successful!');
    setForm({ email: '', password: '' });
  };

  return (
    <div>
      <h1>Login</h1>
      <form onSubmit={handleSubmit} aria-label="Login form">
        <label htmlFor="email">Email:</label>
        <input
          type="email"
          id="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          required
          autoComplete="username"
        />
        <br />
        <label htmlFor="password">Password:</label>
        <input
          type="password"
          id="password"
          name="password"
          value={form.password}
          onChange={handleChange}
          required
          autoComplete="current-password"
        />
        <br />
        <button type="submit">Login</button>
      </form>
      {error && <div style={{ color: 'red', marginTop: 10 }} role="alert">{error}</div>}
    </div>
  );
};

export default Login;
