import { useEffect, useState } from 'react';

function App() {
  const [health, setHealth] = useState(null);

  useEffect(() => {
    fetch('/api/health')
      .then((res) => res.json())
      .then(setHealth)
      .catch((err) => setHealth({ status: 'error', message: err.message }));
  }, []);

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>Shiloh City Church</h1>
      <p>Backend status: {health ? health.status : 'checking...'}</p>
      <p>Database: {health ? health.database : '...'}</p>
    </div>
  );
}

export default App;
