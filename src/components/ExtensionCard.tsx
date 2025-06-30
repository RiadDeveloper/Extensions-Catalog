import React from 'react';
import { ExternalLink, Calendar, MessageCircle, Reply, CheckCircle } from 'lucide-react';
import { Extension } from '../types';
import { communities } from '../config/communities';

interface ExtensionCardProps {
  extension: Extension;
  index?: number;
}

export function ExtensionCard({ extension, index = 0 }: ExtensionCardProps) {
  const community = communities.find(c => c.name === extension.community);
  const formattedDate = new Date(extension.createdAt).toLocaleDateString('en');

  return (
    <div 
      className={`
        bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 
        hover:border-gray-300 dark:hover:border-gray-600 shadow-sm hover:shadow-lg 
        dark:shadow-gray-900/20 dark:hover:shadow-gray-900/40 
        card-hover theme-transition h-full flex flex-col
        animate-fade-in
      `}
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <div className="p-6 flex flex-col h-full">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2 min-h-[3.5rem]">
              {extension.title}
            </h3>
            
            {/* Community Badge */}
            <div className="flex items-center space-x-2 mb-3">
              <div 
                className="w-2 h-2 rounded-full animate-pulse-slow"
                style={{ backgroundColor: community?.color || '#6B7280' }}
              />
              <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                {extension.community}
              </span>
              {extension.hasAcceptedAnswer && (
                <div className="flex items-center space-x-1 text-green-600 dark:text-green-400 animate-bounce-in">
                  <CheckCircle className="w-4 h-4" />
                  <span className="text-xs font-medium">Solved</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="flex-1 mb-4">
          {extension.blurb && (
            <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-3 min-h-[4.5rem]">
              {extension.blurb}
            </p>
          )}
        </div>

        {/* Stats */}
        <div className="flex items-center space-x-4 mb-6 text-sm text-gray-500 dark:text-gray-400">
          <div className="flex items-center space-x-1 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
            <Calendar className="w-4 h-4" />
            <span>{formattedDate}</span>
          </div>
          <div className="flex items-center space-x-1 hover:text-green-600 dark:hover:text-green-400 transition-colors">
            <MessageCircle className="w-4 h-4" />
            <span>{extension.postsCount} Posts</span>
          </div>
          <div className="flex items-center space-x-1 hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
            <Reply className="w-4 h-4" />
            <span>{extension.replyCount} Replies</span>
          </div>
        </div>

        {/* Action Button - Always at bottom */}
        <div className="mt-auto">
          <a
            href={extension.topicUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center space-x-2 w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 dark:from-blue-500 dark:to-blue-600 dark:hover:from-blue-600 dark:hover:to-blue-700 text-white rounded-lg font-medium text-sm btn-animate group/button shadow-md hover:shadow-lg"
          >
            <span>View Topic</span>
            <ExternalLink className="w-4 h-4 group-hover/button:translate-x-1 group-hover/button:-translate-y-1 transition-transform duration-200" />
          </a>
        </div>
      </div>
    </div>
  );
}