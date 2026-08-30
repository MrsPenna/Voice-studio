import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// Register Service Worker for PWA
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js').catch(error => {
    console.warn('Service Worker registration failed:', error);
  });
}

// Handle online/offline events
window.addEventListener('online', () => {
  window.dispatchEvent(new CustomEvent('app-online-status', { detail: true }));
});

window.addEventListener('offline', () => {
  window.dispatchEvent(new CustomEvent('app-online-status', { detail: false }));
});

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
