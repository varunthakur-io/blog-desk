import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import Root from './Root.jsx';
import './index.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Root />
  </StrictMode>
);
