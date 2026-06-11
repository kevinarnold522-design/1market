import React from 'react'
import ReactDOM from 'react-dom/client'
import App from '@/App.jsx'
import '@/index.css'

// Suppress unhandled errors/rejections from third-party ad scripts
window.addEventListener('unhandledrejection', (e) => {
  const msg = e?.reason?.message || '';
  if (msg.includes('IDBDatabase') || msg.includes('transaction') || msg.includes('closing')) {
    e.preventDefault();
  }
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <App />
)