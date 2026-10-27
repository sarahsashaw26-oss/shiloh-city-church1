import { useState } from 'react';
import MemberRegister from './components/MemberRegister';
import MemberLogin from './components/MemberLogin';
import VisitorForm from './components/VisitorForm';

const tabs = {
  register: { label: 'Register', Component: MemberRegister },
  login: { label: 'Log in', Component: MemberLogin },
  visitor: { label: 'Visitor', Component: VisitorForm },
};

export default function App() {
  const [active, setActive] = useState('register');
  const { Component } = tabs[active];

  return (
    <main style={{ maxWidth: 420, margin: '2rem auto', fontFamily: 'sans-serif' }}>
      <h1>Shiloh City Church</h1>
      <nav style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
        {Object.entries(tabs).map(([key, { label }]) => (
          <button key={key} onClick={() => setActive(key)} disabled={key === active}>
            {label}
          </button>
        ))}
      </nav>
      <Component />
    </main>
  );
}