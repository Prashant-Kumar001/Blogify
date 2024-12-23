import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';

const LoadingBar = () => {
  const location = useLocation();

  useEffect(() => {
    // Start NProgress when the route changes
    NProgress.start();
    const timer = setTimeout(() => {
      NProgress.done(); // End NProgress after a delay
    }, 500); // Adjust delay based on your needs

    return () => clearTimeout(timer); // Cleanup timer
  }, [location]);

  return null; // This component doesn't render anything
};

export default LoadingBar;
