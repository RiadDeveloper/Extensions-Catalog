import React from 'react';

export function LoadingSpinner() {
  return (
    <div className="flex justify-center items-center py-8">
      <div className="relative">
        {/* Main spinner */}
        <div className="w-12 h-12 border-4 border-blue-200 dark:border-blue-800 border-t-blue-600 dark:border-t-blue-400 rounded-full animate-spin"></div>
        
        {/* Inner spinner */}
        <div className="absolute top-2 left-2 w-8 h-8 border-4 border-transparent border-t-blue-400 dark:border-t-blue-300 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '0.8s' }}></div>
        
        {/* Pulsing dots */}
        <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-1">
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce animate-delay-100"></div>
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce animate-delay-200"></div>
        </div>
      </div>
    </div>
  );
}