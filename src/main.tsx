// Show loading page on first visit
if (!sessionStorage.getItem('loaded')) {
  sessionStorage.setItem('loaded', 'true')
  window.location.replace('/loading.html')
}
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
