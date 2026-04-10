import { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import { toast, Toaster } from 'react-hot-toast';
import { RouterProvider } from 'react-router-dom';

import { router } from './router';
import './index.css';
import LoadingSpinner from './components/LoadingSpinner';

function App() {
  return (
    <Suspense fallback={<LoadingSpinner fullScreen />}>
      <Toaster position="top-right" />
      <RouterProvider router={router} />
    </Suspense>
  );
}

const root = document.getElementById('root')!;
ReactDOM.createRoot(root).render(<App />);
