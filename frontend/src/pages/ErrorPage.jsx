import React from 'react';

const ErrorPage = ({ title = "Oops! Something went wrong", message = "An unexpected error occurred.", onRetry }) => {
  return (
    <div className="flex flex-col items-center justify-center p-6 border border-gray-200 rounded-lg shadow-lg bg-white max-w-md mx-auto mt-10">
      <h1 className="text-xl font-bold text-gray-800 mb-2">{title}</h1>
      <p className="text-gray-600 mb-4">{message}</p>
      {onRetry && (
        <button
          className="px-4 py-2 mb-4 text-white bg-blue-600 rounded hover:bg-blue-700 focus:outline-none"
          onClick={onRetry}
        >
          Retry
        </button>
      )}
      <a
        href="/"
        className="text-blue-500 hover:underline"
      >
        Go back to the homepage
      </a>
    </div>
  );
};

export default ErrorPage;
