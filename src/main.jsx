import React from 'react'
import ReactDOM from 'react-dom/client'
import App from '@/App.jsx'
import '@/index.css'

// Suppress unhandled errors/rejections from third-party ad scripts
window.addEventListener('unhandledrejection', (e) => {
  const msg = String(e?.reason?.message || e?.reason?.name || e?.reason || '');
  if (msg.includes('IDBDatabase') || msg.includes('InvalidStateError') || msg.includes('transaction') || msg.includes('closing')) {
    e.preventDefault();
    e.stopImmediatePropagation();
  }
}, true);

ReactDOM.createRoot(document.getElementById('root')).render(
  <App />
)