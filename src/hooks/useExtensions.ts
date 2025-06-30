import { useState, useCallback, useRef } from 'react';
import { Extension, Community } from '../types';
import { extensionService } from '../services/extensionService';
import { INITIAL_LOAD_COUNT } from '../config/communities';

export function useExtensions(communities: Community[]) {
  const [extensions, setExtensions] = useState<Extension[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  
  // Use ref to track if we're already loading to prevent duplicate calls
  const isLoadingRef = useRef(false);

  const loadExtensions = useCallback(async (
    term: string = '',
    currentOffset: number = 0,
    append: boolean = false
  ) => {
    // Prevent duplicate calls
    if (isLoadingRef.current) return;
    
    isLoadingRef.current = true;
    setLoading(true);
    
    try {
      const newExtensions = await extensionService.fetchMultipleCommunities(
        communities,
        term,
        currentOffset
      );

      if (append) {
        setExtensions(prev => [...prev, ...newExtensions]);
      } else {
        setExtensions(newExtensions);
      }

      setHasMore(newExtensions.length >= INITIAL_LOAD_COUNT);
    } catch (error) {
      console.error('Error loading extensions:', error);
    } finally {
      setLoading(false);
      isLoadingRef.current = false;
    }
  }, [communities]);

  const search = useCallback(async (term: string) => {
    // Don't search if already loading
    if (isLoadingRef.current) return;
    
    setSearchTerm(term);
    setOffset(0);
    extensionService.clearCache();
    await loadExtensions(term, 0, false);
  }, [loadExtensions]);

  const loadMore = useCallback(async () => {
    // Don't load more if already loading
    if (isLoadingRef.current) return;
    
    const newOffset = offset + INITIAL_LOAD_COUNT;
    setOffset(newOffset);
    await loadExtensions(searchTerm, newOffset, true);
  }, [loadExtensions, offset, searchTerm]);

  const refresh = useCallback(async () => {
    // Don't refresh if already loading
    if (isLoadingRef.current) return;
    
    extensionService.clearCache();
    setOffset(0);
    await loadExtensions(searchTerm, 0, false);
  }, [loadExtensions, searchTerm]);

  // Initial load function that should only be called once per community change
  const initialLoad = useCallback(async () => {
    // Don't load if already loading or if no communities
    if (isLoadingRef.current || communities.length === 0) return;
    
    setOffset(0);
    await loadExtensions('', 0, false);
  }, [loadExtensions, communities]);

  return {
    extensions,
    loading,
    searchTerm,
    hasMore,
    search,
    loadMore,
    refresh,
    loadExtensions: initialLoad // Rename to make it clear this is for initial loading
  };
}