import { useState } from 'react';
import { apiRequest } from '../api';

const emptyForm = {
  first_name: '', last_name: '', phone: '', email: '',
  visit_date: '', how_heard: '', invited_by: '', notes: '',
};

export default function VisitorForm() {
  const [form, setForm] = useState(emptyForm);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setMessage('');
    try {
      await apiRequest('/visitors', { method: 'POST', body: JSON.stringify(form) });
      setMessage('Visitor recorded. Thank you for visiting!');
      setForm(emptyForm);
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>First-Time Visitor</h2>
      <input name="first_name" placeholder="First name" value={form.first_name} onChange={handleChange} required />
      <input name="last_name" placeholder="Last name" value={form.last_name} onChange={handleChange} />
      <input name="phone" placeholder="Phone" value={form.phone} onChange={handleChange} />
      <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} />
      <label>Visit date <input name="visit_date" type="date" value={form.visit_date} onChange={handleChange} required /></label>
      <input name="how_heard" placeholder="How did you hear about us?" value={form.how_heard} onChange={handleChange} />
      <input name="invited_by" placeholder="Invited by" value={form.invited_by} onChange={handleChange} />
      <textarea name="notes" placeholder="Notes" value={form.notes} onChange={handleChange} />
      <button type="submit">Submit</button>
      {message && <p>{message}</p>}
      {error && <p style={{ color: 'crimson' }}>{error}</p>}
    </form>
  );
}