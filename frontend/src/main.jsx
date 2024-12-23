import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { Toaster } from 'react-hot-toast';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { UserDataProvider } from '../src/context/UserData.jsx';
import ErrorBoundary from './components/ErrorBoundary.jsx'; // Import the ErrorBoundary

const queryClient = new QueryClient();

createRoot(document.getElementById('root')).render(
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <UserDataProvider>
          <App />
          <Toaster position="top-right" />
        </UserDataProvider>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </ErrorBoundary>
);
