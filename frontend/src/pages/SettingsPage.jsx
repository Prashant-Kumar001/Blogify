import React, { useState, useEffect } from 'react';

const SettingsPage = () => {
  const themes = [
    "light", "dark", "cupcake", "bumblebee", "emerald", "corporate",
    "synthwave", "retro", "cyberpunk", "valentine", "halloween", "garden",
    "forest", "aqua", "lofi", "pastel", "fantasy", "wireframe", "black",
    "luxury", "dracula", "cmyk", "autumn", "business", "acid", "lemonade",
    "night", "coffee", "winter", "dim", "nord", "sunset",
  ];

  const [selectedTheme, setSelectedTheme] = useState(() => {
    // Get theme from local storage or default to 'light'
    return localStorage.getItem('theme') || 'light';
  });

  // Apply the selected theme to the document's root element and save it in local storage
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', selectedTheme);
    localStorage.setItem('theme', selectedTheme);
  }, [selectedTheme]);

  const handleThemeChange = (e) => {
    setSelectedTheme(e.target.value);
  };

  return (
    <div className="min-h-[75vh] flex flex-col justify-center items-center">
      <div className="dropdown mb-16">
        <button tabIndex={0} className="btn m-1 flex items-center gap-2">
          Theme
          <svg
            width="12px"
            height="12px"
            className="inline-block h-2 w-2 fill-current opacity-60"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 2048 2048"
          >
            <path d="M1799 349l242 241-1017 1017L7 590l242-241 775 775 775-775z"></path>
          </svg>
        </button>

        <ul
          tabIndex={0}
          className="dropdown-content bg-base-300 rounded-box z-10 w-52 p-2 shadow-2xl space-y-1 max-h-60 overflow-y-auto"
        >
          {themes.map((theme) => (
            <li key={theme}>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name="theme-dropdown"
                  className="theme-controller"
                  value={theme}
                  checked={selectedTheme === theme}
                  onChange={handleThemeChange}
                />
                <span className="capitalize">{theme}</span>
              </label>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default SettingsPage;
