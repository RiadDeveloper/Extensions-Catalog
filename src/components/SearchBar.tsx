import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Sparkles } from 'lucide-react';

interface SearchBarProps {
  onSearch: (term: string) => void;
  loading: boolean;
}

export function SearchBar({ onSearch, loading }: SearchBarProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedTerm, setDebouncedTerm] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedTerm(searchTerm);
      setIsTyping(false);
    }, 500);

    if (searchTerm) {
      setIsTyping(true);
    }

    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    onSearch(debouncedTerm);
  }, [debouncedTerm, onSearch]);

  const handleClear = () => {
    setSearchTerm('');
    setDebouncedTerm('');
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      handleClear();
    }
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      {/* Search Container */}
      <div className={`
        relative group overflow-hidden
        transition-all duration-500 ease-out
        ${isFocused ? 'transform scale-[1.02]' : ''}
      `}>
        {/* Background Gradient */}
        <div className={`
          absolute inset-0 rounded-2xl transition-all duration-500
          ${isFocused 
            ? 'bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 dark:from-blue-400/20 dark:via-purple-400/20 dark:to-pink-400/20' 
            : 'bg-transparent'
          }
        `} />
        
        {/* Main Input Container */}
        <div className={`
          relative flex items-center
          bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl
          border-2 rounded-2xl shadow-lg
          transition-all duration-500 ease-out
          ${isFocused 
            ? 'border-blue-500/50 dark:border-blue-400/50 shadow-2xl shadow-blue-500/20 dark:shadow-blue-400/20' 
            : 'border-gray-200/50 dark:border-gray-700/50 hover:border-gray-300/70 dark:hover:border-gray-600/70 shadow-md'
          }
          ${loading && !isFocused ? 'border-blue-400/60 dark:border-blue-500/60' : ''}
        `}>
          
          {/* Search Icon */}
          <div className={`
            absolute left-4 flex items-center pointer-events-none z-10
            transition-all duration-300
            ${isFocused ? 'transform scale-110' : ''}
          `}>
            {loading ? (
              <div className="relative">
                <Search className="w-5 h-5 text-blue-500 dark:text-blue-400 animate-pulse" />
                <div className="absolute inset-0 w-5 h-5 border-2 border-blue-500/30 dark:border-blue-400/30 border-t-blue-500 dark:border-t-blue-400 rounded-full animate-spin" />
              </div>
            ) : (
              <Search className={`
                w-5 h-5 transition-all duration-300
                ${isFocused 
                  ? 'text-blue-600 dark:text-blue-400 transform rotate-12' 
                  : 'text-gray-400 dark:text-gray-500'
                }
              `} />
            )}
          </div>

          {/* Input Field */}
          <input
            ref={inputRef}
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            onKeyDown={handleKeyDown}
            placeholder="Search for amazing extensions..."
            className={`
              w-full h-14 pl-14 pr-14 
              bg-transparent text-gray-900 dark:text-white 
              placeholder-gray-500 dark:placeholder-gray-400
              font-medium text-base
              border-none outline-none
              transition-all duration-300
              ${isFocused ? 'placeholder-gray-400 dark:placeholder-gray-500' : ''}
            `}
            disabled={loading}
          />

          {/* Clear Button */}
          {searchTerm && (
            <button
              onClick={handleClear}
              className={`
                absolute right-4 p-2 rounded-full
                text-gray-400 dark:text-gray-500 
                hover:text-gray-600 dark:hover:text-gray-300
                hover:bg-gray-100 dark:hover:bg-gray-700
                transition-all duration-200
                transform hover:scale-110 active:scale-95
                ${searchTerm ? 'animate-scale-in opacity-100' : 'opacity-0'}
              `}
            >
              <X className="w-4 h-4" />
            </button>
          )}

          {/* Typing Indicator */}
          {isTyping && !loading && (
            <div className="absolute right-16 flex items-center space-x-1">
              <div className="flex space-x-1">
                <div className="w-1.5 h-1.5 bg-blue-500 dark:bg-blue-400 rounded-full animate-bounce" />
                <div className="w-1.5 h-1.5 bg-blue-500 dark:bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                <div className="w-1.5 h-1.5 bg-blue-500 dark:bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
              </div>
            </div>
          )}
        </div>

        {/* Sparkle Effects */}
        {isFocused && (
          <>
            <div className="absolute -top-1 -left-1 w-3 h-3 text-blue-400 animate-ping opacity-75">
              <Sparkles className="w-full h-full" />
            </div>
            <div className="absolute -bottom-1 -right-1 w-2 h-2 text-purple-400 animate-ping opacity-75" style={{ animationDelay: '0.5s' }}>
              <Sparkles className="w-full h-full" />
            </div>
            <div className="absolute top-1/2 -right-2 w-2.5 h-2.5 text-pink-400 animate-ping opacity-75" style={{ animationDelay: '1s' }}>
              <Sparkles className="w-full h-full" />
            </div>
          </>
        )}
      </div>

      {/* Search Suggestions/Status */}
      <div className={`
        mt-3 text-center transition-all duration-300
        ${(isFocused || searchTerm) ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform -translate-y-2'}
      `}>
        {searchTerm && !loading && (
          <p className="text-sm text-gray-600 dark:text-gray-400">
            <span className="inline-flex items-center space-x-1">
              <Search className="w-3 h-3" />
              <span>Searching for "{searchTerm}"</span>
            </span>
          </p>
        )}
        {loading && searchTerm && (
          <p className="text-sm text-blue-600 dark:text-blue-400 animate-pulse">
            <span className="inline-flex items-center space-x-2">
              <div className="w-3 h-3 border border-blue-600 dark:border-blue-400 border-t-transparent rounded-full animate-spin" />
              <span>Finding extensions...</span>
            </span>
          </p>
        )}
        {!searchTerm && isFocused && (
          <p className="text-sm text-gray-500 dark:text-gray-400">
          </p>
        )}
      </div>

      {/* Keyboard Shortcut Hint */}
      <div className={`
        absolute top-1/2 right-6 transform -translate-y-1/2
        transition-all duration-300
        ${!searchTerm && !isFocused ? 'opacity-60' : 'opacity-0 pointer-events-none'}
      `}>
        <div className="hidden sm:flex items-center space-x-1 text-xs text-gray-400 dark:text-gray-500">
          <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded border text-xs">⌘</kbd>
          <span>+</span>
          <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded border text-xs">K</kbd>
        </div>
      </div>
    </div>
  );
}