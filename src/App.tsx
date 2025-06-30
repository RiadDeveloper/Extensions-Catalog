import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Menu, RefreshCw } from 'lucide-react';
import { Sidebar } from './components/Sidebar';
import { SearchBar } from './components/SearchBar';
import { ExtensionCard } from './components/ExtensionCard';
import { LoadingSpinner } from './components/LoadingSpinner';
import { Toast } from './components/Toast';
import { ThemeToggle } from './components/ThemeToggle';
import { useExtensions } from './hooks/useExtensions';
import { useLocalStorage } from './hooks/useLocalStorage';
import { useTheme } from './hooks/useTheme';
import { useInfiniteScroll } from './hooks/useInfiniteScroll';
import { communities } from './config/communities';

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedCommunities, setSelectedCommunities] = useLocalStorage<string[]>('selectedCommunities', ['all']);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' | null } | null>(null);
  
  // Theme management
  const { theme, resolvedTheme, setTheme } = useTheme();
  
  // Track if initial load has been triggered
  const initialLoadTriggered = useRef(false);

  const activeCommunities = useMemo(() => {
    return selectedCommunities.includes('all') || selectedCommunities.length === 0
      ? communities
      : communities.filter(c => selectedCommunities.includes(c.name));
  }, [selectedCommunities]);

  const {
    extensions,
    loading,
    searchTerm,
    hasMore,
    search,
    loadMore,
    refresh,
    loadExtensions
  } = useExtensions(activeCommunities);

  // Infinite scroll hook
  useInfiniteScroll({
    hasMore,
    loading,
    onLoadMore: loadMore,
    threshold: 300
  });

  // Initial load - only trigger once when communities change
  useEffect(() => {
    if (activeCommunities.length > 0 && !initialLoadTriggered.current) {
      initialLoadTriggered.current = true;
      loadExtensions();
    }
  }, [activeCommunities, loadExtensions]);

  // Reset initial load flag when communities change
  useEffect(() => {
    initialLoadTriggered.current = false;
  }, [activeCommunities]);

  // Keyboard shortcut for search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        const searchInput = document.querySelector('input[type="text"]') as HTMLInputElement;
        searchInput?.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setToast({ message, type });
  };

  const handleRefresh = async () => {
    await refresh();
    showToast('Extensions refreshed successfully', 'success');
  };

  const handleCommunityChange = (newCommunities: string[]) => {
    setSelectedCommunities(newCommunities);
    // Reset the initial load flag so it triggers for new communities
    initialLoadTriggered.current = false;
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 theme-transition">
      {/* Sidebar */}
      <Sidebar
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
        selectedCommunities={selectedCommunities}
        onCommunityChange={handleCommunityChange}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-700/50 px-4 py-6 lg:px-8 theme-transition animate-slide-in-right shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-3 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 btn-animate lg:hidden transition-all duration-200 hover:scale-105"
              >
                <Menu className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </button>
              <div className="hidden lg:block">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 dark:from-white dark:via-blue-200 dark:to-purple-200 bg-clip-text text-transparent animate-fade-in">
                  Extensions Catalog
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Discover amazing extensions for your projects
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4 animate-slide-in-left">
              <button
                onClick={handleRefresh}
                disabled={loading}
                className="p-3 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 btn-animate disabled:opacity-50 transition-all duration-200 hover:scale-105 group"
                title="Refresh extensions"
              >
                <RefreshCw className={`
                  w-5 h-5 text-gray-600 dark:text-gray-400 
                  transition-all duration-300 
                  ${loading ? 'animate-spin text-blue-500 dark:text-blue-400' : 'group-hover:rotate-180'}
                `} />
              </button>
              <div className="animate-scale-in animate-delay-100">
                <ThemeToggle theme={theme} onThemeChange={setTheme} />
              </div>
            </div>
          </div>

          {/* Enhanced Search Bar */}
          <div className="animate-slide-up animate-delay-300">
            <SearchBar
              onSearch={search}
              loading={loading}
            />
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-auto p-4 lg:p-8">
          {/* Results Info */}
          <div className="mb-8 animate-fade-in animate-delay-500">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  {searchTerm ? (
                    <span className="flex items-center space-x-2">
                      <span>Search Results</span>
                      <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium">
                        "{searchTerm}"
                      </span>
                    </span>
                  ) : (
                    'All Extensions'
                  )}
                </h2>
                <p className="text-gray-600 dark:text-gray-400 flex items-center space-x-2">
                  <span className="inline-flex items-center space-x-1">
                    <div className={`w-2 h-2 rounded-full ${extensions.length > 0 ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`} />
                    <span className="font-medium">{extensions.length}</span>
                    <span>{extensions.length === 1 ? 'extension' : 'extensions'} found</span>
                  </span>
                  {activeCommunities.length < communities.length && (
                    <span className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded-full">
                      {activeCommunities.length} communities selected
                    </span>
                  )}
                </p>
              </div>
            </div>
          </div>

          {/* Extensions Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
            {extensions.map((extension, index) => (
              <ExtensionCard
                key={`${extension.community}-${extension.id}`}
                extension={extension}
                index={index}
              />
            ))}
          </div>

          {/* Loading Indicator for Infinite Scroll */}
          {loading && extensions.length > 0 && (
            <div className="mt-12 animate-bounce-in">
              <div className="flex justify-center items-center py-8">
                <div className="flex items-center space-x-3 px-6 py-3 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl shadow-lg border border-gray-200/50 dark:border-gray-700/50">
                  <div className="w-5 h-5 border-2 border-blue-500/30 dark:border-blue-400/30 border-t-blue-500 dark:border-t-blue-400 rounded-full animate-spin" />
                  <span className="text-blue-600 dark:text-blue-400 font-medium">Loading more extensions...</span>
                </div>
              </div>
            </div>
          )}

          {/* Initial Loading */}
          {loading && extensions.length === 0 && (
            <div className="mt-12 animate-bounce-in">
              <LoadingSpinner />
            </div>
          )}

          {/* End of Results Indicator */}
          {!loading && !hasMore && extensions.length > 0 && (
            <div className="mt-12 text-center animate-fade-in">
              <div className="inline-flex items-center space-x-3 px-6 py-3 bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 rounded-2xl text-gray-600 dark:text-gray-400 shadow-lg">
                <div className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-pulse" />
                <span className="font-medium">You've reached the end</span>
                <div className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-pulse" />
              </div>
            </div>
          )}

          {/* No Results */}
          {!loading && extensions.length === 0 && (
            <div className="text-center py-16 animate-fade-in">
              <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 rounded-2xl flex items-center justify-center mx-auto mb-6 animate-float shadow-lg">
                <Menu className="w-10 h-10 text-gray-400 dark:text-gray-500" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 animate-slide-up animate-delay-200">
                No extensions found
              </h3>
              <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto animate-slide-up animate-delay-300">
                {searchTerm 
                  ? `No extensions match your search "${searchTerm}". Try different keywords or check your spelling.`
                  : 'Try selecting different communities or search for specific extensions to get started.'
                }
              </p>
              {searchTerm && (
                <button
                  onClick={() => search('')}
                  className="mt-6 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl font-medium btn-animate shadow-lg hover:shadow-xl animate-slide-up animate-delay-400"
                >
                  Clear search and show all
                </button>
              )}
            </div>
          )}
        </main>
      </div>

      {/* Toast Notifications */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type || 'info'}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}

export default App;