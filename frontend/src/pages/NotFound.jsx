import React from "react";
import { Link } from "react-router-dom";
import { FiArrowLeft, FiHome, FiBookOpen } from "react-icons/fi";

const NotFound = () => {
  return (
    <div className="relative min-h-screen bg-gray-900 text-gray-100">
      <div className="absolute inset-0 bg-linear-to-br from-gray-900 via-gray-900 to-blue-900/20"></div>

      <div className="fixed top-6 left-4 sm:top-8 sm:left-6 z-50">
        <Link
          to="/"
          className="inline-flex items-center text-gray-300 hover:text-white transition-all group bg-gray-800/90 px-4 py-2.5 rounded-xl border border-gray-700/50 hover:border-blue-500/50 hover:bg-gray-800 backdrop-blur-sm shadow-lg"
        >
          <FiArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-medium">Back to Home</span>
        </Link>
      </div>

      <div className="fixed top-6 right-4 sm:top-8 sm:right-6 z-50">
        <div className="text-xl sm:text-2xl font-bold bg-linear-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          CodeMaster
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 relative z-10 min-h-screen flex items-center justify-center">
        <div className="max-w-4xl mx-auto w-full">
          <div className="bg-gray-800/40 backdrop-blur-sm border border-gray-700/50 rounded-3xl p-8 sm:p-12 lg:p-16 text-center shadow-2xl">
            <div className="relative mb-8 sm:mb-12">
              <div className="text-8xl sm:text-9xl lg:text-[10rem] font-bold bg-linear-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent leading-none">
                404
              </div>
              <div className="absolute inset-0 flex items-center justify-center opacity-5">
                <FiBookOpen className="w-48 h-48 sm:w-64 sm:h-64 text-white" />
              </div>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4">
              Page Not Found
            </h1>

            <p className="text-gray-400 text-base sm:text-lg mb-10 max-w-2xl mx-auto">
              The page you're looking for doesn't exist or has been moved. Let's
              get you back on track.
            </p>

            <div className="flex flex-col items-center justify-center max-w-md mx-auto">
              <Link
                to="/"
                className="group w-full sm:w-auto px-8 py-4 bg-linear-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all shadow-lg hover:shadow-blue-500/25 flex items-center justify-center"
              >
                <FiHome className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                Go to Homepage
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 py-6 border-t border-gray-800/80 text-center bg-gray-900/80 backdrop-blur-sm">
        <p className="text-gray-500 text-sm">
          © 2024 CodeMaster. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default NotFound;
