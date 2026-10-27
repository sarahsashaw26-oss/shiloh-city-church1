import { useState } from 'react';
import { apiRequest } from '../api';

export default function MemberLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [member, setMember] = useState(null);
  const [error, setError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    try {
      const data = await apiRequest('/members/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
      localStorage.setItem('token', data.token);
      setMember(data.member);
    } catch (err) {
      setError(err.message);
    }
  }

  if (member) {
    return <p>Welcome, {member.first_name}! You are logged in.</p>;
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>Member Login</h2>
      <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
      <button type="submit">Log in</button>
      {error && <p style={{ color: 'crimson' }}>{error}</p>}
    </form>
  );
}