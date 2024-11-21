// src/components/Layout.js
import React from 'react';
import Header from './Header';
import Footer from './Footer';
import { Outlet } from 'react-router-dom'; // This will render the nested routes

const Layout = () => {
  return (
    <div>
      <Header />
      <main className='min-h-screen'>
        <Outlet />  {/* Nested routes will render here */}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;