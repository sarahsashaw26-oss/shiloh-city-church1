import { useState } from 'react';
import { apiRequest } from '../api';

const emptyForm = { first_name: '', last_name: '', email: '', phone: '', password: '' };

export default function MemberRegister() {
  const [form, setForm] = useState(emptyForm);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setMessage('');
    setSubmitting(true);
    try {
      await apiRequest('/members/register', { method: 'POST', body: JSON.stringify(form) });
      setMessage('Registration successful. You can now log in.');
      setForm(emptyForm);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>Member Registration</h2>
      <input name="first_name" placeholder="First name" value={form.first_name} onChange={handleChange} required />
      <input name="last_name" placeholder="Last name" value={form.last_name} onChange={handleChange} required />
      <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} required />
      <input name="phone" placeholder="Phone" value={form.phone} onChange={handleChange} />
      <input name="password" type="password" placeholder="Password (min 8 characters)" minLength={8} value={form.password} onChange={handleChange} required />
      <button type="submit" disabled={submitting}>{submitting ? 'Registering...' : 'Register'}</button>
      {message && <p>{message}</p>}
      {error && <p style={{ color: 'crimson' }}>{error}</p>}
    </form>
  );
}