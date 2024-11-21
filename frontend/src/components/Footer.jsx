// src/components/Footer.js
import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 py-3">
      <div className="container mx-auto px-4 md:flex md:justify-between md:items-center">

        {/* Footer Brand */}
        <div className="mb-3 md:mb-0">
          <h1 className="text-2xl font-bold text-white">My Blog Website</h1>
          <p className="text-sm text-gray-400 mt-1">&copy; 2024 My Blog Website. All rights reserved.</p>
        </div>

        <div className="flex space-x-4">
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white">
            <FaFacebook size={24} />
          </a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white">
            <FaTwitter size={24} />
          </a>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white">
            <FaInstagram size={24} />
          </a>
          <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white">
            <FaLinkedin size={24} />
          </a>
        </div>
      </div>

      {/* Footer Disclaimer */}
      <div className="mt-2 text-center text-sm text-gray-500">
        <p>This site is for informational purposes only. Content may not be reproduced without permission.</p>
      </div>
    </footer>
  );
};

export default Footer;
