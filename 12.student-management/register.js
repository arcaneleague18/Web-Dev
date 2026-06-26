import React, { useState } from 'react';

// Registration form with basic validation
const Register = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

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
      <form onSubmit={handleSubmit}>
        <label>
          Name:
          <input type="text" name="name" value={form.name} onChange={handleChange} />
        </label>
        <br />
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
        <button type="submit">Submit</button>
      </form>
      {error && <div style={{ color: 'red', marginTop: 10 }}>{error}</div>}
    </div>
  );
};

export default Register;
