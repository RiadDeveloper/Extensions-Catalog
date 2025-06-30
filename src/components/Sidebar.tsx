import React from 'react';
import * as LucideIcons from 'lucide-react';
import { Community } from '../types';
import { communities } from '../config/communities';

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  selectedCommunities: string[];
  onCommunityChange: (communities: string[]) => void;
}

export function Sidebar({ 
  isOpen, 
  onToggle, 
  selectedCommunities, 
  onCommunityChange
}: SidebarProps) {
  const [isCommunitiesExpanded, setIsCommunitiesExpanded] = React.useState(true);

  const handleCommunityToggle = (communityName: string) => {
    if (communityName === 'all') {
      onCommunityChange(['all']);
    } else {
      const newSelection = selectedCommunities.includes(communityName)
        ? selectedCommunities.filter(name => name !== communityName)
        : [...selectedCommunities.filter(name => name !== 'all'), communityName];
      
      onCommunityChange(newSelection.length === 0 ? ['all'] : newSelection);
    }
  };

  const isAllSelected = selectedCommunities.includes('all') || selectedCommunities.length === 0;

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden animate-fade-in"
          onClick={onToggle}
        />
      )}
      
      {/* Sidebar */}
      <div className={`
        fixed top-0 left-0 h-full bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 z-50 lg:z-30
        transform transition-all duration-300 ease-out theme-transition
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:static lg:transform-none
        w-80 flex flex-col shadow-xl lg:shadow-none
      `}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 animate-slide-in-left">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center animate-bounce-in shadow-lg">
              <LucideIcons.Puzzle className="w-4 h-4 text-white" />
            </div>
            <h1 className="text-lg font-bold text-gray-900 dark:text-white animate-fade-in animate-delay-200">Extensions Catalog</h1>
          </div>
          <button
            onClick={onToggle}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 btn-animate lg:hidden"
          >
            <LucideIcons.X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {/* Dashboard */}
          <div className="flex items-center space-x-3 px-3 py-2 rounded-lg bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 text-blue-700 dark:text-blue-300 animate-slide-in-left animate-delay-300 shadow-sm">
            <LucideIcons.Home className="w-5 h-5" />
            <span className="font-medium">Dashboard</span>
          </div>

          {/* Communities Section */}
          <div className="pt-4 animate-slide-in-left animate-delay-500">
            <button
              onClick={() => setIsCommunitiesExpanded(!isCommunitiesExpanded)}
              className="flex items-center justify-between w-full px-3 py-2 text-left text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg btn-animate"
            >
              <div className="flex items-center space-x-3">
                <LucideIcons.Puzzle className="w-5 h-5" />
                <span className="font-medium">Extensions</span>
              </div>
              <div className={`transition-transform duration-200 ${isCommunitiesExpanded ? 'rotate-180' : ''}`}>
                <LucideIcons.ChevronDown className="w-4 h-4" />
              </div>
            </button>

            <div className={`ml-6 mt-2 space-y-1 transition-all duration-300 overflow-hidden ${
              isCommunitiesExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
            }`}>
              {/* All Communities */}
              <label className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer btn-animate animate-slide-in-left animate-delay-100">
                <input
                  type="checkbox"
                  checked={isAllSelected}
                  onChange={() => handleCommunityToggle('all')}
                  className="w-4 h-4 text-blue-600 border-gray-300 dark:border-gray-600 rounded focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-gray-700 transition-all"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300 font-medium">All Communities</span>
              </label>

              {/* Individual Communities */}
              {communities.map((community, index) => {
                const IconComponent = LucideIcons[community.icon as keyof typeof LucideIcons] || LucideIcons.Puzzle;
                
                return (
                  <label 
                    key={community.name}
                    className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer btn-animate animate-slide-in-left"
                    style={{ animationDelay: `${(index + 2) * 0.1}s` }}
                  >
                    <input
                      type="checkbox"
                      checked={selectedCommunities.includes(community.name)}
                      onChange={() => handleCommunityToggle(community.name)}
                      className="w-4 h-4 text-blue-600 border-gray-300 dark:border-gray-600 rounded focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-gray-700 transition-all"
                    />
                    <div 
                      className="w-4 h-4 rounded transition-transform hover:scale-110"
                      style={{ color: community.color }}
                    >
                      <IconComponent />
                    </div>
                    <span className="text-sm text-gray-700 dark:text-gray-300">{community.name}</span>
                  </label>
                );
              })}
            </div>
          </div>
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 animate-fade-in animate-delay-500">
          <p className="text-xs text-gray-500 dark:text-gray-400 text-center">Riad Developer</p>
        </div>
      </div>
    </>
  );
}