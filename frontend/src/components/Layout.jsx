import React from 'react';
import Header from './Header';
import Footer from './Footer';
import { Outlet } from 'react-router-dom';
import ScrollToTop from './ScrollToTop';
import Home from '../pages/Home';
import LoadingBar from './loadingBar';
import RedirectLoader from './RedirectLoader';

const Layout = () => {
  return (
    <div>
      {/* Display a loading bar to track route changes */}
      <LoadingBar />

      {/* Ensure page resets scroll position on route change */}
      <ScrollToTop />

      {/* Display header */}
      <Header />
      
      {/* RedirectLoader component for handling redirects */}

      {/* Main content area with a minimum height */}
      <main className="min-h-screen">
        <Outlet /> {/* Renders nested routes here */}
      </main>

      {/* Display footer */}
      <Footer />
    </div>
  );
};

export default Layout;
