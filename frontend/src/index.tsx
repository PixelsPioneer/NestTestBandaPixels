import React from 'react';
import ReactDOM from 'react-dom/client';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import App from './App';
import reportWebVitals from './reportWebVitals';

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <ToastContainer />
      <App />
    </QueryClientProvider>
  </React.StrictMode>,
);

reportWebVitals(console.log);
