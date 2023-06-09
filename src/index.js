import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { AudioLogicProvider } from './logic/AudioLogicContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <BrowserRouter>
    <AudioLogicProvider>
      <App />
    </AudioLogicProvider>
  </BrowserRouter>,
);

