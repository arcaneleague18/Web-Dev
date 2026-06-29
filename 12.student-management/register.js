import React, { useState } from 'react';

/**
 * Registration form component with basic validation.
 * @returns {JSX.Element}
 */
const Register = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');

  /**
   * Handles input change and resets error state.
   * @param {React.ChangeEvent<HTMLInputElement>} e
   */
  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  /**
   * Handles form submission and validates inputs.
   * @param {React.FormEvent<HTMLFormElement>} e
   */
  const handleSubmit = e => {
    e.preventDefault();
    // Simple validation
    if (!form.name.trim() || !form.email.trim() || !form.password) {
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
    // Submit logic would go here
    alert('Registered successfully!');
    setForm({ name: '', email: '', password: '' });
  };

  return (
    <div>
      <h1>Register</h1>
      <form onSubmit={handleSubmit} aria-label="Registration form">
        <label htmlFor="name">Name:</label>
        <input
          type="text"
          id="name"
          name="name"
          value={form.name}
          onChange={handleChange}
          required
          autoComplete="name"
        />
        <br />
        <label htmlFor="email">Email:</label>
        <input
          type="email"
          id="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          required
          autoComplete="email"
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
          autoComplete="new-password"
        />
        <br />
        <button type="submit">Submit</button>
      </form>
      {error && <div style={{ color: 'red', marginTop: 10 }} role="alert">{error}</div>}
    </div>
  );
};

export default Register;
