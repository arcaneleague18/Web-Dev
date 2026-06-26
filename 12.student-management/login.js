import React, { useState } from 'react';

// Login form with simple validation
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
      <form onSubmit={handleSubmit}>
        <label>
          Email:
          <input type="email" name="email" value={form.email} onChange={handleChange} />
        </label>
        <br />
        <label>
          Password:
          <input type="password" name="password" value={form.password} onChange={handleChange} />
        </label>
        <br />
        <button type="submit">Login</button>
      </form>
      {error && <div style={{ color: 'red', marginTop: 10 }}>{error}</div>}
    </div>
  );
};

export default Login;
