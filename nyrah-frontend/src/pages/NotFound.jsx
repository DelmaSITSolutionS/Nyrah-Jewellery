import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center p-6">
      <h1 className="text-6xl font-bold text-[#443627]">404</h1>
      <h2 className="text-2xl mt-4 font-semibold text-gray-800">Page Not Found</h2>
      <p className="text-gray-600 mt-2 max-w-md">
        Oops! The page you’re looking for doesn’t exist or has been moved.
      </p>
      <Link
        to="/"
        className="mt-6 inline-block px-6 py-2 text-white bg-black hover:bg-gray-800 transition rounded-full"
      >
        Back to Home
      </Link>
    </div>
  );
};

export default NotFound;
